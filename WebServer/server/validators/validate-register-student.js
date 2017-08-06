

const uuid = require('uuid');
var mailchecker= require('mailchecker');
var passwordValidator =require('password-validator');
// var simpleTimer =require('node-timers/simple');
module.exports =function(cipher, appConn,C, emailServer){
  return function(req, res){
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
    // var simple=simpleTimer();

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
              username: req.body.lusername,
              pin : randomNum,
              email : req.body.email
            }

             emailServer.createAccountOtpEmail(emailObj);

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
                  res.redirect('/student-login');
                });
              // });
              // errors=false;
            }
            else{

              console.log("FAIL");
              errors=true;
              res.sendErrorPage('Fail registration');
            }
          }
          else{

            req.session.errors=error;
            req.session.success=false;

            console.log("password not match");
            res.sendErrorPage('Password does not match')
            // res.redirect('/registerstud');
          }
        }

        else{

            req.session.errors=error;
            req.session.success=false;
            console.log(schema.validate('password',{list:true}));
            console.log("FAIL PW");

            res.sendErrorPage('Failed password requirements!');


          }
        }
        else{
          req.session.errors=error;
          req.session.success=false;

          console.log("email not valid");
          res.sendErrorPage('Email is blacklisted');
          // async function timer(){
            // var timeout1 =  setTimeout(function () {
            //   console.log("hi");
            //   res.render('student-login');
            // }, 20000);
            // console.log("after 20 seconds");
            // return timeout1;
          // }

          // res.redirect('/student-login');
          // console.log("start timer");
          // simple.start();
          // simple.time();
          // console.log(simple.time());
          // if(simple.time()>10){
          //   console.log("over 10 seconds");
          //   console.log(simple.time());
          //   simple.stop();
          //   simple.reset();
          //   res.redirect('/student-login');
          // }

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
        if(email==""){
          console.log("Please enter your email");
        }
        if(dateOfBirth==""){
          console.log("Please enter your date of birth");
        }
        if(phoneNumber==""){
          console.log("Please enter your phone number");
        }
        if(school==""){
          console.log("Please enter your school");
        }
        console.log("never fill in all");
        res.sendErrorPage('Please fill in all details');

        return;

    }
    // function sendErrorPage(res, errormsg) {
    //   res.render('student-login', {
    //     'error': errormsg
    //   });
    // }


  }
}
}
