const uuid = require('uuid');
var passwordValidator =require('password-validator');
var mailchecker=require('mailchecker');
module.exports =function(cipher, appConn, C){
  return function(req, res){
    // req.checkBody('username','Please enter username').notEmpty();
    //
    // req.checkBody('email','Please enter email').notEmpty();
    // req.checkBody('email','Invalid email address').isEmail();
    //
    // req.checkBody('password','Please enter password').notEmpty();
    // req.checkBody('password','Invalid password').isLength({min:8});
    // console.log("hi");
    var name = req.body.name;
    var username = req.body.lusername;
    var email = req.body.email;
    var password = req.body.lpassword;
    var confirmPassword = req.body.cpassword;
    var school=req.body.school;
    var phoneNumber=req.body.phone;
    var speakeasy = require("speakeasy");
    var secret = speakeasy.generateSecret({length: 20}); // Secret key is 20 characters long
    var randomNum = Math.floor((Math.random() * 999999) + 10000);
    console.log(email);
    console.log(username);
    console.log(phoneNumber)

    var otp = speakeasy.totp({
        secret: secret.base32,
        encoding: 'base32'
      });

      console.log(otp);
      // to test for verification
      var verified = speakeasy.totp.verify({
        secret: secret.base32,
        encoding: 'base32',
        otp: otp
      });


      console.log(verified);

    console.log(school);
    req.sanitize('name').escape();
    req.sanitize('username').escape();
    req.sanitize('email').escape();
    req.sanitize('password').escape();
    req.sanitize('school').escape();
    req.sanitize('phoneNumber').escape();
    req.sanitize('name').trim();
    req.sanitize('username').trim();
    req.sanitize('email').trim();
    req.sanitize('password').trim();
    req.sanitize('school').trim();
    req.sanitize('phoneNumber').trim();
    console.log(username);
    if (name!="" && username!="" && email!="" && password!=""&&school!=""&&phoneNumber!=""){
      if(mailchecker.isValid(email)){
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
              // email authentication
              const nodemailer = require('nodemailer');
              const xoauth2 = require('xoauth2');

              var transporter = nodemailer.createTransport({
                  service: 'gmail',
                  auth: {
                    type: 'OAuth2',
                          user: 'chloeangsl@gmail.com',
                          clientId: '709561982297-oa3u5nha1eue2aohv5966cdgp60evqb6.apps.googleusercontent.com',
                          clientSecret: 'aDT6KfKpSItfcGyHzsPQiOza',
                          refreshToken: '1/PqljSvhT5eVC59mMuJlSq3n-OXAC7t780142zdxSkuj0_lQqCwgeXxn7htzTCBmZ',
                          accessToken: 'ya29.GluLBFitkUrt-trDc194r8hRXTSD4eUnvV2ZM1g2ARX5ug8SbCywqvGcjwRybPs7PIbYsi-7sJs5WG8ztMPUgOpMSBbEFEdudEywH8ouPH-QNZDvTVOuTgnWw_7C'
                    }
                })

              var mailOptions = {
                  from: 'My Name <chloeangsl@gmail.com>',
                  to: req.body.email,
                  subject: 'VERIFICATION EMAIL',
                  html: '<p>hello! you have created an account with the Username: ' +req.body.lusername+ ', and Email: '+req.body.email+'. Your verification number is: '+randomNum+' </p>'
              }

              transporter.sendMail(mailOptions, function (err, res) {
                  if(err){
                      console.log('Error');
                  } else {
                      console.log('Email verification has been sent.');
                  }
              })


              console.log(error);
              console.log("pass");
              // cipher.encryptJSON({
              //   "username": req.body.username,
              //   "email":req.body.email,
              //   "password": req.body.password,
              //   "school":req.body.school
              // })
              //   .catch(function (err) {
              //     throw new Error('Error parsing JSON!');
              //   })
              //   .then(function(cookieData) {
              //   res.cookie('register-teacher', cookieData, {"maxAge": 1000*60*60}); //one hour
                // res.redirect('/login?room=' +req.body.room);
                appConn.send({
                  'type':C.REQ_TYPE.DATABASE,
                  'data':{
                    type:C.DB.CREATE.TEACHER_ACC,
                    account:{
                      name : req.body.name,
                      username :req.body.lusername,
                      email : req.body.email,
                      password_hash : req.body.lpassword,
                      contact: req.body.phone
                      // contact : req.body.contact TODO: FOR THE CONTACT IN DATABASE
                    },
                    details :{
                      organisation : req.body.school,
                      // otp: otp
                    }
                  }


                }, (response) => {
                  res.render('register-teacher',{
                    data:response.data
                    // 'username':response.username,
                    // 'email':response.email,
                    // 'password':response.password,
                    // 'school':response.school
                  });
                });
              // });
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

            res.redirect('/LoginForm');


          }
        }
        else{
          req.session.errors=error;
          req.session.success=false;
          console.log("email not valid");

        }

    }
    else{

        req.session.errors=error;
        req.session.success=false;
        if(name==""){
          console.log("Please enter your name");
        }
        if(username==""){
          console.log("Please enter your username");
        }
        if(password==""){
          console.log("Please enter your password");
        }
        if(confirmPassword==""){
          console.log("Please enter your password");
        }
        if(email==""){
          console.log("Please enter your email");
        }
        if(phoneNumber==""){
          console.log("Please enter your email");
        }
        console.log("never fill in all");

        res.redirect('/LoginForm');
        return;

    }



  }
}
