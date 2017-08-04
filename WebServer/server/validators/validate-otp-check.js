//login

const uuid = require('uuid');
module.exports = function(cipher, appConn, C, xssDefense, cookieValidator) {
  return function(req, res) {
    req.sanitize('otp').escape();

    var errors = req.validationErrors();

    if(errors) {
      //TODO::Handle errors
    } else {
      var userOTP = req.body.otp;
      // var userIP = req.body.userIp;
      var userIP = req.connection.remoteAddress;
      var otpObj = req.cookies.otp.data;
      //Check if cookie is valid or not
      if(!cookieValidator.validateCookie(req.cookies.otp)){
        console.log("Cookie Modification detected");
        res.clearCookie("otp");
        res.sendErrorPage("Cookie modification detected");
      }
      else{
        if(userOTP == otpObj.pin){
          //TODO: Get data from database and send to client and redirect to new page
          appConn.send({
            'type' : C.REQ_TYPE.DATABASE,
            'data' : {
              type : C.DB.SELECT.FULL_USER_ACCOUNT,
              user_id : otpObj.user_id
            }
          } ,(response) => {
              appConn.send({
                'type' : C.REQ_TYPE.DATABASE,
                'data' : {
                  type : C.DB.CREATE.IP_ADDRESS,
                  inputData : {
                    user_id : otpObj.user_id,
                    ip_address : otpObj.userIp
                    // ip_address : Math.floor((Math.random() * 10000) + 1).toString() //Mock up of new IP address TODO: Get IP address from client
                  }
                }
              }, (response2) => {
                var encodedData = xssDefense.jsonEncode(response.data.data[0]);
                var encodedData = response.data.data[0];
                res.clearCookie("otp");
                if(req.cookies.deviceIP != undefined){
                  var ipArr = req.cookies.deviceIP.data;
                  ipArr.push(response2.data.data.hashedIpAddress);
                  cipher.encryptJSON(cookieValidator.generateCheckCookie(ipArr))
                    .then((encryptedCookie) => {
                      res.cookie('deviceIP', encryptedCookie, {"maxAge" : 1000 * 60 * 60 * 24 * 30}); //30 days
                    });
                }
                else{
                  var newIpArr = [response2.data.data.hashedIpAddress];
                  cipher.encryptJSON(cookieValidator.generateCheckCookie(newIpArr))
                    .then((encryptedCookie) => {
                      res.cookie('deviceIP', encryptedCookie, {"maxAge" : 1000 * 60 * 60 * 24 * 30}); //30 days
                    });
                }

                //Generate super random token form auto login function if user check "Auto login function"
                if(true){ //If user check rmb me functionW
                  cipher.generateSalt()
                  .then(randomSaltValue1 => {
                    cipher.generateSalt()
                    .then(randomSaltValue2 => {
                      randomSaltValue = randomSaltValue1 + randomSaltValue2;
                      cipher.encryptJSON(cookieValidator.generateCheckCookie({
                        'temp_token' : randomSaltValue,
                        'ip_address' : response2.data.data.hashedIpAddress,
                        'user_id' : otpObj.user_id,
                        'new_device_id' : response2.data.data.newDeviceId
                      }))
                        .then((encryptedCookie) => {
                          //TODO: UPDATE DATABASE
                          console.log("SETTING COOKIE TEMP");
                          res.cookie('tempToken', encryptedCookie); // TODO: SET TIME OUT
                          appConn.send({
                            'type' : C.REQ_TYPE.DATABASE,
                            'data' : {
                              'type' : C.DB.UPDATE.TEMP_TOKEN,
                              'temp_token' : randomSaltValue,
                              'new_device_id' : response2.data.data.newDeviceId
                            }
                          }, (response3) => {
                            if(response3.data.success){
                              cipher.encryptJSON(cookieValidator.generateCheckCookie(encodedData, userIP))
                                .then((encryptedCookie) => {
                                  res.cookie('user_info', encryptedCookie);
                                  req.session.otpSession = true;
                                  validLoginSession(req);
                                  res.redirect('/');
                                });
                            }
                            else{
                              cipher.encryptJSON(cookieValidator.generateCheckCookie(encodedData, userIP))
                                .then((encryptedCookie) => {
                                  res.cookie('user_info', encryptedCookie);
                                  req.session.otpSession = true;
                                  validLoginSession(req);
                                  res.redirect('/');
                                });
                            }
                          });
                        });
                    });
                  });
                }
                else{
                  cipher.encryptJSON(cookieValidator.generateCheckCookie(encodedData, userIP))
                    .then((encryptedCookie) => {
                      res.cookie('user_info', encryptedCookie);
                      req.session.otpSession = undefined; //Close the session
                      validLoginSession(req, otpObj);
                      res.render('user-home', {
                        data : response.data
                      });
                    });
                }
              });
          });
        }
        else{
          //Go back to OTP page and try again
          //More than 3 time boot out and clear cookies
          if(otpObj.count < 3){
            otpObj.count++;
            cipher.encryptJSON(cookieValidator.generateCheckCookie(otpObj, userIP))
              .then((encryptedCookie) => {
                req.session.otpSession = true; //Open the session
                res.cookie('otp', encryptedCookie, {"maxAge" : 1000 * 60 * 5}) //5 min
                res.redirect('/student-login'); // redirect to student login so they can get a new otp
              });
          }
          else{
            res.clearCookie("otp");
            // Close the session
            req.session.otpSession = undefined;
            res.redirect('/student-login');
          }
        }
      }
    }
  }
}
function validLoginSession(req, otpObj) {
  req.session.validLogin = true;
  req.session.username = req.session.tempUsername;
}
