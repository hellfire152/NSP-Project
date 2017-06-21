/**
  Test file for validating the test version of the room creating.

  Author: Chloe
*/

const uuid = require('uuid');
module.exports = function(cipher, appConn) {
  return function(req, res) {
    console.log(cipher);

    // check name + description not empty, ' ' -> id
    req.checkBody('nameofQuiz', 'Name of quiz must be specified').notEmpty().isString;
    req.checkBody('desc', 'Description must be specified').notEmpty().isString;

    req.sanitize('desc').escape();
    req.sanitize('nameofQuiz').escape();
    req.sanitize('desc').trim();
    req.sanitize('nameofQuiz').trim();

    console.log(req.body.nameofQuiz);
    console.log(req.body.desc);
    console.log(req.body.typeOfQuiz);
    console.log(req.body.reward);
    console.log(req.body.penalty);
    var errors = req.validationErrors();

    if(errors) {


    } else {
      console.log("HOST FORM DATA: ");
      console.log(req.body);
      cipher.encryptJSON({
        "desc": req.body.desc,
        "nameofQuiz": req.body.nameofQuiz
      })
        .catch(function (err) {
          throw new Error('Error parsing JSON!');
        })
        .then(function(cookieData) {
        res.cookie('login', cookieData, {"maxAge": 1000*60*60}); //one hour
        res.redirect('/createquiz?nameofQuiz=' +req.body.nameofQuiz); // For example, if the application is on
        //http://example.com/admin/post/new, the following would redirect to the URL http://example.com/admin:
      });
    }
  }
}
