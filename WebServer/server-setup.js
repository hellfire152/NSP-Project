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
  var appConn = data.appConn;
  var cookieReader = data.cookieReader;
  //express-session stuff
  var Session = require('express-session'),
      sessionFile = require('session-file-store')(Session);
      session = Session({
        store: new sessionFile({
          path: './tmp/sessions'
        }),
        secret: 'a very long pass phrase or something I dunno',
        resave: true,
        saveUninitialized: true,
        cookie : {
          secure : true,
          httpOnly : true
        }
      });

  //routing
  //sends index.html when someone sends a https request
  app.get('/', function(req, res){
    res.sendFile(__dirname + "/site/index.html");
  });
  //handling play path
  app.get('/play', function(req, res) {
    if(req.query.room.constructor === Array) { //if the room variable has been defined multiple times
      console.log("Well someone's trying to cause an error...");
    } else {
      let cookieData = JSON.parse(req.signedCookies.login_and_room);

    }
  });
  //handling all other requests
  app.get('/*', function(req, res){
    res.sendFile(__dirname + "/site" + req.path);
  });

  //Various middleware
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: false}));
  app.use(expressValidator());
  app.use("/", express.static(__dirname));
  app.use(helmet()); //adds a bunch of security features
  app.use(session);

  //handling form submit
  app.post('/join-room', require('./server/validate-join-room.js')(cookieReader));
  //setting up forwarding of data between user and game server
  //short hand
  var socketObj = io.sockets.sockets;
  //for authentication
  appConn.write(JSON.stringify({"password": pass}));
  //send stuff from user to game server
  io.on('connection', function(socket){
    console.log("Request received: " +socket.id);
    socket.on('send', function(input){ //from user
      try {
        var data = JSON.parse(input);
        data.socketId = socket.id; //add socketId to identify accounts etc...
        appConn.write(JSON.stringify(data)); //to game server
      } catch (err) {
        socket.emit('err', 'Not a stringified JSON Object!');
      }
    });
  });
  //from game server to user
  appConn.on('data', function(input) { //from app server
    try {
      let data = JSON.parse(input);
      switch(data.sendTo) {
        case 0: { //ALL
          io.of('/').emit('receive', JSON.stringify(data));
          break;
        }
        case 1: { //USER
          socketObj[data.targetId].emit('receive', JSON.stringify(data));
          break;
        }
        case 2: { //ROOM_ALL
          io.in(data.targetRoom).emit('receive', JSON.stringify(data));
          break;
        }
        case 3: { //ROOM_EXCEPT_SENDER
          socketObj[data.socketId].to(data.targetRoom).emit('receive', JSON.stringify(data))
          break;
        }
        default: {
          console.log('AppServer to WebServer sendTo value is ' +data.sendTo +', not a preset case');
        }
      }
    } catch (err) {
      console.log('AppServer to WebServer input not a JSON Object!');
    }
  });
}
