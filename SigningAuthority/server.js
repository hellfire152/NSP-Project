//do not shut down on error
process.on('uncaughtException', function (err) {
  console.log(err);
});

var net = require('net');
var crypto = require('crypto');
var fs = require('fs');
var privateKey = fs.readFileSync('./private.key', 'utf8');
var publicKey = fs.readFileSync('./public.key', 'utf8');
var signer = net.connect(1234);
signer.setEncoding('utf8');
var server = net.createServer(function(conn) {
  conn.setEncoding('utf8');

  conn.on('data', (input) => {
    let data = JSON.parse(input);
    if(data.type == 0) { //signing
      console.log("RECEIVED PUBLIC KEY");
      var sign = crypto.createSign('RSA-SHA256');
      sign.update(data.key);
      var sig = sign.sign(privateKey, 'base64');
      conn.write(sig);
    }
    else if (data.type == 1){ //verifying
      var verify = crypto.createVerify('RSA-SHA256');
      console.log(`VERIFYING ${data.key}`);
      verify.write(data.key);
      conn.write(""+verify.verify(publicKey, data.sig, 'base64'));
    }
  });
});

server.listen(1234);
console.log("Started signing authority");
