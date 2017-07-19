/**
  Test file for validating the test version of the room joining form.

  Author: Jin Kuan
*/

const uuid = require('uuid');
module.exports = function(cipher, appConn) {
  return function(req, res) {
    console.log("===Validate-Join-Room.js");
    req.checkBody('id', 'Username must be specified').notEmpty();
    req.checkBody('pass', 'Password must be specified').notEmpty();
    req.checkBody('room', 'Room ID must be specified').notEmpty();

    req.sanitize('id').escape();
    req.sanitize('pass').escape();
    req.sanitize('room').escape();
    req.sanitize('id').trim();
    req.sanitize('pass').trim`();`
    req.sanitize('room').trim();

    var errors = req.validationErrors();
    if(errors) {
      //TODO::Handle errors
    } else {
      cipher.encryptJSON({
        "id": req.body.id,
        "pass": req.body.pass
      })
        .catch(function (err) {
          throw new Error('Error parsing JSON!');
        })
        .then(function(cookieData) {
        res.cookie('login', cookieData, {"maxAge": 1000*60*60}); //one hour
        res.redirect('/play?room=' +req.body.room);
      });
    }

  }
}
