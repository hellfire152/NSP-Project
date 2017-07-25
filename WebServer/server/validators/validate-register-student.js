

const uuid = require('uuid');
var mailchecker= require('mailchecker');
var passwordValidator =require('password-validator');
module.exports =function(cipher, appConn,C, emailServer){
  return function(req, res){
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
    var randomNum = Math.floor((Math.random() * 999999) + 10000);

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
                    password_hash : req.body.lpassword
                  },
                  details : {
                    school : req.body.school,
                    date_of_birth : req.body.DOB
                  }
                }
              }, (response) => {
                res.render('register-student',{
                  data : response.data
                });
              });
          } else {
              console.log("FAIL");
              errors=true;
              res.redirect('/registerstud');
          }
        } else {
            req.session.errors=error;
            req.session.success=false;

            console.log("password not match");
          }
        } else {
            req.session.errors=error;
            req.session.success=false;
            console.log(schema.validate('password',{list:true}));
            console.log("FAIL PW");
          }
        } else{
          req.session.errors=error;
          req.session.success=false;

          console.log("email not valid");
        }
      } else {
        req.session.errors=error;
        req.session.success=false;
        var errormsg = '';

        sendErrorPage(res, 'Not all fields filled in!');
    }
  }
}

function sendErrorPage(res, errormsg) {
  res.render('error', {
    'error': errormsg
  });
}
