const uuid = require('uuid');
var passwordValidator =require('password-validator');
module.exports =function(cipher, appConn,C){
  return function(req, res){
      console.log(`CIPHER MODULE: ${cipher}`);
    // req.checkBody('username','Please enter username').notEmpty();
    //
    // req.checkBody('email','Please enter email').notEmpty();
    // req.checkBody('email','Invalid email address').isEmail();
    //
    // req.checkBody('password','Please enter password').notEmpty();
    // req.checkBody('password','Invalid password').isLength({min:8});
    console.log(cipher);
    var oldPassword = req.body.oldPassword;
    var newPassword = req.body.newPassword;
    var confirmPassword = req.body.confirmPassword;

      req.sanitize('oldPassword').escape();
      req.sanitize('newPassword').escape();
      req.sanitize('confirmPassword').escape();
      req.sanitize('oldPassword').trim();
      req.sanitize('newPassword').trim();
      req.sanitize('confirmPassword').trim();

    console.log(oldPassword);
    if (oldPassword!="" && newPassword!="" && confirmPassword!=""){
      var schema = new passwordValidator();
      schema
      .is().min(8)
      .has().uppercase()
      .has().lowercase()
      .has().digits()
      .has().not().spaces();

      var oldPasswordCheck=schema.validate(oldPassword);
      var newPasswordCheck=schema.validate(newPassword);
      var error = req.validationErrors();

      if (oldPasswordCheck && newPasswordCheck){
        if(newPassword == confirmPassword){
          if(!error){

            console.log(error);
            console.log("pass");
            console.log("Changing password: ");
            console.log(req.body);
            cipher.encryptJSON({
              "oldPassword": req.body.oldPassword,
              "newPassword": req.body.newPassword
            })
              .catch(function (err) {
                throw new Error('Error parsing JSON!');
              })
              .then(function(cookieData) {
              // res.cookie('login', cookieData, {"maxAge": 1000*60*60}); //one hour
              // res.redirect('/login?room='  +req.body.room);
              // console.log(`C CONSTANT OBJECT: ${C}`);
              var userInfo = req.cookies.user_info;
              console.log(userInfo);

              appConn.send({
                'type': C.REQ_TYPE.DATABASE,
                'data':{
                    type : C.DB.UPDATE.PASSWORD,
                  verify : {
                    user_id : userInfo.data[0].user_id,
                    password_hash : req.body.oldPassword
                  },
                  account : {
                    password_hash : req.body.newPassword
                  }

                }

              }, (response) => {
                console.log(response.data);
                console.log("Validating");
                console.log(response.data.success);
                if(response.data.success==true){
                  res.render('/change-password-room-success',{
                    data: response.data.data
                  });
                }
                else{
                  console.log("Change password has failed.");
                  res.redirect('/ChangePassword');
                }
              });
            });
          }
          else{

            console.log("FAIL");

            res.redirect('/ChangePassword');
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
          console.log("Password does not match");
          // res.redirect('/registerstud');
        }
      } else {
        req.session.errors=error;
        req.session.success=false;

        res.redirect('/ChangePassword');
        return;
    }
    function sendErrorPage(res, errormsg) {
      res.render('ChangePassword', {
        'error': errormsg
      });
    }
  }
}
