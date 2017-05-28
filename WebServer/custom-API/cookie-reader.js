/**
  Javascript file containing all the functions related to cookie reading
*/
var cipher = require('./cipher.js')();

function encryptData(Obj) {
  return cipher.encrypt(JSON.stringify(Obj));
}

function decryptData(Obj) {
  return JSON.parse(cipher.decrypt(Obj));
}

function joinRoom(data) {

}
module.exports = {
  "encryptData": encryptData,
  "decryptData": decryptData,
  "joinRoom": joinRoom
};
