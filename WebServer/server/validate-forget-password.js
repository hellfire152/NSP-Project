const uuid = require('uuid');
var passwordValidator = require('password-validator');
module.exports = function(cipher, appConn, C,emailServer) {
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
    var email = req.body.email;
    var randomNum = req.body.randomNum;
    var randomNum = Math.floor((Math.random() * 999999) + 10000);


  //   function randomNum() {
  //     var text="";
  //   var random = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  //   for(var i = 0; i < 12; i++) {
  //     text += random.charAt(Math.floor(Math.random() * random.length));
  //   }
  //   return text;
  // }



        req.sanitize('username').escape();
        req.sanitize('email').escape();
        req.sanitize('username').trim();
        req.sanitize('email').trim();

    console.log(username);
    if (username!=""  && email!=""){
      var error = req.validationErrors();

            emailObj = {
              username: req.body.username,
              pin : randomNum,
              email : req.body.email
            }

            emailServer.forgetPasswordOtpEmail(emailObj);

        if(!error){

          console.log(error);
          console.log("pass");
          console.log("HOST FORM DATA: ");
          console.log(req.body);

          if(req.cookies.deviceIP != undefined){
            var deviceIp = JSON.parse(req.cookies.deviceIP);
          }
          // cipher.encryptJSON({
          //   "username": req.body.username,
          //   "password": req.body.password
          // })
          //   .catch(function (err) {
          //     throw new Error('Error parsing JSON!');
          //   })
            // .then(function(cookieData) {
            // res.cookie('login', cookieData, {"maxAge": 1000*60*60}); //one hour
            // res.redirect('/login?room=' +req.body.usename);
            console.log(`C CONSTANT OBJECT: ${C}`);
            appConn.send({
              // 'type':C.REQ_TYPE.ACCOUNT_LOGIN,
              'type':C.REQ_TYPE.DATABASE,
              'data': {
                type : C.DB.SELECT.USER_ACCOUNT,
                account : {
                  username : req.body.username,
                  email : req.body.email
                }
              }
              // 'username' :username,
              // 'password':password

            }, (response) => {
              console.log(req.body.userIp);
              console.log(response.data);
              console.log("Validating");
              console.log(response.data.success);
              if(!(response.data.success)){
                res.redirect('/otp');
              }
      //         else{
      //
      //           console.log("FAIL");
      //
      //           res.redirect('/forget-password');
      //         }
      //       });
      //     // });
      //   }
      //   else{
      //
      //     console.log("FAIL");
      //
      //     res.redirect('/forget-password');
      //   }
      // }
      else{
        // var currentIpAddress; //5555 temp way to get ip address, because site is not s
        //Check for identical IP address in user cookie
        var valid = false; //Registered IP address in client PC
        if(deviceIp != undefined && response.data.data.ip_address != undefined){
          // await cipher.hash(req.body.userIp)
          // .then(currentIpAddress => {
          var currentIpAddress = crypto.createHash('SHA256').update(req.body.userIp).digest('base64'); //NOTE: Temp solution
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
              res.cookie('user_info', JSON.stringify(encodedData));
              res.render('Loginindex',{
                data: encodedData
              });
            }
            else{
              res.cookie('user_info', JSON.stringify(encodedData));
              res.render('otp',{
                data: encodedData
              });
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

            }

            emailServer.forgetPasswordOtpEmail(emailObj);
          });

          var otp = {
            pin : randomNum,
            user_id : response.data.data.user_id,
            userIp : req.body.userIp,
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
    res.redirect('/otp');
    }
    }
    else{

        req.session.errors=error;
        req.session.success=false;
        if(username==""){
          console.log("Please enter your username");
        }
        if(email==""){
          console.log("Please enter your email");
        }

        console.log("never fill in all");

        res.redirect('/forget-password');
        return;

    }







  }
}
