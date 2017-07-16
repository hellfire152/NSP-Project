const uuid = require('uuid');
var passwordValidator = require('password-validator');
module.exports = function(cipher, appConn, C) {
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

        req.sanitize('username').escape();
        req.sanitize('email').escape();
        req.sanitize('username').trim();
        req.sanitize('email').trim();

    console.log(username);
    if (username!=""  && email!=""){
      var error = req.validationErrors();

        if(!error){

          console.log(error);
          console.log("pass");
          console.log("HOST FORM DATA: ");
          console.log(req.body);
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
              console.log(response.data);
              console.log("Validating");
              console.log(response.data.success);
              if(response.data.success==true){
                res.render('login',{
                  data: response.data.data
                });
              }
              else{

                console.log("FAIL");

                res.redirect('/forget-password');
              }
            });
          // });
        }
        else{

          console.log("FAIL");

          res.redirect('/forget-password');
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
