var uuid = require('uuid/v4');
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
      var iv = uuid();
      var cipher = crypto.createCipheriv('aes192', 'tHisIsthEkEyFORaesEnCryPtion', iv);
      let encrypted = '';
      cipher.on('readable', () => {
        const data = cipher.read();
        if(data) {
          encrypted += data.toString('hex');
        }
      });

      cipher.on('end', () => {
        res.cookie('login', encrypted);
        res.redirect('/play');
      });

      var data = {
        'user': id,
        'pass': pass
      };

      cipher.write(JSON.stringify(data));

      sessionHandler.iv.store(id, iv);
    }
  }
}
