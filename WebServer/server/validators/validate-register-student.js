

const uuid = require('uuid');
var mailchecker= require('mailchecker');
var passwordValidator =require('password-validator');
module.exports =function(cipher, appConn,C, emailServer){
  return function(req, res){
    console.log(emailServer);
    var speakeasy = require("speakeasy");
    var secret = speakeasy.generateSecret({length: 20}); // Secret key is 20 characters long
    console.log(secret.base32); // Save this value to your DB for the user
    console.log(cipher);
    errors=false;
    var name = req.body.name;
    var username = req.body.lusername;
    var email = req.body.email;
    var password = req.body.lpassword;
    var confirmPassword=req.body.cpassword;
    var dateOfBirth=req.body.DOB;
    var school=req.body.school;
    var phoneNumber=req.body.number;
    var randomNum = Math.floor((Math.random() * 999999) + 10000);


    // // generate out the OTP
    // var otp = speakeasy.totp({
    //     secret: secret.base32,
    //     encoding: 'base32'
    //   });
    //
    //   console.log(otp);
    // //   // to test for verification
    // var verified = speakeasy.totp.verify({
    //     secret: secret.base32,
    //     encoding: 'base32',
    //     otp: otp
    //   });
    //
    //   console.log(verified);

        req.sanitize('name').escape();
        req.sanitize('username').escape();
        req.sanitize('email').escape();
        req.sanitize('password').escape();
        req.sanitize('dateOfBirth').escape();
        req.sanitize('phoneNumber').escape();
        req.sanitize('school').escape();
        req.sanitize('name').trim();
        req.sanitize('username').trim();
        req.sanitize('email').trim();
        req.sanitize('password').trim();
        req.sanitize('dateOfBirth').trim();
        req.sanitize('phoneNumber').trim();
        req.sanitize('school').trim();



    if (name!="" &&username!="" && email!="" && password!="" && confirmPassword!="" && dateOfBirth!="" && phoneNumber!="" && school!=""){
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
          if(password==confirmPassword){

            emailObj = {
              username: req.body.username,
              pin : randomNum,
              email : req.body.email
            }

            // emailServer.createAccountOtpEmail(emailObj);

            if(!error) {
            console.log("Creating an account: ");
              appConn.send({
                'type':C.REQ_TYPE.DATABASE,
                'data': {
                  type:C.DB.CREATE.STUDENT_ACC,
                  account: {
                    name : req.body.name,
                    username :req.body.lusername,
                    email : req.body.email,
                    password_hash : req.body.lpassword,
                    contact : req.body.number
                  },
                  details : {
                    school : req.body.school,
                    date_of_birth : req.body.DOB
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

          console.log("email not valid");
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
        if(dateOfBirth==""){
          console.log("Please enter your date of birth");
          // res.render('register-student',{
          //   error2:'Please enter your email'
          // });

        }
        if(phoneNumber==""){
          console.log("Please enter your phone number");
          // res.render('register-student',{
          //   error2:'Please enter your email'
          // });

        }
        if(school==""){
          console.log("Please enter your school");
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
}
