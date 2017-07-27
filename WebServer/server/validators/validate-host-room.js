/**
  Test file for validating the test version of the room hosting form.

  Author: Jin Kuan
*/

const uuid = require('uuid');
module.exports = function(cipher, appConn) {
  return function(req, res) {
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
      Promise.all([cipher.encryptJSON({
        "id": req.body.id,
        "pass": req.body.pass
      }), cipher.encryptJSON({
        'username' : req.body.id,
        'room' : req.body.room
      })])
        .catch((err) => {
          console.log(err);
        })
        .then((cookies) => {
          res.cookie('login', cookies[0], {"maxAge": 1000*60*60}); //one hour
          res.cookie('game', cookies[1]); //game cookie
          res.redirect('/host?quizId=' +req.body.quizId);
        });
    }
  }
}
