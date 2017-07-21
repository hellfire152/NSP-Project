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

//various imports
var express = require('express');
var app = express();
var https = require('https');
var fs = require('fs');
var net = require('net');
var crypto = require('crypto');
var cookieParser = require('cookie-parser');
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
//keeps trying every 5 seconds until it connects
var attemptConnection = setInterval(() => {
  try {
    var appConn = net.connect(9090);

    //cipher classes for 2 way encryption and decryption
    appConn.sendCipher = new Cipher({
      'password' : S.APPSERVER.PASSWORD
    });
    appConn.receiveCipher = new Cipher({
      'password' : S.APPSERVER.PASSWORD
    });

    //handling app responses
    var pendingAppResponses = {};

    var encryptAndSend;
    if(S.AUTH_BYPASS) {
      encryptAndSend = (reqObj) => {
        appConn.write(JSON.stringify(reqObj)); ;
      }
    } else {
      encryptAndSend = (reqObj, encryption) => {
        if(encryption == "rsa")  {
          appConn.write(
            appConn.sendCipher.rsaEncrypt(JSON.stringify(reqObj), appConn.publicKey) //rsa encryption
          );
        }
        else if(encryption == "none") appConn.write(JSON.stringify(reqObj));  //no encryption
        else {  //encrypt using shared key
          appConn.sendCipher.encrypt(JSON.stringify(reqObj))
            .then((data) => {
              appConn.write(data);
            });
        }
      }
    }

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
      encryptAndSend(reqObj, encryption);
      return reqNo; //just in case
    };

    function logResponse(response) {
      console.log("APPSERVER RESPONSE:");
      console.log(response);
    }

    async function decryptResponse(response) {
      if(appConn.encryption == 'none') {
        console.log("NO ENCRYPTION");
        return JSON.parse(response);
      } else if(appConn.encryption == 'rsa')  {
        return JSON.parse(appConn.receiveCipher.rsaDecrypt(response, KEYS.PRIVATE));
      } else {
        return JSON.parse(await appConn.receiveCipher.decrypt(response));
      }
    }

    function runCallback(response) {
      if(pendingAppResponses[response.reqNo]) {
        if(pendingAppResponses[response.reqNo].callback)
          pendingAppResponses[response.reqNo].callback(response);
        delete pendingAppResponses[response.reqNo];
      }
    }

    appConn.setEncoding('utf8');

    appConn.on("data", async (response) => {
      let data = await decryptResponse(response);
      logResponse(data);
      runCallback(data);
    });

    /****AUTHENTICATION******/
    appConn.encryption = 'none';
    if(!S.AUTH_BYPASS) {
      appConn.send({'publicKey' : KEYS.PUBLIC}, (response) => {
        //receiving public key of AppServer
        console.log("PUBLIC KEY RECEIVED");
        appConn.publicKey = response.publicKey;
        appConn.encryption = 'rsa';
        appConn.send({'received' : true}, (response) => {
          //receive challengeString
          console.log("RECEIVED CHALLENGE STRING");
          appConn.sendCipher.iv = response.initialIv;
          appConn.receiveCipher.iv = response.initialIv;
          appConn.receiveCipher.encrypt(response.challengeString)
            .then((challengeString) => {
              appConn.encryption = 'aes'; //response will be encrypted using aes
              appConn.send({
                'encryptedChallenge' : challengeString
              }, (response) => {
                //receive diffie-hellman stuff
                appConn.dh = crypto.createDiffieHellman(
                  response.prime, 'base64', response.generator, 'base64');
                appConn.dhKey = appConn.dh.generateKeys('base64');
                appConn.secret = appConn.dh.computeSecret(response.key, 'base64', 'base64');
                console.log("SECRET" +appConn.secret);
                let s = appConn.secret.substring(0, ~~(appConn.secret.length / 2));
                let r =  appConn.secret.substring(~~(appConn.secret.length / 2));

                //cipher change
                appConn.prependOnceListener('data', () => {
                  appConn.sendCipher.password = s;
                  appConn.receiveCipher.password = r;
                });

                //send key to AppServer
                appConn.send({'dhPublic' : appConn.dhKey}, (response) => {
                  if(response.auth) {
                    clearInterval(attemptConnection);
                    delete appConn.encryption; //no need this anymore
                    delete appConn.secret; //or this
                    delete appConn.dh //or that
                    delete appConn.dhKey //EXTERRRRMINATE

                    //remove all listeners,
                    //server-setup will add them back in with socket.io support
                    appConn.removeAllListeners('data');
                    initServer();
                  }
                }, 'aes');
              }, 'rsa');
            });
        }, 'rsa');
      }, 'none');
    } else {
      console.log("AUTHENTICATION BYPASSED");
      //remove all listeners, server-setup will add them back in with socket.io support
      appConn.removeAllListeners('data');
      initServer();
    }

    function initServer() {
      console.log("INIT SERVER");
      var key = fs.readFileSync(S.HTTPS.KEY);
      var cert = fs.readFileSync(S.HTTPS.CERT);

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
        "S" : S,
        "app": app,
        "io": io,
        "appConn": appConn,
        "express": express,
        "net": net,
        "cookieParser": cookieParser,
        "Cipher": Cipher,
        "pendingAppResponses" : pendingAppResponses,
        "decryptResponse" : decryptResponse,
        "runCallback" : runCallback,
        "logResponse" : logResponse
      });

      //start listening
      server.listen(8080);
      console.log("Listening on port 8080...");
    }
  } catch (e) { //connection fails
    console.log(e);
    console.log('Connection failed (most likely), retrying in 10 seconds...');
  }
}, 10000);
