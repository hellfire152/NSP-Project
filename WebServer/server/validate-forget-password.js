const uuid = require('uuid');
var passwordValidator = require('password-validator');
module.exports = function(cipher, appConn, C,emailServer) {
  return function(req, res){
    console.log(`CIPHER MODULE: ${cipher}`);
    var username = req.body.username;
    var email = req.body.email;
    var randomNum = req.body.randomNum;
    var randomNum = Math.floor((Math.random() * 999999) + 10000);

    req.sanitize('username').escape();
    req.sanitize('email').escape();
    req.sanitize('username').trim();
    req.sanitize('email').trim();

    console.log(username);
    if (username!=""  && email!=""){
      var error = req.validationErrors();

      emailObj = {
        username: req.body.username,
        pin : randomNum,
        email : req.body.email
      }

      emailServer.forgetPasswordOtpEmail(emailObj);

      /*
      0. Check if username and email match or not?
      1. Send pin to user
      2. Put the pin to the cookie
      3. pin in the cookie must be able to verify the pin
      4. Verify redirect to change new passowrd page
      5. User is able to change the password from there
       */
    }
  }
}
