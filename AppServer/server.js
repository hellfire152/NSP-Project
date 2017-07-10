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

var server = net.createServer(function (conn) { //WebServer will connect to this server
  conn.status = C.AUTH.REQUEST_CONNECTION;
  conn.cipher = new Cipher({
    'password' : S.WEBSERVER.PASSWORD,
    'iv' : S.WEBSERVER.INITIAL_IV
  });
  console.log("Logic: Server Start");
  // If connection is closed
  conn.on("end", function() {
    console.log('Server: Logic disconnected');
  });

  // Handle data from client
  conn.on("data", async function(input) {
    let data, encryption;
    if(conn.status != C.AUTH.AUTHENTICATED) {
      if(conn.status == C.AUTH.REQUEST_CONNECTION) {
        console.log("CONNECTION REQUESTED");
        data = JSON.parse(input);
      } else {
        console.log(conn.status);
        data = JSON.parse(conn.cipher.rsaDecrypt(input, KEYS.PRIVATE));
      }
    } else data = JSON.parse(await conn.cipher.decrypt(input));

    let reqNo = data.reqNo;
    delete data.reqNo;  //hide reqNo from logs
    console.log("FROM WEBSERVER"); //Log all data received from the WebServer
    console.log(data);
    let response = {};

    if(conn.status != C.AUTH.AUTHENTICATED) { //not authenticated yet
      encryption = 'rsa';
      /**AUTHENTICATION PROCESS**/
      switch(conn.status) {
        case C.AUTH.REQUEST_CONNECTION : { //input is public key
          try {
            //send a json, with this server's public key and the challenge
            conn.publicKey = data.publicKey;
            conn.cipher = new Cipher({
              'password' : S.WEBSERVER.PASSWORD,
              'iv' : S.WEBSERVER.INITIAL_IV
            });
            conn.challengeString = uuid();
            encryption = 'none';
            response = {
              'publicKey' : KEYS.PUBLIC
            };
            conn.status = C.AUTH.ENCRYPTED_CHALLENGE;
          } catch (e){
            console.log(e);
            conn.destroy();
          }
          break;
        }
        case C.AUTH.ENCRYPTED_CHALLENGE : { //sending the challenge string
          try {
            console.log("ENCRYPTED_CHALLENGE DATA:");
            console.log(data);
            if(conn.challengeString ==
              await conn.cipher.decrypt(rsaDecrypt(data.encryptedChallenge, KEYS.PRIVATE))) {
              //no need for the challenge string anymore...
              delete conn.challengeString;

              //generate key using diffie-hellman
              conn.dh = crypto.createDiffieHellman(S.DH_KEY_LENGTH);
              conn.dhKey = dh.generateKeys();

              response = {
                'initialIv' : S.WEBSERVER.INITIAL_IV,
                'prime' : dh.getPrime(),
                'generator' : dh.getGenerator(),
                'key' : conn.dhKey
              };

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
        }
        case C.AUTH.KEY_NEGOTIATION : { //input is the diffie-hellman public key
          try {
            let key = data.dhPublic;
            conn.secret = conn.dh.computeSecret(key).toString('base64');

            conn.cipher.password = conn.secret;
            response = {
              'auth' : true
            };

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
    sendToServer(conn, response, encryption);
  });
});

console.log("Listening on port 9090...");
server.listen(9090);

//connection with datbase server
var dbConn = net.connect(7070);

//implementing the send function on the database connection
dbConn.send = (reqObj, callback) => {
  let reqNo = uuid();
  pendingDatabaseResponses[reqNo] = callback;
  reqObj.reqNo = reqNo;
  dbConn.write(JSON.stringify(reqObj));
}

//Recieve data from database and run callback
dbConn.on('data', function(inputData) {
  data = JSON.parse(inputData);
  data.reqNo = pendingDatabaseResponses[data.reqNo];
  // pendingDatabaseResponses[data.reqNo](data);
  delete pendingDatabaseResponses[data.reqNo];
  sendToServer(connection, data);
});


//Test sample data
// sendToServer(dbConn, sampleData.updateAccount());

/*
  Function that encodes the data in a proper format and sends it to the WebServer
  This is a convenience function, so that future implementations of encryption/whatever
  will be easy to add in
*/
function sendToServer(conn, json, rsa) {
  if(rsa) {
    console.log(`WRITING ${json}`);
    conn.write(conn.cipher.rsaEncrypt(JSON.stringify(json), conn.publicKey));
  } else {
    conn.cipher.encrypt(JSON.stringify(json))
      .then((data) => {
        conn.write(data);
      });
  }
}

var handleIo = require('./server/app-handle-io.js');
var handleReq = require('./server/app-handle-req.js');
var handleGame = require('./server/app-handle-game.js')
var handleSpecial = require('./server/app-handle-special.js');
