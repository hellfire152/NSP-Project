const uuid = require('uuid');
var passwordValidator = require('password-validator');
module.exports = function(cipher, appConn, C,emailServer) {
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

    req.sanitize('username').escape();
    req.sanitize('email').escape();
    req.sanitize('username').trim();
    req.sanitize('email').trim();

    console.log(username);
    if (username!=""  && email!=""){
      var error = req.validationErrors();
        if(!error){
          appConn.send({
            // 'type':C.REQ_TYPE.ACCOUNT_LOGIN,
            'type':C.REQ_TYPE.DATABASE,
            'data': {
              type : C.DB.SELECT.USER_ACCOUNT,
              account : {
                username : req.body.username,
                email : req.body.email
              }
            }
            // 'username' :username,
            // 'password':password

          }, (response) => {
            console.log(response.data);
            console.log("Validating");
            console.log(response.data.success);
            if(response.data.success==true){
              res.render('login',{
                data: response.data.data
              });
            }
            else {
              console.log("FAIL");
              res.redirect('/ForgetPassword');
            }
          });
        }
        else {
          console.log("FAIL");
          res.redirect('/ForgetPassword');
        }
      }

    else{
        req.session.errors=error;
        req.session.success=false;
        res.redirect('/ForgetPassword');
        return;
    }
  }
}
