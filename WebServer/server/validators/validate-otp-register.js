//register
const uuid = require('uuid');
module.exports = function(cipher, appConn, C) {
  return function(req, res) {
    req.sanitize('register-otp').escape();

    var errors = req.validationErrors();

    if(errors) {
      //TODO::Handle errors
    } else {
      var userOTP = req.body.otp;
      var otpObj = req.cookies.userOTP;

      if(userOTP == otpObj.pin){
        //TODO: Get data from database and send to client and redirect to new page
        appConn.send({
          'type' : C.REQ_TYPE.DATABASE,
          'data' : {
            type : C.DB.SELECT.FULL_USER_ACCOUNT,
            user_id : otpObj.user_id
          }
        } ,(response) => {
            console.log("SUCCESS");
            appConn.send({
              'type' : C.REQ_TYPE.DATABASE,
              'data' : {
                type : C.DB.CREATE.IP_ADDRESS,
                inputData : {
                  user_id : otpObj.user_id,
                  // ip_address : "5555"
                  //
                  ip_address : Math.floor((Math.random() * 10000) + 1).toString() //Mock up of new IP address TODO: Get IP address from client
                }
              }
            }, (response2) => {
              res.clearCookie("otp");
              if(req.cookies.deviceIP != undefined){
                var ipArr = req.cookies.deviceIP;
                console.log(ipArr);
                ipArr.push(response2.data.data.hashedIpAddress);
                //set device IP cookie
                cipher.encryptJSON(ipArr)
                  .then((encryptedCookie) => {
                    res.cookie('deviceIP', encryptedCookie, {"maxAge": 1000*60*60*24*30}); // max age: 30 days
                  });
              }
              else{
                var newIpArr = [response2.data.data.hashedIpAddress];
                cipher.encryptJSON(ipArr)
                  .then((encryptedCookie) => {
                    res.cookie('deviceIP', encryptedCookie, {"maxAge": 1000*60*60*24*30}); // max age: 30 days
                  });
              }

              res.render('login', {
                data: response.data
              });
            });
            console.log("RENDERED");
        });
      }
      else{
        //Go back to OTP page and try again
        //More than 3 time boot out and clear cookies
        if(otpObj.count < 3){
          otpObj.count++;
          cipher.encryptJSON(otpObj)
            .then(encryptedCookie => {
              res.cookie('otp-register', encryptedCookie, {"maxAge" : 1000 * 60 * 5});
              res.redirect('/register-otp');
            });
        }
        else {
          console.log("OTP Register Success!");
          res.clearCookie("otp");
          res.redirect('/login');
        }
      }
    }
  }
}
