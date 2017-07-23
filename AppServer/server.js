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
var settings = process.argv[2];
if(settings === undefined) {
throw new Error("Usage: ./run-server.bat <path to settings>");
process.exit(1);
}

//initialize settings object
const S = require(settings);
const C = require(S.CONSTANTS);
var sampleData = require('../DatabaseServer/dataSample.js'); //Sample data for database testing.
var net = require('net');
var uuid = require('uuid');
var Cipher = require(S.CIPHER);
var crypto = require('crypto');
var fs = require('fs');

var allRooms = {};
var pendingDatabaseResponses = {};

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
      console.log(input);
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
      console.log(data);
      let response = {};

      if(conn.status != C.AUTH.AUTHENTICATED) { //not authenticated yet
        /**AUTHENTICATION PROCESS**/
        switch(conn.status) {
          case C.AUTH.REQUEST_CONNECTION : { //input has public key
            try {
              //send a json, with this server's public key and the challenge
              conn.publicKey = data.publicKey;
              conn.challengeString = uuid();
              encryption = 'none';
              response = {
                'publicKey' : KEYS.PUBLIC
              };
              conn.status = C.AUTH.RECEIVED_PUBLIC_KEY;
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
              let r = conn.secret.substring(0, ~~(conn.secret.length / 2));
              let s =  conn.secret.substring(~~(conn.secret.length / 2));
              let sendPassword = s;
              let receivePassword = r;

              response = {
                'auth' : true
              };
              encryption = 'aes';

              conn.sendCipher.password = s;
              conn.receiveCipher.password = r;
              conn.status = C.AUTH.AUTHENTICATED;
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
                'allRooms' : allRooms
              });
          } else if (!(data.event === undefined)){ //event defined -> socket.io stuff
            response = await handleIo({
              'data' : data,
              'C' : C,
              'allRooms' : allRooms,
              'sendToServer': sendToServer,
              'conn': conn
            });
          } else if (!(data.game === undefined)){  //game stuff
            response = await handleGame({
              'data' : data,
              'C' : C,
              'allRooms' : allRooms,
              'conn': conn,
              'sendToServer': sendToServer
            });
          } else {
            response = await handleSpecial({  //special
              'data' : data,
              'C' : C,
              'allRooms' : allRooms
            });
          }
        } catch (err) {
          console.log(err);
          console.log('WebServer to AppServer input Error!');
        }
      }

      //logging and response
      console.log("AppServer Response: ");
      console.log(response);
      response.reqNo = reqNo;
      if(S.AUTH_BYPASS) encryption = 'none';

      if(data.type === C.REQ_TYPE.DATABASE){
        dbConn.send(response, {"connection" : conn, "encryption" : encryption}, encryption);
      } else{
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
  console.log(response);
}

async function decryptResponse(response) {
  if(dbConn.encryption == 'none') {
    console.log("NO ENCRYPTION");
    return JSON.parse(response);
  } else if(dbConn.encryption == 'rsa')  {
    return JSON.parse(dbConn.receiveCipher.rsaDecrypt(response, KEYS.PRIVATE));
  } else {
    return JSON.parse(await dbConn.receiveCipher.decrypt(response));
  }
}

function runCallback(response) {
  if(pendingDatabaseResponses[response.reqNo]) {
    if(pendingDatabaseResponses[response.reqNo].callback){
      conn = pendingDatabaseResponses[response.reqNo].callback.connection;
      encryption = pendingDatabaseResponses[response.reqNo].callback.encryption;
      sendToServer(conn, response, encryption)
  }
      // pendingDatabaseResponses[response.reqNo].callback(response);
    delete pendingDatabaseResponses[response.reqNo];
  }
}

//implementing the send function on the database connection
dbConn.send = (reqObj, callback, encryption) => {
  //generating a unique id to identify the request
  let reqNo = uuid();
  reqObj.reqNo = reqNo;

  //storing the callback for later calling
  pendingDatabaseResponses[reqNo] = {};
  if(callback)
    pendingDatabaseResponses[reqNo].callback = callback;

  //sending the request object
  console.log("TO DATABASE SERVER:");
  console.log(reqObj);
  encryptAndSend(reqObj, encryption);
  return reqNo; //just in case
};

//Recieve data from database and run callback
dbConn.on('data', async function(inputData) {
  let data = await decryptResponse(inputData);
  logResponse(data);
  runCallback(data);
});

/****AUTHENTICATION******/
dbConn.encryption = 'none';
if(!S.AUTH_BYPASS) {
  dbConn.send({'publicKey' : KEYS.PUBLIC}, (response) => {
    //receiving public key of AppServer
    console.log("PUBLIC KEY RECEIVED");
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
            let s = dbConn.secret.substring(0, ~~(dbConn.secret.length / 2));
            let r =  dbConn.secret.substring(~~(dbConn.secret.length / 2));

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

                //remove all listeners, initServer will add them as needed
                dbConn.removeAllListeners('data');
                initServer();
              }
            }, 'aes');
          }, 'rsa');
        });
    }, 'rsa');
  }, 'none');
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
  } else if (encryption == 'none' || S.AUTH_BYPASS) {
    console.log("NO ENCRYPTION");
    conn.write(JSON.stringify(json));
  } else {
    conn.sendCipher.encrypt(JSON.stringify(json))
      .then((data) => {
        conn.write(data);
      });
  }
}

var handleIo = require('./server/app-handle-io.js');
var handleReq = require('./server/app-handle-req.js');
var handleGame = require('./server/app-handle-game.js')
var handleSpecial = require('./server/app-handle-special.js');
