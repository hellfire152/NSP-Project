var uuid = require('uuid');
var crypto = require('crypto');
module.exports = function(sessionHandler) {
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
      
    }
  }
}
