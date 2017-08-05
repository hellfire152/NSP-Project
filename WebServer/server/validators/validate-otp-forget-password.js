//login

const uuid = require('uuid');
module.exports = function(cipher, appConn, C, xssDefense, cookieValidator) {
  return function(req, res) {
    req.sanitize('otp').escape();

    var errors = req.validationErrors();

    if(errors) {
      if(!(response.data.success)){
        res.sendErrorPage('Error 404: Not found!');
    } else {
      var userOTP = req.body.otp;
      var otpObj = req.cookies.otp.data

      console.log(otpObj);
      console.log(req.cookies.otp.data.pin);
      console.log(userOTP);
      console.log(userOTP == otpObj.pin);
      if(userOTP == otpObj.pin){

      cipher.encryptJSON(cookieValidator.generateCheckCookie({user_id : otpObj.user_id}))
      .then((encryptedCookie) => {
        res.cookie('temp_user_id', encryptedCookie, {"maxAge": 1000*60*5});
        req.session.otpSession = undefined; //Open the session
        res.clearCookie("otp");
        res.redirect('/ChangePassword');
      });
      }
      else{
        //Go back to OTP page and try again
        //More than 3 time boot out and clear cookies
        if(otpObj.count < 3){
          otpObj.count++;
          req.session.otpSession = true; //Open the session

          cipher.encryptJSON(cookieValidator.generateCheckCookie(otpObj))
          .then((encryptedCookie) => {

            res.cookie('otp', encryptedCookie, {"maxAge": 1000*60*5}); //5 min
            res.redirect('/otp-ForgetPassword');
          });
        }
        else{
          console.log("HERE");
          res.clearCookie("otp");
          req.session.otpSession = undefined;
          res.redirect('/student-login');
        }
      }
    }
  }
}
}
