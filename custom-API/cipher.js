/**
  Cipher module for the project
  Usage: require(<path to this module>)({
    password: <password>
    algorithm: <any algorithm> (default: aes256)
    iv: <iv (if applicable)>
  })
  All of the above options are optional
  var c = new Cipher(options);
  c.encrypt('ABC').then((cipher) => {<whatever you want>})

  All methods return a Promise Object, so, to use it, write
  var encrypted = cipher.encrypt('test');
  encrypted.then(<any function>) //the encrypted value is the first argument
  in the function

  By using cipher block chaining (CBC) algorithm plaintext block of 16 character
  will xor with 16 character of IV making every plaintext block unique, thus
  prevent repetition of cipher block.
  IV will be constantly change to the first 16 character of the previous
  cipher text block.

  Primary Author: Nigel
  Secondary Author: Jin Kuan (rewrote to javascript class)
*/
//built-in API used
var crypto = require('crypto');

class Cipher {
  constructor(options) {
    //extracting data from options
    this._password = (options.password)? options.password : '';
    this._algorithm = (options.algorithm)? options.algorithm : 'aes256';
    this._iv = (options.iv)? options.iv : '';

    //fixed block sizes
    this._plainTextBlockSize = 16;  //(16 to 31), can change if needed
    this._cipherTextBlockSize = 64;
  }

  //encrypt data using IV and AES-CBC
  async encrypt(plain) {
    if(this._iv === undefined) throw new Error("No IV defined!");
    var subIv = _newIv(this._iv);
    var encodedPlain = _encode(plain, this._plainTextBlockSize);
    var cipherText = "";
    for(let encodedBlock of encodedPlain){
      var encodedBlockWithIv = _xor(encodedBlock, subIv);
      var decodedBlockWithIv = _decode(encodedBlockWithIv);
      var cipherBlock = _encryptBlock(decodedBlockWithIv, this._algorithm, this._password);
      subIv = _newIv(cipherBlock);
      cipherText += cipherBlock;
    }

    //console.log("[Encryption complete]");
    return cipherText;
  }

  //Decrypt data using IV and AES via CBC algorithm
  async decrypt(cipher){
    if(this._iv === undefined) throw new Error("No IV defined!");
    var plainText = "";
    var cipherTextBlock = _splitCipherBlock(cipher);
    var subIv = _newIv(this._iv);
    for(let cipherBlock of cipherTextBlock){
      var cipherBlockWithIv = _decryptBlock(cipherBlock, this._algorithm, this._password);
      var encodedBlockWithIv = _encode(cipherBlockWithIv, this._plainTextBlockSize);
      var encodedBlock = _xor(encodedBlockWithIv[0], subIv);
      var plainTextBlock = _decode(encodedBlock);
      subIv = _newIv(cipherBlock);
      plainText += plainTextBlock;
    }
    return plainText;
  }

  /*
    Takes in a JSON for the argument, automatically stringifies and encrypts it

    This will most likely be the more used function.
  */
  async encryptJSON(plain) {
    try {
      return await this.encrypt(JSON.stringify(plain));
    } catch (err) {
      throw new Error(err);
    }
  }

  /*
    Takes in ciphertext for the argument, automatically turns it into the decrypted JSON

    This will most likely be the more used function.
  */
  async decryptJSON(cipher) {
    try {
      return JSON.parse(await this.decrypt(cipher));
    } catch (err) {
      throw new Error(err);
    }
  }

  //Encrypt all data in the object
  async encryptDbData(plain) {
    for (var key in plain) {
      if (plain.hasOwnProperty(key)) {
        if(await _allow (key)){
          plain[key] = await this.encrypt(plain[key]);
        }
      }
    }
    return plain;
  }

  //Decrypt all data in the object
  async decryptDbData(cipherText) {
    var plainText = [];
    for(let cipher of cipherText){
      for (let key in cipher) {
        if (cipher.hasOwnProperty(key)) {
          if(await _allow (key)){
            if(cipher[key] !== null){
              cipher[key] = await this.decrypt(cipher[key]);
            }
          }
        }
        var cipherArr = cipher;
      }
      plainText.push(cipherArr);
    }
    return plainText;
  }

  //Hash value with SHA256
  async hash(input) {
    var hash =  crypto.createHash('SHA256').update(input).digest('base64');
    return hash;
  }
  //Generate new salt value for newly created account
  async generateSalt(){
    var saltValue = crypto.randomBytes(32).toString('base64');
    return saltValue;
  }

  rsaEncrypt(toEncrypt, key) {
    var buffer = new Buffer(toEncrypt);
    var encrypted = crypto.publicEncrypt(key, buffer);
    return encrypted.toString("hex");
  }

  rsaDecrypt(toDecrypt, key) {
    var buffer = new Buffer(toDecrypt, "hex");
    var decrypted = crypto.privateDecrypt(key, buffer);
    return decrypted.toString("utf8");
  }

  set password(p) {
    this._password = p;
  }

  set iv(p) {
    this._iv = p;
  }

  set algorithm(a) {
    this._algorithm = a;
  }
}

/*
  Encrypts the data. Simple enough
*/
function _encryptBlock(plain, algorithm, password) {
  var cipher = crypto.createCipher(algorithm,password);
  var encrypted = cipher.update(plain,'utf8','hex')
  encrypted += cipher.final('hex');
  return encrypted;
}

/*
  Decrypts the data. Who would've thought
*/
function _decryptBlock(cipher, algorithm, password) {
  var decipher = crypto.createDecipher(algorithm,password);
  var dec = decipher.update(cipher, 'hex', 'utf8');
  dec += decipher.final('utf8');
  return dec;
}

//By using Convert every single character to ascii character code to obtain numeric value
//Converts every single character their respective character code
function _encode(plainText, plainTextBlockSize){
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
function _decode(encodedText){
  var decodedText = "";
  for(i=0 ; i<encodedText.length ; i++){
    decodedText += String.fromCharCode(encodedText[i]);
  }
  return decodedText;
}

//Convert ascii charcater code to readable character all in one shot.
function _decodeAll(encodedTextAll){
  var decodedTextAll = "";
  for(i=0 ; i<encodedText.length ; i++){
    for(j=0 ; j<encodedTextAll[i].length ; j++){
      decodedTextAll += String.fromCharCode(encodedTextAll[i][j]);
    }
  }
  return decodedTextAll;
}

//Create new iv by geting first 16 chracter in cipher text.
function _newIv(text){
  var newIv = _encode(text.substr(0, 16));
  return newIv[0];
}

//xor iv with encodedText to increase the random-ness
//CBC algorithm require iv from previous cipher block
function _xor(value, iv){
  xorValue = [];
  for(i=0 ; i<value.length ; i++){
    xorValue.push(value[i]^iv[i])
  }
  return xorValue;
}

//Split cipher block to 64 equal character, leftover character will still work
function _splitCipherBlock(cipher){
  var block = cipher.match(/.{1,64}/g); // Depenending on cipher text block size, size may vary.
  return block;
}

//Data with the column name stated below will be encrypted
var allowedValues = ["prompt", "solution", "choices", "password_hash", "dbPass",
  "salt", "school", "organisation", "email", "about_me", "student_category", "username", "name", "contact"];
function _allow(key){
  return (allowedValues.indexOf(key) >= 0)? true : false;
}

module.exports = Cipher;
