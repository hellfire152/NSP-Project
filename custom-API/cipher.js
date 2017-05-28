/**
  Cipher module for the project
  Usage: require(<path to this module>)({
    password: <password> (default: aVaTyAzkOqweA)
    algorithm: <any algorithm> (default: aes256)
    iv: <iv (if applicable)> (default: no iv)
  })
  All of the above options are optional
  
  Author: Jin Kuan
*/
var crypto = require('crypto');

var algorithm = "aes256";
var password = "aVaTyAzkOqweA";
var iv = null;

function ensureSize(byteStream, size) {
  const salt = byteStream;
  const hash = crypto.createHash("sha256");

  hash.update(salt);

  let hashed = hash.digest().slice(0, (size/8 - 1));
  return hashed;
}

function stringToBuffer(s) {
  var charArr = [];
  for(let i = 0; i < s.length; i++) {
    charArr.push(+s[i]);
  }
  console.log("charArr="+charArr);
  return Buffer.from(charArr);
}

function encrypt(plain) {
  var cipher = crypto.createCipher(algorithm,password);
  var encrypted = cipher.update(plain,'utf8','binary')
  encrypted += cipher.final('binary');
  return encrypted;
}

function decrypt(cipher) {
  var decipher = crypto.createDecipher(algorithm,password);
  var dec = decipher.update(cipher, 'binary', 'utf8');
  dec += decipher.final('utf8');
  return dec;
}

function encryptIv(plain) {
}

function decryptIv(cipher) {
}

//takes in any number of arguments
function hash() {

}

module.exports = function(options) {
  if(!(options === undefined)) {
    if (!(options.password === undefined)) password = options.password;
    if (!(options.iv === undefined)) iv = options.iv;
  }

  return {
    "encrypt": encrypt,
    "decrypt": decrypt,
    "encryptIv": encryptIv,
    "decryptIv": decryptIv,
    "hash": hash,
    "iv": iv
  }
}
