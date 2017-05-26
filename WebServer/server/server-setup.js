var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var helmet = require('helmet');
var express = require('express');
const net = require('net');

module.exports = function(data) {
  var app = data.app;
  var io = data.io;
  var sessionHandler = data.sessionHandler;
  var pass = data.pass;
  var logicServer = data.logicServer;
  var client = data.client;

  //express-session stuff
  var Session = require('express-session'),
      SessionStore = require('session-file-store')(Session),
      session = Session({
        store: new SessionStore({ path: './tmp/sessions' }),
        secret: 'a very long pass phrase or something I dunno',
        resave: true,
        saveUninitialized: true,
        cookie : {
          secure : true
        }
      });

  //routing
  //sends index.html when someone sends a https request
  app.get('/', function(req, res){
    res.sendFile(__dirname + "/site/index.html");
  });
  //handling play path
  app.get('/play', function(req, res) {

  });
  //handling all other requests
  app.get('/*', function(req, res){
    res.sendFile(__dirname + "/site" + req.path);
  });
  //handling form submits
  app.post('/join-room', require('./validate-join-room.js')(sessionHandler));

  //Various middleware
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: false}));
  app.use(expressValidator());
  app.use("/", express.static(__dirname));
  app.use(helmet()); //adds a bunch of security features
  app.use(session);

  io.on('connection', function(socket){
    console.log("Request received");
    socket.on('logic', function(password){
      if(password === pass) {
        socket.emit('Logic link established');
      } else {
        console.log("Stop trying to hack into my system");
        socket.disconnect(); //if password is wrong
      }
    });
  });

  //setting up forwarding of data between user and game server
  //for authentication
  client.write(JSON.stringify({"password": pass}));
  //send stuff from user to game server
  io.on('connection', function(socket){
    console.log("Request received");
    socket.on('send', function(data){ //from user
      data.socketId = socket.id; //add socketId to identify accounts etc...
      client.write(data); //to game server
    });
  });
  //from game server to user
  client.on('receive', function(data) {
    if(data.sendTo === "TO ONE USER") {
      io.to(data.socketId).emit('receive', data);
    } else if(data.sendTo === "TO ROOM") {
      io.of()
    } else if(data.sendTo === "TO HOST AND USER") {

    }
  });
}
