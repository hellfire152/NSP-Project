/**
  Various set up funcitons that are required for the whole project to work.
  This includes communication using socket.io, GET and POST HTML requests,
  and all the stuff with the AppServer.

  Any middleware that is used is also set here.

  Author: Jin Kuan
*/

var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var helmet = require('helmet');
var uuid = require('uuid');
var pendingResponses = {};
var cookie = require('cookie');
const C = require('../custom-API/constants.json');

module.exports = function(data) {
  //extracting data
  var app = data.app;
  var io = data.io;
  var sessionHandler = data.sessionHandler;
  var pass = data.pass;
  var appConn = data.appConn;
  var cipher = data.cipher;
  var express = data.express
  var net = data.net;
  var cookieParser = data.cookieParser;
  const COOKIE_KEY = data.COOKIE_KEY;

  //express-session stuff
  var Session = require('express-session'),
      sessionFile = require('session-file-store')(Session);
      session = Session({
        store: new sessionFile({
          path: './tmp/sessions'
        }),
        secret: COOKIE_KEY,
        resave: true,
        saveUninitialized: true,
        cookie : {
          secure : true
        }
      });

    //Various middleware
  app.use(session);
  app.use(cookieParser(COOKIE_KEY));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: false}));
  app.use(expressValidator());
  app.use("/", express.static(__dirname));
  app.use(helmet()); //adds a bunch of security features

  //setting routes
  require('./server/setup/routes.js')(C, app, __dirname, cipher, appConn, uuid);

  //setting up the communication between the WebServer and AppServer
  require('./server/setup/io-forward.js')(C, __dirname, io, sessionHandler, pendingResponses, cipher, appConn);
}
