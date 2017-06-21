const uuid = require('uuid');
var passwordValidator =require('password-validator');
module.exports =function(cipher, appConn){
  return function(req, res){

    console.log("hi");

    var schema = new passwordValidator();
    schema
    .is().min(8)
    .has().uppercase()
    .has().lowercase()
    .has().digits()
    .has().not().spaces();

    req.checkBody('username','Please enter username').notEmpty();

    req.checkBody('email','Please enter email').notEmpty();
    req.checkBody('email','Invalid email address').isEmail();

    req.checkBody('password','Please enter password').notEmpty();
    req.checkBody('password','Invalid password').isLength({min:8});
    var passwordCheck=schema.validate('password');

    var username = req.body.username;
    var email = req.body.email;
    req.sanitize('username').escape();
    req.sanitize('email').escape();
    req.sanitize('password').escape();
    req.sanitize('username').trim();
    req.sanitize('email').trim();
    req.sanitize('password').trim();

    // console.log(schema.validate('password',{list:true}));
    var error = req.validationErrors();

    if (passwordCheck){
      if(!error){
        console.log("pass");
      }
      else{
        //
        // req.session.errors=error;
        // req.session.success=false;
        // console.log(error);
        console.log("FAIL");
        res.render('/login',{
          error:error,
          username:username,
          email:email
        });
      }
    }
    else{

        req.session.errors=error;
        req.session.success=false;
        console.log(schema.validate('password',{list:true}));
        console.log("FAIL PW");
        res.render('login',{
          error:error,
          username:username,
          email:email
        });

        return;

      }



  }
}
