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
    if(req.cookies.tempToken != undefined){
      cipher.decryptJSON(req.cookies.tempToken) //NOTE: AUTO DECRYPT DOES NOT SEEM TO WORK TODO: NEED TO FIX THIS
      .then(tempTokenData => {
        if(cookieValidator.validateCookie(tempTokenData)){
          var tempData = tempTokenData.data;
          console.log(tempData);
          appConn.send({
            // 'type':C.REQ_TYPE.ACCOUNT_LOGIN,
            'type':C.REQ_TYPE.DATABASE,
            'data': {
              'type' : C.DB.SELECT.TEMP_TOKEN,
              //This is just the cookie obj
              'inputData' : {
                'temp_token' : tempData.temp_token,
                'ip_address' : tempData.ip_address,
                'user_id' : tempData.user_id,
                'new_device_id' : tempData.new_device_id
              }
            }
          }, (response) => {
            //NOTE: If authenticate pass, response.data.success = true
            //NOTE: If authenticate fail, response.data.success = false
            console.log("SUCCESS YAY");
            console.log(response.data.success);
            if(response.data.success){
              //PROCESS DATA
            }
            else{
              res.clearCookie("tempToken");
            }
          });
        }
      });
    }
    //END OF AUTO LOGIN FUNCTION

    if (username!=""  && password!=""){
      var schema = new passwordValidator();
      schema
      .is().min(8)
      .has().uppercase()
      .has().lowercase()
      .has().digits()
      .has().not().spaces();

      var passwordCheck=schema.validate(password);
      var error = req.validationErrors();

      if (passwordCheck){
        if(!error){
          console.log("HOST FORM DATA: ");

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
                res.redirect('/student-login');
              }
              else{
                //Check for identical IP address in user cookie
                var valid = false; //Registered IP address in client PC
                if(deviceIp != undefined && response.data.data.ip_address != undefined){
                  var currentIpAddress = crypto.createHash('SHA256').update(userIP).digest('base64'); //NOTE: Temp solution
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
                    if(true){ //If user check rmb me functionW
                      appConn.send({
                        'type' : C.REQ_TYPE.DATABASE,
                        'data' : {
                          type : C.DB.SELECT.NEW_DEVICE_ID,
                          inputData : {
                            user_id : response.data.data[0].user_id,
                            ip_address : userIP
                          }
                        }
                      } ,(response2) => {
                          cipher.generateSalt()
                          .then(randomSaltValue1 => {
                            cipher.generateSalt()
                            .then(randomSaltValue2 => {
                              randomSaltValue = randomSaltValue1 + randomSaltValue2;
                              cipher.encryptJSON(cookieValidator.generateCheckCookie({
                                'temp_token' : randomSaltValue,
                                'ip_address' : userIP,
                                'user_id' : response.data.data[0].user_id,
                                'new_device_id' : response2.data.data.new_device_id
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
                                      'new_device_id' : response2.data.data.new_device_id
                                    }
                                  }, (response3) => {
                                  var encodedData = xssDefense.jsonEncode(response.data.data[0]);
                                  if(response3.data.success){
                                    cipher.encryptJSON(cookieValidator.generateCheckCookie(encodedData, userIP))
                                    .then((encryptedCookie) => {
                                      res.cookie('user_info', encryptedCookie);
                                      res.render('LoginIndex', {
                                        data : encodedData
                                      });
                                    });
                                  }
                                  else{
                                    cipher.encryptJSON(cookieValidator.generateCheckCookie(encodedData, userIP))
                                    .then((encryptedCookie) => {
                                      res.cookie('user_info', encryptedCookie);
                                      res.render('LoginIndex', {
                                        data : encodedData
                                      });
                                    });
                                  }
                                });
                              });
                          });
                        });
                      });
                    }
                    else{
                      console.log(response.data.data[0]);
                      var encodedData = xssDefense.jsonEncode(response.data.data[0]);
                      cipher.encryptJSON(cookieValidator.generateCheckCookie(encodedData, userIP))
                      .then((encryptedCookie) => {
                        res.cookie('user_info', encryptedCookie);
                        res.render('LoginIndex', {
                          data : encodedData
                        });
                      });
                    }
                  }
                  else{
                    res.redirect('/student-login');
                  }
                  });
                }
                else{
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

                    // emailServer.loginAccountOtpEmail(emailObj);
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
                    res.cookie('otp', cookieData, {"maxAge": 1000*60*60}); //one hour
                    res.redirect('/otp');
                  });
                }
              }

            });
        }
        else{
          console.log("FAIL");
          res.redirect('/LoginForm');
        }
      }
      else{

          req.session.errors=error;
          req.session.success=false;
          console.log(schema.validate('password',{list:true}));
          console.log("FAIL PW");

          res.redirect('/student-login');
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

        res.redirect('/student-login');
        return;
    }
  }
}
