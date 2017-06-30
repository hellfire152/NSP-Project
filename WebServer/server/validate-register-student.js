const uuid = require('uuid');
var passwordValidator =require('password-validator');
module.exports =function(cipher, appConn,C, errors){
  return function(req, res){
    // req.checkBody('username','Please enter username').notEmpty();
    //
    // req.checkBody('email','Please enter email').notEmpty();
    // req.checkBody('email','Invalid email address').isEmail();
    //
    // req.checkBody('password','Please enter password').notEmpty();
    // req.checkBody('password','Invalid password').isLength({min:8});
    console.log(cipher);
    errors=false;
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var confirmPassword=req.body.confirmPassword;
    var dateOfBirth=req.body.DOB;
    var school=req.body.school;

        req.sanitize('username').escape();
        req.sanitize('email').escape();
        req.sanitize('password').escape();
        req.sanitize('dateOfBirth').escape();
        req.sanitize('username').trim();
        req.sanitize('email').trim();
        req.sanitize('password').trim();
        req.sanitize('dateOfBirth').trim();


    if (username!="" && email!="" && password!="" && confirmPassword!=""){
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

            console.log(error);
            console.log("pass");
            console.log("Creating an account: ");
            console.log(req.body);
            cipher.encryptJSON({
              "username": req.body.username,
              "password": req.body.password,
              "email":req.body.email,
              "dateOfBirth":req.body.DOB,
              "school":req.body.school
            })
              .catch(function (err) {
                throw new Error('Error parsing JSON!');
              })
              .then(function(cookieData) {
              res.cookie('register-student', cookieData, {"maxAge": 1000*60*60}); //one hour
              // res.redirect('/login?room='  +req.body.room);

              appConn.send({
                'type':C.REQ_TYPE.ACCOUNT_CREATE_STUD,
                'username' :username,
                'email':email,
                'password':password,
                'dateOfBirth':dateOfBirth,
                'school':school

              }, (response) => {
                res.render('register-student',{
                  'username':response.username,
                  'email':response.email,
                  'password':response.password,
                  'dateOfBirth':response.dateOfBirth,
                  'school':response.school
                });
              });
            });
            errors=false;
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
          errors=true;
          console.log("password not match");
          // res.redirect('/registerstud');
        }
      }

      else{

          req.session.errors=error;
          req.session.success=false;
          console.log(schema.validate('password',{list:true}));
          console.log("FAIL PW");
          errors=true;
          // res.redirect('/registerstud');


        }

    }
    else{

        req.session.errors=error;
        req.session.success=false;
        var errormsg = '';
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
        errors=true;
        return;

    }
    function sendErrorPage(res, errormsg) {
      res.render('register-student', {
        'error': errormsg
      });
    }


  }
}
