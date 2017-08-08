var crypto = require('crypto');
var fs = require('fs');
var privateKey = fs.readFileSync('./private.key', 'utf8');
var publicKey = fs.readFileSync('./public.key', 'utf8');

var sign = crypto.createSign('RSA-SHA256');
sign.update('abc');
var sig = sign.sign(privateKey, 'base64');

var verify = crypto.createVerify('RSA-SHA256');
verify.write('abc');
console.log(verify.verify(publicKey, sig, 'base64'));

var net = require('net');
var conn = net.connect({
  'host': '192.168.0.192',
  'port' : 1234
});
conn.write(JSON.stringify({
  'type' : 0,
  'key': 'sfSDFASDfad'
}));
