/**
  Cipher module for the project
  Usage: require(<path to this module>)({
    password: <password> (default: aVaTyAzkOqweA)
    algorithm: <any algorithm> (default: aes256)
    iv: <iv (if applicable)> (default: no iv)
  })
  All of the above options are optional

  All methods return a Promise Object, so, to use it, write
  var encrypted = cipher.encrypt('test');
  encrypted.then(<any function>) //the encrypted value is the first argument
  in the function

  Author: Jin Kuan
*/
var crypto = require('crypto');

//DEFAULT VALUES
var algorithm = "aes256";
var password = "aVaTyAzkOqweA";
var iv = null;

/*
  Function I wrote trying to get the IV thing to work,
  remove if you wish
*/
function ensureSize(byteStream, size) {
  const salt = byteStream;
  const hash = crypto.createHash("sha256");

  hash.update(salt);

  let hashed = hash.digest().slice(0, (size/8 - 1));
  return hashed;
}
/*
  Function I wrote trying to get the IV thing to work,
  remove if you wish
*/
function stringToBuffer(s) {
  var charArr = [];
  for(let i = 0; i < s.length; i++) {
    charArr.push(+s[i]);
  }
  console.log("charArr="+charArr);
  return Buffer.from(charArr);
}

/*
  Encrypts the data. Simple enough
*/
async function encrypt(plain) {
  var cipher = crypto.createCipher(algorithm,password);
  var encrypted = cipher.update(plain,'utf8','binary')
  encrypted += cipher.final('binary');
  return encrypted;
}

/*
  Decrypts the data. Who would've thought
*/
async function decrypt(cipher) {
  var decipher = crypto.createDecipher(algorithm,password);
  var dec = decipher.update(cipher, 'binary', 'utf8');
  dec += decipher.final('utf8');
  return dec;
}

/*
  Takes in a JSON for the argument, automatically stringifies and encrypts it

  This will most likely be the more used function.
*/
async function encryptJSON(plain) {
  try {
    return await encrypt(JSON.stringify(plain));
  } catch (err) {
    throw new Error(err);
  }
}

/*
  Takes in ciphertext for the argument, automatically turns it into the decrypted JSON

  This will most likely be the more used function.
*/
async function decryptJSON(cipher) {
  try {
    return JSON.parse(await decrypt(cipher));
  } catch (err) {
    throw new Error(err);
  }
}

//TODO:: GET THESE THINGS DONE
function encryptIv(plain) {
}

function decryptIv(cipher) {
}

//Not sure if a function like this is needed or not
function hash() {

}

module.exports = function(options) {
  if(!(options === undefined)) {  //setting options (if used);
    if (!(options.password === undefined)) password = options.password;
    if (!(options.iv === undefined)) iv = options.iv;
  }

  return {
    "encrypt": encrypt,
    "decrypt": decrypt,
    "encryptJSON": encryptJSON,
    "decryptJSON": decryptJSON,
    "encryptIv": encryptIv,
    "decryptIv": decryptIv,
    "hash": hash,
    "iv": iv
  }
}
