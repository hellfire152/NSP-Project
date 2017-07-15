const uuid = require('uuid');
var passwordValidator =require('password-validator');
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
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var confirmPassword = req.body.confirmPassword;
    var school=req.body.school;
    var phoneNumber=req.body.phoneNumber

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
    if (name!="" && username!="" && email!="" && password!=""&&school!=""&&phoneNUmber!=""){
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
                        refreshToken: '1/9op62YYjXj8wdRT7uhmlk0Zf486gqhaCWDVFLe3QZdVLdqBhJBUWfIt5vtMRXfu5',
                        accessToken: 'ya29.GluIBCjmE1jHZ37vT0meyuFXrqdVZ3WzaGVrHtm2Yzr_PxGz0Sc92cND1MpAwY89fYhKws3RLortJpKWY5i0OwIwhTMPtNOmU9OPGTK0U5VUYvA3SAYDQCdyPpVd'
                  }
              })

            var mailOptions = {
                from: 'My Name <chloeangsl@gmail.com>',
                to: req.body.email,
                subject: 'VERIFICATION EMAIL',
                html: '<p>hello! you have created an account with the username: ' +req.body.username+ ' and Email: '+req.body.email+'</p>'
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
                    username :req.body.username,
                    email : req.body.email,
                    password_hash : req.body.password,
                    phoneNumber: req.body.phoneNumber
                    // contact : req.body.contact TODO: FOR THE CONTACT IN DATABASE
                  },
                  details :{
                    organisation : req.body.school
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

            res.redirect('/registerstud');
          }
      }

      else{

          req.session.errors=error;
          req.session.success=false;
          console.log(schema.validate('password',{list:true}));
          console.log("FAIL PW");

          res.redirect('/registerteach');


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

        res.redirect('/registerteach');
        return;

    }



  }
}
