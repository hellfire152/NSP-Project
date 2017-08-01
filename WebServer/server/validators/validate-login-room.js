const uuid = require('uuid');
var crypto = require('crypto'); // NOTE: TEMP SOLUTION
var passwordValidator = require('password-validator');
module.exports = function(cipher, appConn, C, xssDefense, emailServer, cookieValidator) {
  return function(req, res){
    console.log(`CIPHER MODULE: ${cipher}`);
    // req.checkBody('username','Please enter username').notEmpty();
    //
    // req.checkBody('email','Please enter email').notEmpty();
    // req.checkBody('email','Invalid email address').isEmail();
    //
    // req.checkBody('password','Please enter password').notEmpty();
    // req.checkBody('password','Invalid password').isLength({min:8});
    // console.log("hi");
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
    console.log(username);
    if (username!=""  && password!=""){
      console.log(username + "CAN COME IN");
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

                    console.log(response.data.data[0]);
                    var encodedData = xssDefense.jsonEncode(response.data.data[0]);
                    if(response.data.success){
                      console.log("SUCCESS");
                      console.log(encodedData);
                      cipher.encryptJSON(cookieValidator.generateCheckCookie(encodedData, userIP))
                        .then((encryptedCookie) => {
                          res.cookie('user_info', encryptedCookie);
                          res.render('LoginIndex', {
                            data : encodedData
                          });
                        });
                    }
                    else{
                      console.log("Cannot post");
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
          res.redirect('/student-login');
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
