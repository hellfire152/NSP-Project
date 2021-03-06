const uuid = require('uuid');
var passwordValidator =require('password-validator');
var mailchecker=require('mailchecker');
module.exports =function(cipher, appConn, C, emailServer){
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
    var phoneNumber=req.body.number;
    var randomNum = Math.floor((Math.random() * 999999) + 10000);
    console.log(email);
    console.log(username);
    console.log(phoneNumber)
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
              emailObj = {
                username: req.body.lusername,
                pin : randomNum,
                email : req.body.email
              }

              emailServer.createAccountOtpEmail(emailObj);


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
                      contact: req.body.number
                      // contact : req.body.contact TODO: FOR THE CONTACT IN DATABASE
                    },
                    details :{
                      organisation : req.body.school,
                      // otp: otp
                    }
                  }


                }, (response) => {
                  if(!response.data.success) { //fail
                    if(response.data.reason ==  C.ERR.DB_USERNAME_TAKEN){
                      res.sendErrorPage('username or email used','/teacher-login');
                    }
                    else{
                      res.sendErrorPage(response.data.message, '/teacher-login');
                    }

                  } else {
                    res.redirect('/teacher-login');
                  }
                });
            }
            else{

              console.log("FAIL");

              res.sendErrorPage('Fail reistration','/teacher-login');
            }
        }

        else{

            req.session.errors=error;
            req.session.success=false;
            console.log(schema.validate('password',{list:true}));
            console.log("FAIL PW");

            res.sendErrorPage('Failed password requirements','/teacher-login');


          }
        }
        else{
          req.session.errors=error;
          req.session.success=false;
          console.log("email not valid");
          res.sendErrorPage('Email is blacklisted','/teacher-login');
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

        res.sendErrorPage('Never fill in all the fields','/teacher-login');
        return;

    }



  }
}
