var Cipher = require('../custom-API/Cipher.js');
var fs = require('fs');
const KEYS = {
  'PUBLIC' : fs.readFileSync('./keys/AppServer-public.key'),
  'PRIVATE' : fs.readFileSync('./keys/AppServer-private.key')
};

let c = new Cipher({
  'password': 'df',
  'iv' : 'sdf'
});

let data = c.rsaEncrypt(JSON.stringify({
  'reqNo' : '655555555555555555555555555555555555555555555'
}), KEYS.PUBLIC);

let d = c.rsaDecrypt(data, KEYS.PRIVATE);

console.log(data);
console.log(d);
