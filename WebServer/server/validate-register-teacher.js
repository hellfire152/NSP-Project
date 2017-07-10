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
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var confirmPassword = req.body.confirmPassword;
    var school=req.body.school;

    console.log(school);
        req.sanitize('username').escape();
        req.sanitize('email').escape();
        req.sanitize('password').escape();
        req.sanitize('school').escape();
        req.sanitize('username').trim();
        req.sanitize('email').trim();
        req.sanitize('password').trim();
        req.sanitize('school').trim();

    console.log(username);
    if (username!="" && email!="" && password!=""&&school!=""){
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
            console.log(error);
            console.log("pass");
            cipher.encryptJSON({
              "username": req.body.username,
              "email":req.body.email,
              "password": req.body.password,
              "school":req.body.school
            })
              .catch(function (err) {
                throw new Error('Error parsing JSON!');
              })
              .then(function(cookieData) {
              res.cookie('register-teacher', cookieData, {"maxAge": 1000*60*60}); //one hour
              // res.redirect('/login?room=' +req.body.room);
              appConn.send({
                'type':C.REQ_TYPE.ACCOUNT_CREATE_TEACH,
                'username' :username,
                'email':email,
                'password':password,
                'school':school

              }, (response) => {
                res.render('register-teacher',{
                  'username':response.username,
                  'email':response.email,
                  'password':response.password,
                  'school':response.school
                });
              });
            });
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
        console.log("never fill in all");

        res.redirect('/registerteach');
        return;

    }



  }
}
