const uuid = require('uuid');
var crypto = require('crypto'); // NOTE: TEMP SOLUTION
var passwordValidator = require('password-validator');
module.exports = function(cipher, appConn, C, xssDefense, emailServer, cookieValidator) {
  return function(req, res){
    var username = req.body.username;
    var password = req.body.password;
    var randomNum = req.body.randomNum;
    // var userIP = req.body.userIp;
    var userIP = req.connection.remoteAddress;
    var botCheck = req.body._bot;
    console.log(botCheck);

    req.sanitize('username').escape();
    req.sanitize('password').escape();
    req.sanitize('userIp').escape();
    req.sanitize('randomNum').escape();
    req.sanitize('username').trim();
    req.sanitize('password').trim();
    req.sanitize('userIp').trim();
    req.sanitize('randomNum').trim();

    // TODO: AUTO LOGIN FUNCTION
    // Check the integrity if the cookie
    // if(req.cookies.tempToken != undefined){
    //   if(cookieValidator.validateCookie(req.cookies.tempToken)){
    //     var tempData = req.cookies.tempToken.data;
    //     console.log(tempData);
    //     appConn.send({
    //       // 'type':C.REQ_TYPE.ACCOUNT_LOGIN,
    //       'type':C.REQ_TYPE.DATABASE,
    //       'data': {
    //         'type' : C.DB.SELECT.TEMP_TOKEN,
    //         //This is just the cookie obj
    //         'inputData' : {
    //           'temp_token' : tempData.temp_token,
    //           'ip_address' : tempData.ip_address,
    //           'user_id' : tempData.user_id,
    //           'new_device_id' : tempData.new_device_id
    //         }
    //       }
    //     }, (response) => {
    //       //NOTE: If authenticate pass, response.data.success = true
    //       //NOTE: If authenticate fail, response.data.success = false
    //       console.log("SUCCESS YAY");
    //       console.log(response.data.success);
    //       if(response.data.success){
    //         //PROCESS DATA
    //       }
    //       else{
    //         res.clearCookie("tempToken");
    //       }
    //     });
    //   }
    // }
    //END OF AUTO LOGIN FUNCTION

    if (username != "" && password != ""){
      var schema = new passwordValidator();
      schema
      .is().min(8)
      .has().uppercase()
      .has().lowercase()
      .has().digits()
      .has().not().spaces();

      var passwordCheck = schema.validate(password);
      var error = req.validationErrors();

      if (passwordCheck){
        if(!error){
          console.log("HOST FORM DATA: ");
            //check for a valid deviceIP cookie
            if(req.cookies.deviceIP != undefined){
              if(cookieValidator.validateCookie(req.cookies.deviceIP))
                var deviceIp = req.cookies.deviceIP.data;
              else
                res.clearCookie("deviceIP");
            }

            appConn.send({
              // 'type':C.REQ_TYPE.ACCOUNT_LOGIN,
              'type':C.REQ_TYPE.DATABASE,
              'data': {
                type : C.DB.SELECT.USER_ACCOUNT,
                account : {
                  username : req.body.username,
                  hash_password : req.body.password
                }
              }
            }, (response) => {
              //If incorrect user input return to login page
              if(!(response.data.success)){
                res.sendErrorPage('Invalid login details!');
              }
              else {
                //Check for identical IP address in user cookie
                var valid = false; //Registered IP address in client PC
                if(deviceIp != undefined && response.data.data.ip_address != undefined){
                  var currentIpAddress = crypto.createHash('SHA256').update(userIP).digest('base64');
                    outerloop:
                      for(i=0 ; i<response.data.data.ip_address.length ; i++){
                        for(j=0 ; j<deviceIp.length ; j++){
                          console.log("["+response.data.data.ip_address[i]+"]" + "["+deviceIp[j]+"]" + "["+currentIpAddress+"]");
                          if(response.data.data.ip_address[i] == deviceIp[j] && currentIpAddress == response.data.data.ip_address[i] && currentIpAddress == deviceIp[j]){
                            valid = true;
                            break outerloop;
                          }
                        }
                      }
                  // });
                }
                if(valid){
                  //GET ACTUAL DATA AND STORE TO SESSION WITHOUT OTP
                  appConn.send({
                    'type' : C.REQ_TYPE.DATABASE,
                    'data' : {
                      type : C.DB.SELECT.FULL_USER_ACCOUNT,
                      user_id : response.data.data.user_id
                    }
                  } ,(response) => {
                    //TODO: WILL INSERT AN REMEMBER ME FUNCCTION OVER HERE TOO TIRED TO IMPLEMENT, CURRENTLY WORKING AT OTP CHECK
                    if(response.data.success){
                      var encodedData = xssDefense.jsonEncode(response.data.data[0]);
                      cipher.encryptJSON(cookieValidator.generateCheckCookie(encodedData, userIP))
                      .then((encryptedCookie) => {
                      res.cookie('user_info', encryptedCookie);
                      validLoginSession(req);
                      appConn.send({
                        'type' : C.REQ_TYPE.DATABASE,
                        'data' : {
                          'type' : C.DB.SELECT.ALL_QUIZ
                        }
                      }, (response4) => {
                        //TODO: XSS of array of quiz data
                        if(req.session.attemptJoin) {
                          res.redirect(`play?room=${req.session.attemptJoin}`);
                        } else if(req.session.attemptVisit) {
                          res.redirect(req.session.attemptedAccess);
                        } else {
                          res.redirect('/user-home');
                        }
                      });
                    });
                  }
                  else{
                    res.sendErrorPage(response.data.message);
                  }
                  });
                }
                else {
                  var randomNum = Math.floor((Math.random() * 999999) + 10000);
                  console.log("THIS IS THE PIN: " + randomNum);

                  appConn.send({
                    'type' : C.REQ_TYPE.DATABASE,
                    'data' : {
                      type : C.DB.SELECT.EMAIL,
                      user_id : response.data.data.user_id
                    }
                  } ,(response2) => {
                    var email = response2.data.data.email
                    emailObj = {
                      pin : randomNum,
                      email : email
                    }

                    emailServer.loginAccountOtpEmail(emailObj);
                  });

                  console.log("THIS IS THE RANDOM NUM: " + randomNum);
                  cipher.encryptJSON(
                    cookieValidator.generateCheckCookie({ //Param: (jsonObj, user Ip address)
                      'pin' : randomNum,
                      'user_id' : response.data.data.user_id,
                      'userIp' : userIP,
                      'count' : 0
                    }, userIP)
                  )
                    .catch(function (err) {
                      throw new Error('Error parsing JSON!');
                    })
                    .then(function(cookieData) {
                      req.session.otpSession = true;
                      res.cookie('otp', cookieData, {"maxAge": 1000*60*60}); //one hour
                      req.session.tempUsername = req.body.username;
                      res.redirect('/otp');
                  });
                }
              }

            });
        }
        else{
          console.log("FAIL");
          res.sendErrorPage('Fail registration');
        }
      }
      else{

          req.session.errors=error;
          req.session.success=false;
          console.log(schema.validate('password',{list:true}));
          console.log("FAIL PW");

          res.sendErrorPage('Failed password requirements');
        }
    }
    else{
        req.session.errors=error;
        req.session.success=false;
        if(username==""){
          console.log("Please enter your username");
        }
        if(password==""){
          console.log("Please enter your password");
        }

        console.log("never fill in all");

        res.sendErrorPage('Never fill in all the fields');
        return;
    }
  }
}

function validLoginSession(req) {
  req.session.validLogin = true;
  req.session.username = req.body.username;
}
