/**
  Test file for validating the test version of the room hosting form.

  Author: Jin Kuan
*/

const uuid = require('uuid');
module.exports = function(cipher, appConn) {
  return function(req, res) {
    req.checkBody('id', 'Username must be specified').notEmpty();
    req.checkBody('quizId', 'Room ID must be specified').notEmpty();

    req.sanitize('id').escape();
    req.sanitize('quizId').escape();
    req.sanitize('id').trim();
    req.sanitize('quizId').trim();

    var errors = req.validationErrors();

    if(errors) {
      res.sendErrorPage('Invalid form input!');
    } else {
      req.session.hosting = true;
      setTimeout(() => {
        req.session.hosting = undefined;
      }, 5000);
      req.session.username = req.body.id;
      res.redirect('/host?quizId=' + req.body.quizId);
    }
  }
}
