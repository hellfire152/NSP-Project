const uuid = require('uuid');
var passwordValidator = require('password-validator');
module.exports = function(cipher, appConn, C, xssDefense) {
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
        req.sanitize('username').escape();
        req.sanitize('password').escape();
        req.sanitize('username').trim();
        req.sanitize('password').trim();

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
          const nodemailer = require('nodemailer');
          const xoauth2 = require('xoauth2');

          var transporter = nodemailer.createTransport({
              service: 'gmail',
              auth: {
                  xoauth2: xoauth2.createXOAuth2Generator({
                      user: 'chloeangsl@gmail.com',
                      clientId: '856574075841-dn1nobjm59p0vrhmvcel4sf4djb6sath.apps.googleusercontent.com',
                      clientSecret: 'i_T_RN-K_p7PsDbAwJXFNXRJ',
                      refreshToken: '1/3f97hE7yCmipAtuPcu1iu4EhF3kSmzYicMXiamYMjXY'
                  })
              }
          })

          var mailOptions = {
              from: 'My Name <chloeangsl@gmail.com>',
              to: 'chloeangsl@gmail.com',
              subject: 'testing my verification',
              text: 'Hello World!!'
          }

          transporter.sendMail(mailOptions, function (err, res) {
              if(err){
                  console.log('Error');
              } else {
                  console.log('Email Sent');
              }
          })

          console.log(error);
          console.log("pass");
          console.log("HOST FORM DATA: ");
          console.log(req.body);

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


              var currentIpAddress = "wfMw0K/zHByHQD8eQ0e8whr/fBeZCHI1NfKzFyNwJSU=" //5555 temp way to get ip address, because site is not s
              //If incorrect user input return to login page
              if(!(response.data.success)){
                res.redirect('/login');
              }
              else{
                //Check for identical IP address in user cookie
                var valid = false; //Registered IP address in client PC
                if(deviceIp != undefined && response.data.data.ip_address != undefined){
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
                      res.cookie('user_info', JSON.stringify(encodedData));
                      res.render('login',{
                        data: encodedData
                      });
                    }
                    else{
                      res.cookie('user_info', JSON.stringify(encodedData));
                      res.render('login',{
                        data: encodedData
                      });
                    }
                  });
                }
                else{
                  //REDIRECT TO OTP WEBSITE TO VERIFY
                  //Generate otp pin
                  //Send the pin to email
                  //Change 1234 - random no.
                  var otp = {
                    pin : 1234, //TODO:Will be randomly generated
                    user_id : response.data.data.user_id,
                    count : 0
                  }
                  res.cookie('otp', JSON.stringify(otp), {"maxAge": 1000*60*5}); //5 min
                  res.redirect('/otp');
                }
              }

            });
        }
        else{
          console.log("FAIL");
          res.redirect('/login');
        }
      }
      else{

          req.session.errors=error;
          req.session.success=false;
          console.log(schema.validate('password',{list:true}));
          console.log("FAIL PW");

          res.redirect('/login');
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

        res.redirect('/login');
        return;
    }
  }
}
