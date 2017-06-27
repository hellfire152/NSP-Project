/**
  Test file for validating the test version of the room creating.

  Author: Chloe
*/

const uuid = require('uuid');
module.exports = function(cipher, appConn) {
  return function(req, res) {
    // console.log(cipher);

    // check name + description not empty, ' ' -> id
    req.checkBody('nameofQuiz', 'Name of quiz must be specified').notEmpty().isString;
    req.checkBody('desc', 'Description must be specified').notEmpty().isString;

    req.sanitize('desc').escape();
    req.sanitize('nameofQuiz').escape();
    req.sanitize('desc').trim();
    req.sanitize('nameofQuiz').trim();

    var errors = req.validationErrors();

    if(errors) {


    } else {
      console.log("Creating a quiz data: ");
      console.log(req.body);


      cipher.encryptJSON({
        "nameofQuiz": req.body.nameofQuiz,
        "desc": req.body.desc,
      })
        .catch(function (err) {
          throw new Error('Error parsing JSON!');
        })
        .then(function(cookieData) {
        res.cookie('login', cookieData, {"maxAge": 1000*60*60}); //one hour
        res.redirect('/create-quiz?nameofQuiz=' +req.body.nameofQuiz); // For example, if the application is on
        //http://example.com/admin/post/new, the following would redirect to the URL http://example.com/admin:
      });
    }
  }
}
