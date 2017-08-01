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
 var appServerPassword = process.argv[2];
 var settings = process.argv[3]
 if(settings === undefined || appServerPassword === undefined) {
   throw new Error("Usage: ./run-server.bat <appServerPassword> <path to settings>");
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

var S = require(settings);
S.APPSERVER.PASSWORD = appServerPassword;
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
        if(callback && {}.toString.call(callback) == '[object Function]') //IF FUNCTION
          pendingAppResponses[reqNo].callback = callback;
        else
          throw new Error('Callback is not a function!');

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
        return splitJsons(response);
      } else if(appConn.encryption == 'rsa')  {
        return splitJsons(appConn.receiveCipher.rsaDecrypt(response, KEYS.PRIVATE));
      } else {
        return splitJsons(await appConn.receiveCipher.decrypt(response));
      }
    }

    //NOTE: TEMP SOLUTION data[0] somehow did not get the first element of the array
    function runCallback(response) {
      if(pendingAppResponses[response[0].reqNo]) {
        if(pendingAppResponses[response[0].reqNo].callback)
          pendingAppResponses[response[0].reqNo].callback(response[0]);
        delete pendingAppResponses[response[0].reqNo];
      }
    }

    appConn.setEncoding('utf8');

    appConn.on("data", async (response) => {
      let data = await decryptResponse(response);
      console.log(response);
      //the authentication stage should have no problems with simultaneous responses
      logResponse(data[0]);
      runCallback(data[0]);
    });

    /****AUTHENTICATION******/
    appConn.encryption = 'none';
    if(!S.AUTH_BYPASS) {
      appConn.send({'publicKey' : KEYS.PUBLIC}, (response) => {
        clearInterval(attemptConnection);

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
                let s = appConn.sendCipher.hash(
                  appConn.sendCipher.xorString(appConn.secret, challengeString));
                let r =  appConn.sendCipher.hash(
                  appConn.sendCipher.xorString(appConn.secret, S.APPSERVER.PASSWORD));

                //cipher change
                appConn.prependOnceListener('data', () => {
                  appConn.sendCipher.password = s;
                  appConn.receiveCipher.password = r;
                });

                //send key to AppServer
                appConn.send({'dhPublic' : appConn.dhKey}, (response) => {
                  if(response.auth) {
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
      clearInterval(attemptConnection);
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
  } catch(e) {
    console.log(e);
    console.log("Retrying connection in 10 seconds...");
  }
}, 5000);

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
