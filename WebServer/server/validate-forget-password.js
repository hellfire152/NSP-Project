const uuid = require('uuid');
module.exports = function(cipher, appConn, C, xssDefense) {
  return function(req, res) {
    req.sanitize('otp').escape();


    var errors = req.validationErrors();


    if(errors) {
      //TODO::Handle errors
    } else {
      var userOTP = req.body.otp;
      var otpObj = JSON.parse(req.cookies.otp);

      if(userOTP == otpObj.pin){
        res.cookie('temp_user_id', JSON.stringify({user_id : otpObj.user_id}), {"maxAge": 1000*60*5});
        res.clearCookie("otp");
        res.redirect('/changeForgetPassword');
      }
      else{
        //Go back to OTP page and try again
        //More than 3 time boot out and clear cookies
        if(otpObj.count < 3){
          otpObj.count++;
          res.cookie('otp', JSON.stringify(otpObj), {"maxAge": 1000*60*5}); //5 min
          res.redirect('/otp');
        }
        else{
          console.log("HERE");
          res.clearCookie("otp");
          res.redirect('/LoginForm');
        }
      }
    }
  }
}
