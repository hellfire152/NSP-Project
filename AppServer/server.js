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
const S = require(process.argv[2]);
const C = require(S.CONSTANTS);
var sampleData = require('../DatabaseServer/dataSample.js'); //Sample data for database testing.
var net = require('net');
var uuid = require('uuid');
var cipher = require(S.CIPHER)();
var fs = require('fs');

var allRooms = {};
var pendingDatabaseResponses = {};

//getting the RSA keys
const KEYS = {
  'PUBLIC' : fs.readFileSync(S.KEYS.PUBLIC, "utf8"),
  'PRIVATE' : fs.readFileSync(S.KEYS.PRIVATE, "utf8")
};

var server = net.createServer(function (conn) { //WebServer will connect to this server
  conn.rsaVerified = false;
  conn.status = C.AUTH.REQUEST_PUBLIC_KEY;
  console.log("Logic: Server Start");
  // If connection is closed
  conn.on("end", function() {
    console.log('Server: Logic disconnected');
  });

  // Handle data from client
  conn.on("data", async function(input) {
    if(conn.status != C.AUTH.AUTHENTICATED) { //not authenticated yet
      switch(conn.status) {
        case C.AUTH.REQUEST_CONNECTION : { //input is public key
          try {
            //send a json, with this server's public key and the challenge
            conn.publicKey = input;
            conn.cipher = require(S.CIPHER)({
              'password' : S.WEBSERVER.PASSWORD
            });
            conn.challengeString = uuid();
            conn.write(rsaEncrypt(JSON.stringify({
              'publicKey' : KEYS.PUBLIC,
              'challengeString' : conn.challengeString
            }), conn.publicKey));
            conn.status = C.AUTH.ENCRYPTED_CHALLENGE;
          } catch (e){
            console.log(e);
            conn.destroy();
          }
          break;
        }
        case C.AUTH.ENCRYPTED_CHALLENGE : {
          try {
            if(conn.challengeString ==
              conn.cipher.decrypt(rsaDecrypt(input, KEYS.PRIVATE))) {
              //generate session key from password
              conn.password = generateSessionKey(password);
              conn.cipher = require(cipher)({
                'password' : conn.password
              });
              setTimeout(() => { //regenerate session key from
                conn.password = generateSessionKey(conn.password);
                conn.cipher = require(cipher)({
                  'password' : conn.password
                });
              }, S.WEBSERVER.KEY_LIFE);

              conn.status = C.AUTH.AUTHENTICATED;
              conn.write(rsaEncrypt(C.AUTH.AUTHENTICATED, KEYS.PUBLIC));
            }
            break;
          } catch (e) {
            console.log(e);
            conn.destroy();
          }
        }
    } else {
      try {
        let data = JSON.parse(input);
        let reqNo = data.reqNo;
        delete data.reqNo;  //hide reqNo from logs
        console.log("FROM WEBSERVER"); //Log all data received from the WebServer
        console.log(data);
        //if there's an Error
        if (data.err) {
          console.log("ERROR RECEIVED, CODE: " + data.err);
          switch(data.err) {
            //handle errors
          }
        } else {
          if(conn.auth === undefined && data.password === undefined) { //not authenticated, no password
            throw new Error("WebServer unauthenticated, missing password");
          }

          let response = {};
          if(conn.auth) { //if already authenticaed
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
            //logging and response
            console.log("AppServer Response: ");
            console.log(response);
            response.reqNo = reqNo;
            //FOR TESTING DATABASE ONLY
            if(data.type === C.REQ_TYPE.DATABASE){
              dbConn.send(response, response.reqNo);
            } else{
              sendToServer(conn, response);
            }

          } else if(data.password === pass) { //valid password
            console.log("WebServer Validated");
            conn.auth = true;
          } else { //data sent without authorization
            conn.destroy(); //destroy connection
          }
        }
      } catch (err) {
        console.log(err);
        console.log('WebServer to AppServer input Error!');
      }
    }
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
async function sendToServer(conn, json) {
  conn.write(JSON.stringify(json));
}

var handleIo = require('./server/app-handle-io.js');
var handleReq = require('./server/app-handle-req.js');
var handleGame = require('./server/app-handle-game.js')
var handleSpecial = require('./server/app-handle-special.js');


function encode(obj, cipher) {
  try {
    cipher.encrypt(JSON.stringify(obj));
  } catch (e) {
    console.log(e);
    return null;
  }
}
