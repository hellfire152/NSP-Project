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
        if(newPassword==confirmPassword){
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
              var userInfo =JSON.parse(req.cookies.user_info);
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

                  console.log("FAIL");

                  res.redirect('/change-password');
                }
              });
            });
          }
          else{

            console.log("FAIL");

            res.redirect('/change-password');
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
      }
    // else{
    //     req.session.errors=error;
    //     req.session.success=false;
    //     console.log(schema.validate('password',{list:true}));
    //     console.log("FAIL PW");
    // }
  // }
    else{

        req.session.errors=error;
        req.session.success=false;
        var errormsg = '';
        if(oldPassword==""){
          console.log("Please enter your current password");
          // errormsg= "Please enter your username"
          // sendErrorPage(res,errormsg);
          // res.render('register-student',{
          //   error1:
          // });
        }
        if(newPassword==""){
          console.log("Please enter your new password");
          // errormsg= "Please enter your passwor"
          // sendErrorPage(res,errormsg);
          // res.render('register-student',{
          //   error3:'Please enter your password'
          // });
        }
        if(confirmPassword==""){
          console.log("Please enter your new password");
          // res.render('register-student',{
          //   error2:'Please enter your email'
          // });

        }
        console.log("never fill in all");

        res.redirect('/change-password');

        return;

    }
    function sendErrorPage(res, errormsg) {
      res.render('change-password', {
        'error': errormsg
      });
    }


  }
}
