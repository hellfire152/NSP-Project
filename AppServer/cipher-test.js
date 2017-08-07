var Cipher = require('../custom-API/Cipher.js');
var fs = require('fs');
const KEYS = {
  'PUBLIC' : fs.readFileSync('./keys/AppServer-public.key'),
  'PRIVATE' : fs.readFileSync('./keys/AppServer-private.key')
};

let c = new Cipher({
  'password': 'df',
  'iv' : 'abc'
});

let a = c.xorString("sdfsadfasdF", 'SDFASDFASDFSAD');
console.log(a);
console.log(c.hash(a));
