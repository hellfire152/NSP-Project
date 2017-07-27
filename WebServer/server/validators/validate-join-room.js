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
<<<<<<< HEAD
        .then(function(cookieData) {
        var joinGame = {
          userId: req.body.id,
          id: req.body.room
        }
        res.cookie('login', cookieData, {"maxAge": 1000*60*60}); //one hour
        res.cookie('game',JSON.stringify(joinGame)); //game cookie?
        res.redirect('/play?room=' +req.body.room);
      });
=======
        .then((cookies) => {
          res.cookie('login', cookies[0], {"maxAge": 1000*60*60}); //one hour
          res.cookie('game', cookies[1]); //game cookie
          res.redirect('/play?room=' +req.body.room);
        });
>>>>>>> origin/master
    }
  }
}
