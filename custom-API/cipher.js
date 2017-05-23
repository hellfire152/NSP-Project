var cipher = require('crypto');

var algorithm = "aes-192";
var password = "aVaTyAzkOqweA";

function encrypt(plain) {
  var cipher = crypto.createCipher(algorithm,password);
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}

function decrypt(cipher) {
  var decipher = crypto.createDecipher(algorithm,password);
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}

module.exports = {
  "encrypt": encrypt,
  "decrypt": decrypt
};
