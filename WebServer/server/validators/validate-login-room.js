const uuid = require('uuid');
var passwordValidator = require('password-validator');
module.exports = function(cipher, appConn, C, xssDefense, emailServer) {
  return function(req, res){
    var username = req.body.username;
    var password = req.body.password;
    var randomNum = req.body.randomNum;

    req.sanitize('username').escape();
    req.sanitize('password').escape();
    req.sanitize('userIp').escape();
    req.sanitize('randomNum').escape();
    req.sanitize('username').trim();
    req.sanitize('password').trim();
    req.sanitize('userIp').trim();
    req.sanitize('randomNum').trim();

    console.log(username);
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
          console.log("pass");
          console.log("HOST FORM DATA: ");

          if(req.cookies.deviceIP != undefined){
            var deviceIp = JSON.parse(req.cookies.deviceIP);
          }

          appConn.send({
            // 'type':C.REQ_TYPE.ACCOUNT_LOGIN,
            'type':C.REQ_TYPE.DATABASE,
            'data': {
              type : C.DB.SELECT.USER_ACCOUNT,
              account : {
                username : req.body.username,
                password : req.body.password
              }
            }
          }, (response) => {
            console.log(req.body.userIp);
            //If incorrect user input return to login page
            if(!(response.data.success)){
              res.redirect('/LoginForm');
            }
            else{
              //Check for identical IP address in user cookie
              var valid = false; //Registered IP address in client PC
              if(deviceIp != undefined && response.data.data.ip_address != undefined){
                var currentIpAddress = crypto.createHash('SHA256').update(req.body.userIp).digest('base64'); //NOTE: Temp solution
                  outerloop:
                    for(i=0 ; i<response.data.data.ip_address.length ; i++){
                      for(j=0 ; j<deviceIp.length ; j++){
                        console.log("["+response.data.data.ip_address[i]+"]" + "["+deviceIp[j]+"]" + "["+currentIpAddress+"]");
                        if(response.data.data.ip_address[i] == deviceIp[j] &&
                          currentIpAddress == response.data.data.ip_address[i] &&
                          currentIpAddress == deviceIp[j]){
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

                  console.log(response.data.data[0]);
                  var encodedData = xssDefense.jsonEncode(response.data.data[0]);
                  if(response.data.success){
                    console.log("SUCCESS");
                    console.log(encodedData);
                    cipher.encryptJSON(encodedData)
                      .then((encryptedCookie) => {
                        res.cookie('user_info', encryptedCookie);
                        res.render('Loginindex', {
                          'data' : encryptedCookie
                        })
                      });
                  } else {
                    res.cookie('user_info', JSON.stringify(encodedData));
                    res.render('LoginForm',{
                      data: encodedData
                    });
                  }
                });
              }
              else{
                //TODO:
                //REDIRECT TO OTP WEBSITE TO VERIFY
                //Generate otp pin
                //Send the pin to email
                //Change 1234 - random no.
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
                  //TODO: SEND THE DATA TO THE EMAIL SERVEVR
                  emailObj = {
                    pin : randomNum,
                    email : email
                  }

                  emailServer.loginAccountOtpEmail(emailObj);
                });

                var otp = {
                  pin : randomNum,
                  user_id : response.data.data.user_id,
                  userIp : req.body.userIp,
                  count : 0
                }
                //set otp cookie
                cipher.encryptJSON(otp)
                  .then((encryptedCookie) => {
                    res.cookie('otp', encryptedCookie, {"maxAge" : 1000 * 60 * 5});
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
      } else {
          req.session.errors=error;
          req.session.success=false;
          console.log(schema.validate('password',{list:true}));
          console.log("FAIL PW");

          res.redirect('/LoginForm');
      }
    } else {
      req.session.errors=error;
      req.session.success=false;
      if(username==""){
        console.log("Please enter your username");
      }
      if(password==""){
        console.log("Please enter your password");
      }

      console.log("never fill in all");

      res.redirect('/LoginForm');
      return;
    }
  }
}

async function handleHashIP(data){
  cipher.hash(data)
  .then(hashed => {
    data = hashed;
  })
  .catch(reason => {
    console.log(reason);
  });

return data;
}
