/*
 * Network Security and Project - Group PANDA
 * Members: Ang Jin Kuan, Nigel Chen Chin Hao, Low Qing Ning, Bryan Tan Shao Xuan, Chloe Ang
 * Project start date: 27/4/2017 (Week 2 Thursday)
 * Current Version: pre28052017

  Author: Jin Kuan
 */
 //do not shut down on error
 process.on('uncaughtException', function (err) {
     console.log(err);
 });

//getting the password
var pass = process.argv[2];

//Shared SessionHandler
var SessionHandler = require('../custom-API/session-handler.js');
var SessionHandler = new SessionHandler();

//various imports
var express = require('express');
var app = express();
var https = require('https');
var fs = require('fs');
var net = require('net');
var cookieParser = require('cookie-parser');
var cipher = require('../custom-API/cipher.js')();
var key = fs.readFileSync('./cert/server.key');
var cert = fs.readFileSync('./cert/server.crt');
//https nonsense, have yet to set it up properly
var https_options = {
    key: key,
    cert: cert
};

//setting up the server + socket.io listening
var server = https.createServer(https_options, app);
server.listen(8080);
var io = require('socket.io').listen(server);

//connection with app server
var appConn = net.connect(9090);

// shared session handler
var SessionHandler = require('../custom-API/session-handler.js');
var sessionHandler = new SessionHandler();

//key for cookie
const COOKIE_KEY = "cookieSECREEET";
require("./server-setup.js")({
  "app": app,
  "io": io,
  "pass": pass,
  "appConn": appConn,
  "express": express,
  "net": net,
  "cookieParser": cookieParser,
  "cipher": cipher,
  "COOKIE_KEY": COOKIE_KEY,
  "sessionHandler" : sessionHandler
});

//confimation message
console.log("Listening on port 8080...");
