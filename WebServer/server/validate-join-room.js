var uuid = require('uuid');
var crypto = require('crypto');
module.exports = function(cookieReader) {
  return function(req, res) {
    req.checkBody('id', 'Username must be specified').notEmpty();
    req.checkBody('pass', 'Password must be specified').notEmpty();
    req.checkBody('room', 'Room ID must be specified').notEmpty();

    req.sanitize('id').escape();
    req.sanitize('pass').escape();
    req.sanitize('room').escape();
    req.sanitize('id').trim();
    req.sanitize('pass').trim();
    req.sanitize('room').trim();

    var errors = req.validationErrors();

    if(errors) {
      //TODO::Handle errors
    } else {
      console.log(req.body);
      res.cookie('login_and_room', cookieReader.encryptData({
        "id": req.body.id,
        "pass": req.body.pass,
        "room": req.body.room
      }), {
        "maxAge": 1000 * 60 * 5, //expires in 5 minutes
        "signed": true
      });
      res.redirect('/play?room=' +req.body.room);
    }
  }
}