const uuid = require('uuid');
var passwordValidator = require('password-validator');
module.exports = function(cipher, appConn, C,emailServer, cookieValidator) {
    return function(req, res){
      console.log(`CIPHER MODULE: ${cipher}`);
      var username = req.body.username;
      var email = req.body.email;
      var randomNum = req.body.randomNum;
      var randomNum = Math.floor((Math.random() * 999999) + 10000);

      req.sanitize('username').escape();
      req.sanitize('email').escape();
      req.sanitize('username').trim();
      req.sanitize('email').trim();

      if (username!=""  && email!=""){

        emailObj = {
          username: req.body.username,
          pin : randomNum,
          email : req.body.email
        }

        appConn.send({
          'type' : C.REQ_TYPE.DATABASE,
          'data' : {
            type : C.DB.SELECT.RETRIEVE_USER_DETAILS,
            username : username,
            email : email
          }
        } ,(response) => {
          console.log(response);
          if(response.data.success){
            var otp = {
              pin : randomNum,
              user_id : response.data.user_id,
              count : 0
            }

            //TODO: Send the randomNum to client email
            emailServer.forgetPasswordOtpEmail(emailObj);
            req.session.otpSession = true; //Open the session

            cipher.encryptJSON(cookieValidator.generateCheckCookie(otp))
            .then((encryptedCookie) => {
              req.session.otpSession = undefined; //Close the session
              res.cookie('otp', encryptedCookie, {"maxAge": 1000*60*5}); //5 min
              res.redirect('/otp-ForgetPassword');
            });
          }
          else{
            req.session.otpSession = undefined; //Close the session
            res.redirect('/ForgetPassword');
          }
        });

      }
    }
  }
