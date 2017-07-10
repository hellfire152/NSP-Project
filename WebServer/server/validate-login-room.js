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
                  password : req.body.password
                }
              }
              // 'username' :username,
              // 'password':password

            }, (response) => {
              console.log("HELLO");
              res.render('login',{
                data: response.data
              });
            });
          // });
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
