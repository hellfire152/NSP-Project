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

c.encrypt('abc')
  .then(cipher => {
    console.log(cipher);
    c.iv = 'bcd';
    c.encrypt('bcd')
      .then(cipher => {
        console.log(cipher);
      });
  })
