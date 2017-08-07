const uuid = require('uuid');
var passwordValidator =require('password-validator');
module.exports =function(cipher, appConn,C){
  return function(req, res){
    //TODO: Please do all sort of validation here
    var newPassword = req.body.newPassword;
    var confirmPassword = req.body.confirmPassword;
    var userId = req.cookies.temp_user_id.data.user_id

    console.log("HERE IS THE TEMP USER ID");
    console.log(req.cookies.temp_user_id);

    req.sanitize('newPassword').escape();
    req.sanitize('confirmPassword').escape();
    req.sanitize('userId').escape();
    req.sanitize('newPassword').trim();
    req.sanitize('confirmPassword').trim();
    req.sanitize('userId').trim();

      if (newPassword!="" && confirmPassword!=""){
        var schema = new passwordValidator();
        schema
        .is().min(8)
        .has().uppercase()
        .has().lowercase()
        .has().digits()
        .has().not().spaces();

        var newPasswordCheck=schema.validate(newPassword);
        var confirmPasswordCheck=schema.validate(confirmPassword);
        var error = req.validationErrors();

          if (newPasswordCheck && confirmPasswordCheck){
            if(newPassword==confirmPassword){
              if(!error){

                console.log("PASSED IN HERE");
                console.log(req.body);
                  cipher.encryptJSON({
                    "newPassword": req.body.newPassword,
                    "confirmPassword": req.body.confirmPassword
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

                });

                appConn.send({
                  'type' : C.REQ_TYPE.DATABASE,
                  'data' : {
                    type  : C.DB.UPDATE.CHANGE_PASSWORD,
                    'account' : {
                      password_hash : newPassword,
                      user_id : userId
                    }
                  }
                }, (response) => {
                    console.log(response.data)
                    if (response.data.success==true) {
                      res.clearCookie("temp_user_id");
                      res.redirect('/student-login')
                    }
                    else {
                      console.log("Return false!");
                      console.log("HI");
                    }
                });

            } else {
              console.log("Got error");
            }

          } else { // newpassword != changepassword
            req.session.errors=error;
            req.session.success=false;
            console.log("Password does not match");
          }

        } else {
          console.log("Password does not match error 2");
        }
      } else {
        if(newPassword==""){
          console.log("Please enter your new password");

        }
        if(confirmPassword==""){
          console.log("Please enter your confirmed new password");

        }
        console.log("never fill in all");

        res.redirect('/ChangePassword');
      }

    }
  }
