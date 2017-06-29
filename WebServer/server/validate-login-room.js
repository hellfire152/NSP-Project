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
    // console.log("hi");
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;

        req.sanitize('username').escape();
        req.sanitize('email').escape();
        req.sanitize('password').escape();
        req.sanitize('username').trim();
        req.sanitize('email').trim();
        req.sanitize('password').trim();

    console.log(username);
    if (username!="" && email!="" && password!=""){
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
          console.log("HOST FORM DATA: ");
          console.log(req.body);
          cipher.encryptJSON({
            "username": req.body.username,
            "email":req.body.email,
            "password": req.body.password
          })
            .catch(function (err) {
              throw new Error('Error parsing JSON!');
            })
            .then(function(cookieData) {
            res.cookie('login', cookieData, {"maxAge": 1000*60*60}); //one hour
            // res.redirect('/login?room=' +req.body.usename);
            appConn.send({
              'type':C.REQ_TYPE.ACCOUNT_LOGIN,
              'username' :username,
              'email':email,
              'password':password

            }, (response) => {
              console.log("HELLO");
              res.render('login',{
                'username':response.username,
                'email':response.email,
                'password':response.password
              });
            });
          });
        }
        else{

          console.log("FAIL");

          res.redirect('/login');
        }
      }

      else{

          req.session.errors=error;
          req.session.success=false;
          console.log(schema.validate('password',{list:true}));
          console.log("FAIL PW");

          res.redirect('/login');


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
        if(email==""){
          console.log("Please enter your email");
        }
        console.log("never fill in all");

        res.redirect('/login');
        return;

    }




  }
}
