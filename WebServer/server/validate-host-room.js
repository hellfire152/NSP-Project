/**
  Test file for validating the test version of the room hosting form.

  Author: Jin Kuan
*/

const uuid = require('uuid');
module.exports = function(cipher, appConn) {
  return function(req, res) {
    console.log(cipher);
    req.checkBody('id', 'Username must be specified').notEmpty();
    req.checkBody('pass', 'Password must be specified').notEmpty();
    req.checkBody('quizId', 'Room ID must be specified').notEmpty();

    req.sanitize('id').escape();
    req.sanitize('pass').escape();
    req.sanitize('quizId').escape();
    req.sanitize('id').trim();
    req.sanitize('pass').trim();
    req.sanitize('quizId').trim();

    var errors = req.validationErrors();

    if(errors) {
      //TODO::Handle errors
    } else {
      console.log("HOST FORM DATA: ");
      console.log(req.body);
      cipher.encryptJSON({
        "id": req.body.id,
        "pass": req.body.pass,
        "quizId": req.body.quizId
      })
        .catch(function (err) {
          throw new Error('Error parsing JSON!');
        })
        .then(function(cookieData) {
        res.cookie('hosting_room', cookieData, {"maxAge": 1000*60}); //one minute
        res.redirect('/host?quizId=' +req.body.quizId);
      });
    }
  }
}
