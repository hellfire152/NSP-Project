/*
 * Network Security and Project - Group PANDA
 * Members: Ang Jin Kuan, Nigel Chen Chin Hao, Low Qing Ning, Bryan Tan Shao Xuan, Chloe Ang
 * Project start date: 27/4/2017 (Week 2 Thursday)
 * Current Version: pre28052017

 File info:
 This file starts the WebServer, responsible for hosting the site.
 The server will delegate most processing and Database Access to the AppServer.

 The default port is 8080.

  Author: Jin Kuan
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

//Shared SessionHandler
// var SessionHandler = require('../custom-API/session-handler.js');
// var SessionHandler = new SessionHandler();

//various imports
var express = require('express');
var app = express();
var https = require('https');
var fs = require('fs');
var net = require('net');
var crypto = require('crypto');
var cookieParser = require('cookie-parser');
var key = fs.readFileSync('./cert/server.key');
var cert = fs.readFileSync('./cert/server.crt');
var uuid = require('uuid');

const S = require(settings);
const C = require(S.CONSTANTS);

var Cipher = require(S.CIPHER);

//getting the RSA keys
const KEYS = {
  'PUBLIC' : fs.readFileSync(S.KEYS.PUBLIC, "utf8"),
  'PRIVATE' : fs.readFileSync(S.KEYS.PRIVATE, "utf8")
};


//connection with app server
var appConn = net.connect(9090);

//cipher class for the connection
appConn.cipher = new Cipher({
  'password' : S.APPSERVER.PASSWORD
});

//handling app responses
var pendingAppResponses = {};
appConn.send = (reqObj, callback, encryption) => {
  //generating a unique id to identify the request
  let reqNo = uuid();
  reqObj.reqNo = reqNo;

  //storing the callback for later calling
  pendingAppResponses[reqNo] = {};
  if(callback)
    pendingAppResponses[reqNo].callback = callback;

  //sending the request object
  console.log("TO APPSERVER:");
  console.log(reqObj);
  if(encryption == "rsa")  {
    appConn.write(
      appConn.cipher.rsaEncrypt(JSON.stringify(reqObj), appConn.publicKey) //rsa encryption
    );
  }
  else if(encryption == "none") appConn.write(JSON.stringify(reqObj));  //no encryption
  else {  //encrypt using shared key
    appConn.cipher.encrypt(JSON.stringify(reqObj))
      .then((data) => {
        appConn.write(data);
      });
  }
  return reqNo; //just in case
};

function logResponse(response) {
  console.log("APPSERVER RESPONSE:");
  console.log(response);
}

async function decryptResponse(response) {
  if(appConn.encryption == 'none') {
    return JSON.parse(response);
  } else if(appConn.encryption == 'rsa')  {
    return JSON.parse(appConn.cipher.rsaDecrypt(response, KEYS.PRIVATE));
  } else {
    return JSON.parse(await appConn.cipher.decrypt(response));
  }
}

function runCallback(response) {
  console.log(typeof response);
  console.log(`RESPONSE REQ NO: ${response.reqNo}`);
  if(pendingAppResponses[response.reqNo].callback)
    pendingAppResponses[response.reqNo].callback(response);
}

appConn.setEncoding('utf8');

appConn.on("data", async (response) => {
  let data = await decryptResponse(response);
  logResponse(data);
  runCallback(data);
});

/****AUTHENTICATION******/
appConn.encryption = 'none';
appConn.send({'publicKey' : KEYS.PUBLIC}, (response) => {
  //receiving public key of AppServer
  console.log("PUBLIC KEY RECEIVED");
  appConn.publicKey = response.publicKey;
  appConn.encryption = 'rsa';
  appConn.send({'received' : true}, (response) => {
    //receive challengeString
    console.log("RECEIVED CHALLENGE STRING");
    appConn.cipher.iv = response.initialIv;
    appConn.cipher.encrypt(response.challengeString)
      .then((challengeString) => {
        appConn.encryption = 'aes'; //response will be encrypted using aes
        appConn.send({
          'encryptedChallenge' : challengeString
        }, (response) => {
          //receive diffie-hellman stuff
          appConn.dh = crypto.createECDH(response.curve);
          appConn.dhKey = appConn.dh.generateKeys();
          appConn.secret = appConn.dh.computeSecret(response.key, 'base64', 'base64');

          //cipher change
          appConn.prependOnceListener('data', () => {
            appConn.cipher.password = appConn.secret;
          });

          //send key to AppServer
          appConn.send({'dhPublic' : appConn.dh.getPublicKey('base64')}, (response) => {
            if(response.auth) {
              appConn.cipher.password = appConn.secret;
              //start the server
              delete appConn.encryption;
              initServer();
            }
          }, 'aes');

        }, 'rsa');
      });
  }, 'rsa');
}, 'none');

function initServer() {
  var key = fs.readFileSync('./cert/server.key');
  var cert = fs.readFileSync('./cert/server.crt');

  //https nonsense
  var https_options = {
    key: key,
    cert: cert
  };

  //setting up the server + socket.io listening
  var server = https.createServer(https_options, app);
  var io = require('socket.io').listen(server);

  require("./server-setup.js")({
    "C" : C,
    "app": app,
    "io": io,
    "appConn": appConn,
    "express": express,
    "net": net,
    "cookieParser": cookieParser,
    "cipher": Cipher,
    "COOKIE_KEY": S.COOKIE_KEY,
    "pendingAppResponses" : pendingAppResponses
  });

  //start listening
  server.listen(8080);
  console.log("Listening on port 8080...");
}
