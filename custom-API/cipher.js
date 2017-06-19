/**
  Cipher module for the project
  Usage: require(<path to this module>)({
    password: <password> (default: aVaTyAzkOqweA)
    algorithm: <any algorithm> (default: aes256)
    iv: <iv (if applicable)> (default: 5dZoC41JFwmLQMYo)
  })
  All of the above options are optional

  All methods return a Promise Object, so, to use it, write
  var encrypted = cipher.encrypt('test');
  encrypted.then(<any function>) //the encrypted value is the first argument
  in the function

  By using cipher block chaining (CBC) algorithm plaintext block of 16 character
  will xor with 16 character of IV making every plaintext block unique, thus
  prevent repetition of cipher block.
  IV will be constantly change to the first 16 character of the previous
  cipher text block.

  Author: Jin Kuan
  Secondary Author: Nigel
*/
var crypto = require('crypto');

//DEFAULT VALUES
var algorithm = "aes256";
var password = "aVaTyAzkOqweA";
var iv = "5dZoC41JFwmLQMYo";
var plainTextBlockSize = 16; //plain text block size (16-31) can change if needed.
var cipherTextBlockSize = 64;

//Encrypt data using IV and AES via CBC algorithm
async function handleEncryption(plain){
  var subIv = await newIv(iv);
  var encodedPlain = await encode(plain);
  var cipherText = ""
  for(let encodedBlock of encodedPlain){
    var encodedBlockWithIv = await xor(encodedBlock, subIv);
    var decodedBlockWithIv = await decode(encodedBlockWithIv);
    var cipherBlock = await encrypt(decodedBlockWithIv);
    subIv = await newIv(cipherBlock);
    cipherText += cipherBlock;
  }

  console.log("[Encryption complete]");
  return cipherText;
}

//Decrypt data using IV and AES via CBC algorithm
async function handleDecryption(cipher){
  var plainText = "";
  var cipherTextBlock = await splitCipherBlock(cipher);
  var subIv = await newIv(iv);
  for(let cipherBlock of cipherTextBlock){
    var cipherBlockWithIv = await decrypt(cipherBlock);
    var encodedBlockWithIv = await encode(cipherBlockWithIv);
    var encodedBlock = await xor(encodedBlockWithIv[0], subIv);
    var plainTextBlock = await decode(encodedBlock);
    subIv = await newIv(cipherBlock);

    plainText += plainTextBlock;
  }
  console.log("[Decryption complete]");
  return plainText;
}

/*
  Encrypts the data. Simple enough
*/
async function encrypt(plain) {
  var cipher = crypto.createCipher(algorithm,password);
  var encrypted = cipher.update(plain,'utf8','hex')
  encrypted += cipher.final('hex');
  return encrypted;
}

/*
  Decrypts the data. Who would've thought
*/
async function decrypt(cipher) {
  var decipher = crypto.createDecipher(algorithm,password);
  var dec = decipher.update(cipher, 'hex', 'utf8');
  dec += decipher.final('utf8');
  return dec;
}

/*
  Takes in a JSON for the argument, automatically stringifies and encrypts it

  This will most likely be the more used function.
*/
async function encryptJSON(plain) {
  try {
    return await handleEncryption(JSON.stringify(plain));
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
    return JSON.parse(await handleDecryption(cipher));
  } catch (err) {
    throw new Error(err);
  }
}

//Encrypt all data in the object and then store to database
async function encryptDbData(plain) {
  for (var key in plain) {
    if (plain.hasOwnProperty(key)) {
      if(await allow (key)){
        plain[key] = await handleEncryption(plain[key]);
      }
    }
  }
  return plain;
}

//Decrypt all data in the object and then pass it to appserver.
async function decryptDbData(cipherText) {
  var plainText = [];
  for(let cipher of cipherText){
    for (var key in cipher) {
      if (cipher.hasOwnProperty(key)) {
        if(await allow (key)){
          if(cipher[key] !== null){
            cipher[key] = await handleDecryption(cipher[key]);
          }
        }
      }
      var cipherArr = cipher
    }
    plainText.push(cipherArr);
  }

  return plainText;
}

//By using Convert every single character to ascii character code to obtain numeric value
async function encode(plainText){
  var encodedValue = [];

  var i = 0;
  loop1:
    while(i < plainText.length){
      var result = [];
        for(j=i ; j<i+plainTextBlockSize ; j++){
          var asciiChar = plainText.charCodeAt(j);
          if(isNaN(asciiChar)){
            encodedValue.push(result);
            break loop1;
          }
          result.push(asciiChar);

        }
      encodedValue.push(result);
      i += plainTextBlockSize;
    }

  return encodedValue;
}

//Convert ascii character code to readable character block by block.
async function decode(encodedText){
  var decodedText = "";
  for(i=0 ; i<encodedText.length ; i++){
    decodedText += String.fromCharCode(encodedText[i]);
  }
  return decodedText;
}

//Convert ascii charcater code to readable character all in one shot.
async function decodeAll(encodedTextAll){
  var decodedTextAll = "";
  for(i=0 ; i<encodedText.length ; i++){
    for(j=0 ; j<encodedTextAll[i].length ; j++){
      decodedTextAll += String.fromCharCode(encodedTextAll[i][j]);
    }
  }
  return decodedTextAll;
}

//Create new iv by geting first 16 chracter in cipher text.
async function newIv(text){
  var newIv = await encode(text.substr(0, 16));
  return newIv[0];
}

//xor iv with encodedText to increase the random-ness
//CBC algorithm require iv from previous cipher block
async function xor(value, iv){
  xorValue = [];
  for(i=0 ; i<value.length ; i++){
    xorValue.push(value[i]^iv[i])
  }
  return xorValue;
}

//Split cipher block to 64 equal character, leftover character will still work
async function splitCipherBlock(cipher){
  return cipher.match(/.{1,64}/g); // Depenending on cipher text block size, size may vary.
}

//Hash value with SHA256
async function hash(input) {
  var hash =  crypto.createHash('SHA256').update(input).digest('base64');
  return hash;
}
//Generate new salt value for newly created account
async function generateSalt(){
  var saltValue = crypto.randomBytes(32).toString('base64');
  return saltValue;
}

//Data with the column name stated below will be encrypted
async function allow(key){
 switch(key){
   case "prompt" : {
     return true;
     break;
   }
   case "solution" : {
     return true;
     break;
   }
   case "choices" : {
     return true;
     break;
   }
   case "password_hash" : {
     return true;
     break;
   }
   case "salt" : {
     return true;
     break;
   }
   default : {
     return false;
     break;
   }
 }
}

module.exports = function(options) {
  if(!(options === undefined)) {  //setting options (if used)
    if (!(options.password === undefined)) password = options.password;
    if (!(options.iv === undefined)) iv = options.iv;
  }

  return {
    "encrypt": encrypt,
    "decrypt": decrypt,
    "encryptJSON": encryptJSON,
    "decryptJSON": decryptJSON,
    "encryptDbData" : encryptDbData,
    "decryptDbData" : decryptDbData,
    "handleEncryption" : handleEncryption,
    "handleDecryption" : handleDecryption,
    "hash": hash,
    "iv": iv,
    "generateSalt" : generateSalt
  }
}
