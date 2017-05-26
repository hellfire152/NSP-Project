/*
 * Network Security and Project - Group PANDA
 * Members: Ang Jin Kuan, Nigel Chen Chin Hao, Low Qing Ning, Bryan Tan Shao Xuan, Chloe Ang
 * Project start date: 27/4/2017 (Week 2 Thursday)
 * Current Version: pre02052017
 */
 //do not shut down on error
 process.on('uncaughtException', function (err) {
     console.log(err);
 });

//getting the password
var pass = process.argv[2];
//error on no password
if(pass === undefined || pass == "") {
  throw new Error("Usage: ./run-server.bat <password>");
}
//various imports
var express = require('express');
var app = express();
var https = require('https');
var fs = require('fs');
var helmet = require('helmet');
var expressValidator = require('express-validator');
var key = fs.readFileSync('./cert/server.key');
var cert = fs.readFileSync('./cert/server.crt');
const net = require('net');

//https nonsense, have yet to set it up properly
var https_options = {
    key: key,
    cert: cert
};

//setting up the server + socket.io listening
var server = https.createServer(https_options, app);
server.listen(8080);
var io = require('socket.io').listen(server);

//setting up another server, for connection with the logic server
var client = net.connect(9090);
// shared session handler
var sessionHandler = require('./custom-API/game-handler.js');

require("./server/server-setup.js")({
  "app": app,
  "io": io,
  "sessionHandler": sessionHandler,
  "pass": pass,
  "client": client
});

//confimation message
console.log("Listening on port 8080...");
