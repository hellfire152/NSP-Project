const uuid = require('uuid');
var passwordValidator =require('password-validator');
module.exports =function(cipher, appConn,C){
  return function(req, res){
    // req.checkBody('username','Please enter username').notEmpty();
    //
    // req.checkBody('email','Please enter email').notEmpty();
    // req.checkBody('email','Invalid email address').isEmail();
    //
    // req.checkBody('password','Please enter password').notEmpty();
    // req.checkBody('password','Invalid password').isLength({min:8});
    var speakeasy = require("speakeasy");
    var secret = speakeasy.generateSecret({length: 20}); // Secret key is 20 characters long
    console.log(secret.base32); // Save this value to your DB for the user
    console.log(cipher);
    errors=false;
    var name = req.body.name;
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var confirmPassword=req.body.confirmPassword;
    var dateOfBirth=req.body.DOB;
    var school=req.body.school;

    // generate out the OTP
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

        req.sanitize('name').escape();
        req.sanitize('username').escape();
        req.sanitize('email').escape();
        req.sanitize('password').escape();
        req.sanitize('dateOfBirth').escape();
        req.sanitize('name').trim();
        req.sanitize('username').trim();
        req.sanitize('email').trim();
        req.sanitize('password').trim();
        req.sanitize('dateOfBirth').trim();


    if (name!="" &&username!="" && email!="" && password!="" && confirmPassword!=""){
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
        if(password==confirmPassword){


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
                        html: '<p>hello! you have created an account with the username: ' +req.body.username+ ' and Email: '+req.body.email+'. Your verification number is: '+otp+ ' </p>'
                    }

                    transporter.sendMail(mailOptions, function (err, res) {
                        if(err){
                            console.log('Error');
                        } else {
                            console.log('Email verification has been sent');
                        }
                    })


            console.log(error);
            console.log("pass");
            console.log("Creating an account: ");
            console.log(req.body);
            // cipher.encryptJSON({
            //   "username": req.body.username,
            //   "password": req.body.password,
            //   "email":req.body.email,
            //   "dateOfBirth":req.body.DOB,
            //   "school":req.body.school
            // })
            //   .catch(function (err) {
            //     throw new Error('Error parsing JSON!');
            //   })
            //   .then(function(cookieData) {
            //   res.cookie('register-student', cookieData, {"maxAge": 1000*60*60}); //one hour
              // res.redirect('/login?room='  +req.body.room);

              appConn.send({
                'type':C.REQ_TYPE.DATABASE,
                'data':{
                  type:C.DB.CREATE.STUDENT_ACC,
                  account:{
                    name : req.body.name,
                    username :req.body.username,
                    email : req.body.email,
                    password_hash : req.body.password
                  },
                  details :{
                    school : req.body.school,
                    date_of_birth : req.body.DOB,
                    otp: otp
                  }
                }
                // 'username' :username,
                // 'email':email,
                // 'password':password,
                // 'dateOfBirth':dateOfBirth,
                // 'school':school

              }, (response) => {
                res.render('register-student',{
                  data:response.data
                  // 'username':response.username,
                  // 'email':response.email,
                  // 'password':response.password,
                  // 'dateOfBirth':response.dateOfBirth,
                  // 'school':response.school
                });
              });
            // });
            // errors=false;
          }
          else{

            console.log("FAIL");
            errors=true;
            res.redirect('/registerstud');
          }
        }
        else{

          req.session.errors=error;
          req.session.success=false;

          console.log("password not match");
          // res.redirect('/registerstud');
        }
      }

      else{

          req.session.errors=error;
          req.session.success=false;
          console.log(schema.validate('password',{list:true}));
          console.log("FAIL PW");

          // res.redirect('/registerstud');


        }

    }
    else{

        req.session.errors=error;
        req.session.success=false;
        var errormsg = '';
        if(name==""){
          console.log("Please enter your name");
          // errormsg= "Please enter your username"
          // sendErrorPage(res,errormsg);
          // res.render('register-student',{
          //   error1:
          // });
        }
        if(username==""){
          console.log("Please enter your username");
          // errormsg= "Please enter your username"
          // sendErrorPage(res,errormsg);
          // res.render('register-student',{
          //   error1:
          // });
        }
        if(password==""){
          console.log("Please enter your password");
          // errormsg= "Please enter your passwor"
          // sendErrorPage(res,errormsg);
          // res.render('register-student',{
          //   error3:'Please enter your password'
          // });
        }
        if(email==""){
          console.log("Please enter your email");
          // res.render('register-student',{
          //   error2:'Please enter your email'
          // });

        }
        console.log("never fill in all");

        res.redirect('/registerstud');

        return;

    }
    function sendErrorPage(res, errormsg) {
      res.render('register-student', {
        'error': errormsg
      });
    }


  }
}
