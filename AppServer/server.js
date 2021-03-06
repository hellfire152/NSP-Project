/**
Application Server for the Project.
This server handles all processing of data, this data is sent from
the WebServer, and may or may not be from socket.io
Socket.io requests have data.type undefined.

This should be the only server that accesses the database.
That means the WebServer will not make any direct database queries.

Author: Jin Kuan
Version: pre28052017
*/
//do not shut down on error
process.on('uncaughtException', function (err) {
  console.log(err);
});


//Check for setting obejct's existence
var databasePassword = process.argv[2]
var webServerPassword = process.argv[3];
var settings = process.argv[4];
if(settings === undefined) {
throw new Error("Usage: ./run-server.bat <path to settings>");
process.exit(1);
}

//initialize settings object
var S = require(settings);
S.DATABASE.PASSWORD = databasePassword;
S.WEBSERVER.PASSWORD = webServerPassword;
const C = require(S.CONSTANTS);
var sampleData = require('../DatabaseServer/dataSample.js'); //Sample data for database testing.
var net = require('net');
var uuid = require('uuid');
var Cipher = require(S.CIPHER);
var crypto = require('crypto');
var fs = require('fs');
var util = require('util');
var allRooms = {};
var pendingDatabaseResponses = {};
var signer = net.connect(1234);
signer.setEncoding('utf8');

//getting the RSA keys
const KEYS = {
  'PUBLIC' : fs.readFileSync(S.KEYS.PUBLIC, "utf8"),
  'PRIVATE' : fs.readFileSync(S.KEYS.PRIVATE, "utf8")
};
const AUTH_BYPASS = S.AUTH_BYPASS;

//launches the app server
function initServer() {
  var server = net.createServer(function (conn) { //WebServer will connect to this server
    conn.setEncoding('utf8');

    conn.status = C.AUTH.REQUEST_CONNECTION;
    conn.sendCipher = new Cipher({
      'password' : S.WEBSERVER.PASSWORD,
      'iv' : S.WEBSERVER.INITIAL_IV
    });
    conn.receiveCipher = new Cipher({
      'password' : S.WEBSERVER.PASSWORD,
      'iv' : S.WEBSERVER.INITIAL_IV
    });

    console.log("AppServer: Server Start");
    // If connection is closed
    conn.on("end", function() {
      console.log('Server: Logic disconnected');
    });

    if(S.AUTH_BYPASS) console.log("AUTHENTICATED WILL BE BYPASSED");

    // Handle data from client
    conn.on("data", async function(input) {
      if(S.LOG_RAW) {
        console.log("RAW RESPONSE");
        console.log(input);
      }
      let data, encryption;
      if(!AUTH_BYPASS) { //Authentication bypass, set in settings
        if(conn.status != C.AUTH.AUTHENTICATED) {
          if(conn.status == C.AUTH.KEY_NEGOTIATION) {
            data = JSON.parse(await conn.receiveCipher.decrypt(input));
          } else if(conn.status == C.AUTH.REQUEST_CONNECTION) {
            console.log("CONNECTION REQUESTED");
            data = JSON.parse(input);
          } else {
            data = JSON.parse(conn.receiveCipher.rsaDecrypt(input, KEYS.PRIVATE));
          }
        } else data = JSON.parse(await conn.receiveCipher.decrypt(input));
      } else {
        conn.status = C.AUTH.AUTHENTICATED;
        data = JSON.parse(input);
      }

      let reqNo = data.reqNo;
      delete data.reqNo;  //hide reqNo from logs
      console.log("FROM WEBSERVER"); //Log all data received from the WebServer
      console.log(util.inspect(data, {showHidden: false, depth: null}));
      let response = {};

      if(conn.status != C.AUTH.AUTHENTICATED) { //not authenticated yet
        /**AUTHENTICATION PROCESS**/
        switch(conn.status) {
          case C.AUTH.REQUEST_CONNECTION : { //input has public key
            try {
              //send a json, with this server's public key and the challenge
              response = new Promise((resolve, reject) => {
                verify(data.publicKey, data.sig).then((result) => {
                  if(result == 'true') {
                    conn.publicKey = data.publicKey;
                    conn.challengeString = uuid();
                    encryption = 'none';
                    sign(KEYS.PUBLIC).then((response) => {
                      conn.status = C.AUTH.RECEIVED_PUBLIC_KEY;
                      resolve({'publicKey' : KEYS.PUBLIC, 'sig' : response});
                    });
                  } else conn.destroy();
                });
              });
            } catch (e){
              console.log(e);
              conn.destroy();
            }
            break;
          }
          case C.AUTH.RECEIVED_PUBLIC_KEY: {
            if(data.received) {
              conn.challengeString = uuid().slice(0, 20);
              response = {
                'challengeString' : conn.challengeString,
                'initialIv' : S.WEBSERVER.INITIAL_IV
              };
              encryption = 'rsa';
              conn.status = C.AUTH.ENCRYPTED_CHALLENGE;
            } else {
              console.log("Invalid signal");
              conn.destroy();
            }
            break;
          }
          case C.AUTH.ENCRYPTED_CHALLENGE : { //receiving the challenge string
            try {
              if(conn.challengeString ==
                await conn.receiveCipher.decrypt(data.encryptedChallenge)) {
                conn.encryptedChallenge = data.encryptedChallenge;
                console.log("CHALLENGE STRING VALIDATED");
                //no need for the challenge string anymore...
                delete conn.challengeString;

                //generate key using diffie-hellman
                console.log(`Generating a ${S.DH_KEY_LENGTH} bit prime, this may take a while...`);
                conn.dh = crypto.createDiffieHellman(S.DH_KEY_LENGTH);
                conn.dhKey = conn.dh.generateKeys('base64');

                response = {
                  'prime' : conn.dh.getPrime('base64'),
                  'generator' : conn.dh.getGenerator('base64'),
                  'key' : conn.dhKey
                };
                encryption = 'aes';

                conn.status = C.AUTH.KEY_NEGOTIATION;
              } else {
                console.log("AppServer: WebServer password invalid!");
                conn.destroy();
              }
              break;
            } catch (e) {
              console.log(e);
              conn.destroy();
            }
            break;
          }
          case C.AUTH.KEY_NEGOTIATION : { //input is the diffie-hellman public key
            try {
              let key = data.dhPublic;
              conn.secret = conn.dh.computeSecret(key, 'base64', 'base64');
              console.log("SECRET" +conn.secret);
              let r = conn.sendCipher.hash(
                conn.sendCipher.xorString(conn.secret, conn.encryptedChallenge));
              let s = conn.sendCipher.hash(
                conn.sendCipher.xorString(conn.secret, S.WEBSERVER.PASSWORD));

              conn.sendCipher.password = s;
              conn.receiveCipher.password = r;
              conn.status = C.AUTH.AUTHENTICATED;

              response = {
                'auth' : true
              };
              encryption = 'aes';
            } catch (e) {
              console.log(e);
            }
            break;
          }
        }
      } else {
        try {
          //if there's an Error
          if (data.err) {
            console.log("ERROR RECEIVED, CODE: " + data.err);
            switch(data.err) {
              //handle errors
            }
          }
          if(data.type !== undefined) { //data type defined
            response = await handleReq({
                'data' : data,
                'C' : C,
                'allRooms' : allRooms,
                'dbConn' : dbConn
              });
          } else if (!(data.event === undefined)){ //event defined -> socket.io stuff
            response = await handleIo({
              'data' : data,
              'C' : C,
              'allRooms' : allRooms,
              'sendToServer': sendToServer,
              'conn': conn,
              'dbConn' : dbConn
            });
          } else if (!(data.game === undefined)){  //game stuff
            response = await handleGame({
              'data' : data,
              'C' : C,
              'allRooms' : allRooms,
              'conn': conn,
              'sendToServer': sendToServer,
              'dbConn' : dbConn
            });
          } else {
            response = await handleSpecial({  //special
              'data' : data,
              'C' : C,
              'allRooms' : allRooms,
              'dbConn' : dbConn
            });
          }
        } catch (err) {
          console.log(err);
          console.log('WebServer to AppServer input Error!');
        }
      }

      //logging and response
      if(response.then) { //if a promise is returned
        response.then((r) => {
          console.log("AppServer Response (PROMISE): ");
          console.log(r);
          r.reqNo = reqNo;
          sendToServer(conn, r);
        });
      } else {
        console.log("AppServer Response: ");
        console.log(response);
        response.reqNo = reqNo; // To web
        if(S.AUTH_BYPASS) encryption = 'none';
        sendToServer(conn, response, encryption);
      }
    });
  });
  server.listen(9090);
  console.log("Listening on port 9090...");
}

//connection with datbase server
var dbConn = net.connect({
  'port' : S.DATABASE.PORT,
  'host' : S.DATABASE.HOST
});

dbConn.setEncoding('utf8');
//cipher objects to send between servers
dbConn.sendCipher = new Cipher({
  'password' : S.DATABASE.PASSWORD
});
dbConn.receiveCipher = new Cipher({
  'password' : S.DATABASE.PASSWORD
});

var encryptAndSend;
if(S.AUTH_BYPASS) {
  encryptAndSend = (reqObj) => {
    dbConn.write(JSON.stringify(reqObj)); ;
  }
} else {
  encryptAndSend = (reqObj, encryption) => {
    if(encryption == "rsa")  {
      dbConn.write(
        dbConn.sendCipher.rsaEncrypt(JSON.stringify(reqObj), dbConn.publicKey) //rsa encryption
      );
    }
    else if(encryption == "none") dbConn.write(JSON.stringify(reqObj));  //no encryption
    else {  //encrypt using shared key
      dbConn.sendCipher.encrypt(JSON.stringify(reqObj))
        .then((data) => {
          dbConn.write(data);
        });
    }
  }
}

function logResponse(response) {
  console.log("DATABASE RESPONSE:");
  console.log(util.inspect(response, {showHidden: false, depth: null}));
}

async function decryptResponse(response) {
  if(dbConn.encryption == 'none') {
    console.log("NO ENCRYPTION");
    return splitJsons(response);
  } else if(dbConn.encryption == 'rsa')  {
    return splitJsons(dbConn.receiveCipher.rsaDecrypt(response, KEYS.PRIVATE));
  } else {
    return splitJsons(await dbConn.receiveCipher.decrypt(response));
  }
}

function runCallback(response) {
  if(pendingDatabaseResponses[response.reqNo]) {
    if(pendingDatabaseResponses[response.reqNo].callback)
      pendingDatabaseResponses[response.reqNo].callback(response);
    delete pendingDatabaseResponses[response.reqNo];
  }
}

//implementing the send function on the database connection
dbConn.send = (reqObj, callback, encryption) => {
  //generating a unique id to identify the request
  let reqNo = uuid();
  reqObj.reqNo = reqNo;
  console.log(callback);

  //storing the callback for later calling
  pendingDatabaseResponses[reqNo] = {};
  if(callback)
    if(callback && {}.toString.call(callback) == '[object Function]') //IF FUNCTION
      pendingDatabaseResponses[reqNo].callback = callback;
    else
      throw new Error('Callback is not a function!');

  //sending the request object
  console.log("TO DATABASE SERVER:");
  console.log(reqObj);
  encryptAndSend(reqObj, encryption);
  return reqNo; //just in case
};

//Recieve data from database and run callback
dbConn.encBuffer = "";
dbConn.on('data', async function(inputData) {
  if(S.LOG_RAW) {
    console.log(`DATABASE RAW: ${inputData}`);
  }
  try {
    if(dbConn.encBuffer.length > 0) {
      data = await decryptResponse(dbConn.encBuffer + inputData);
      dbConn.encBuffer = "";
    } else {
      data = await decryptResponse(inputData);
    }
    console.log(data);
    for(let d of data) {
      logResponse(d);
      runCallback(d);
    }
  } catch (e) {
    dbConn.encBuffer += inputData;
  }
});

/****AUTHENTICATION******/
dbConn.encryption = 'none';
async function sign(key) {
  return new Promise((resolve, reject) => {
    signer.once('data', (input) => {
      console.log(input);
      resolve(input);
    });
    signer.write(JSON.stringify({
    'type':  0,
    'key' : key
    }));
  });
}

async function verify(key, sig) {
  return new Promise((resolve, reject) => {
    signer.once('data', (input) => {
      resolve(input);
    });
    signer.write(JSON.stringify({
    'type':  1,
    'key' : key,
    'sig' : sig
    }));
  });
}

if(!S.AUTH_BYPASS) {
  sign(KEYS.PUBLIC).then((signed) => {
    console.log(signed);
    dbConn.send({'publicKey' : KEYS.PUBLIC, 'sig' : signed}, (response) => {
      //receiving public key of AppServer
      console.log("PUBLIC KEY RECEIVED");
      verify(response.publicKey, response.sig).then((result) => {
        if(result == 'true') {
          dbConn.publicKey = response.publicKey;
          dbConn.encryption = 'rsa';
          dbConn.send({'received' : true}, (response) => {
            //receive challengeString
            console.log("RECEIVED CHALLENGE STRING");
            dbConn.sendCipher.iv = response.initialIv;
            dbConn.receiveCipher.iv = response.initialIv;
            dbConn.receiveCipher.encrypt(response.challengeString)
            .then((challengeString) => {
              dbConn.encryption = 'aes'; //response will be encrypted using aes
              dbConn.send({
                'encryptedChallenge' : challengeString
              }, (response) => {
                //receive diffie-hellman stuff
                dbConn.dh = crypto.createDiffieHellman(
                  response.prime, 'base64', response.generator, 'base64');
                  dbConn.dhKey = dbConn.dh.generateKeys('base64');
                  dbConn.secret = dbConn.dh.computeSecret(response.key, 'base64', 'base64');
                  console.log("SECRET" +dbConn.secret);
                  let s = dbConn.sendCipher.hash(
                    dbConn.sendCipher.xorString(dbConn.secret, challengeString));
                    let r = dbConn.sendCipher.hash(
                      dbConn.sendCipher.xorString(dbConn.secret, S.DATABASE.PASSWORD));

                      //cipher change
                      dbConn.prependOnceListener('data', () => {
                        dbConn.sendCipher.password = s;
                        dbConn.receiveCipher.password = r;
                      });

                      //send key to AppServer
                      dbConn.send({'dhPublic' : dbConn.dhKey}, (response) => {
                        if(response.auth) {
                          delete dbConn.encryption; //no need this anymore
                          delete dbConn.secret; //or this
                          delete dbConn.dh //or that
                          delete dbConn.dhKey //EXTERRRRMINATE
                          console.log(r);
                          initServer();
                        }
                      }, 'aes');
                    }, 'rsa');
                  });
                }, 'rsa');

              }
            });
      }, 'none');
  });
} else {
  console.log("AUTHENTICATION BYPASSED");
  initServer();
}

//Test sample data
// sendToServer(dbConn, sampleData.retrieveUserDetails());

/*
  Function that encodes the data in a proper format and sends it to the WebServer
  This is a convenience function, so that future implementations of encryption/whatever
  will be easy to add in
*/
function sendToServer(conn, json, encryption) {
  if(encryption == 'rsa') {
    console.log(`WRITING ${json}`);
    conn.write(conn.sendCipher.rsaEncrypt(JSON.stringify(json), conn.publicKey));
  } else if (encryption == 'none' || S.AUTH_BYPASS || conn.status == C.AUTH.RECEIVED_PUBLIC_KEY) {
    console.log("NO ENCRYPTION");
    conn.write(JSON.stringify(json));
  } else {
    conn.sendCipher.encrypt(JSON.stringify(json))
      .then((data) => {
        console.log(`RAW: ${data}`);
        conn.write(data);
      });
  }
}

var handleIo = require('./server/app-handle-io.js');
var handleReq = require('./server/app-handle-req.js');
var handleGame = require('./server/app-handle-game.js');
var handleSpecial = require('./server/app-handle-special.js');

/*
  Takes in a string of any number of concatenated JSON strings,
  and returns an array of parsed JSON objects
*/
function splitJsons(jsons) {
  if(jsons[0] !== '{') throw new Error('Invalid response!');
  let s = [];
  let r = [];
  for(let i = 0, j = 0; i < jsons.length; i++) {
    if(jsons[i] === '{') s.push(1);
    else if(jsons[i] === '}') {
      let b = s.pop();
      if(b === undefined) throw new Error('Invalid response, expected "{" !');
      if(s.length === 0) {
        r.push(JSON.parse(jsons.substr(j, i + 1)));
        j = i + 1;
      }
    }
  }
  return r;
}
