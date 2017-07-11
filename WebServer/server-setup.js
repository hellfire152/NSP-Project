/**
  File that does most of the setup work.
  Most of the actual setting of stuff is delegated to smaller, easier to parse
  modules.
  This file does set most of the middleware used
  Author: Jin Kuan
*/

var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var helmet = require('helmet');
var uuid = require('uuid');
var cookie = require('cookie');
var ios = require('socket.io-express-session');
const C = require('../custom-API/constants.json');

var socketOfUser = {};
module.exports = function(data) {
  //extracting data
  var app = data.app;
  var io = data.io;
  var pass = data.pass;
  var appConn = data.appConn;
  var Cipher = data.Cipher;
  var express = data.express
  var net = data.net;
  var cookieParser = data.cookieParser;
  var pendingAppResponses = data.pendingAppResponses;
  const COOKIE_KEY = data.COOKIE_KEY;

  //express-session stuff
  var Session = require('express-session');
  var session = Session({
        secret: COOKIE_KEY,
        resave: true,
        saveUninitialized: true,
        cookie : {
          secure : true
        }
      });

  //enables my use of socket.handshake.session
  io.use(ios(session));

  //template engine used
  app.set('view engine', 'pug');
  //where the templates are located
  app.set('views', './site/views');

  //Various middleware
  app.use(session);
  app.use(cookieParser(COOKIE_KEY));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: false}));
  app.use(expressValidator());
  app.use("/", express.static(__dirname));
  app.use(helmet()); //adds a bunch of security features

  //setting routes
  require('./server/setup/routes.js')({
    'C' : C,
    'app' : app,
    'dirname' : __dirname,
    'Cipher' : Cipher,
    'appConn' : appConn,
    'uuid' : uuid,
    'pendingAppResponses' : pendingAppResponses
  });

  //setting up the communication between the WebServer and AppServer
  require('./server/setup/io-forward.js')({
    'C' : C,
    'dirname' : __dirname,
    'pendingAppResponses' : pendingAppResponses,
    'Cipher' : Cipher,
    'appConn' : appConn,
    'io' : io,
    'cookie' : cookie,
    'socketOfUser': socketOfUser
  });
}
