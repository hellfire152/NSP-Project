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
var pending_responses = {};
var cookie = require('cookie');
const C = require('../custom-API/constants.js');

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
      let roomNo = req.query.room;
      cipher.decryptJSON(req.cookies.login_and_room)
        .then(function(cookieData) {
          //indirect reference as I can't directly srtingify it for some reason
          let resNo = uuid();
          pending_responses[resNo] = res;
          appConn.write(JSON.stringify({ //AppServer does verification
            'type': C.REQ_TYPE.JOIN_ROOM, //JOIN_ROOM
            'id': cookieData.id,
            'pass': cookieData.pass,
            'resNo': resNo,
            'room': roomNo
          }));
        });
    }
  });
  //handling all other requests
  app.get('/*', function(req, res){
    res.sendFile(__dirname + "/site" + req.path);
  });

  //handling form submit
  app.post('/join-room', require('./server/validate-join-room.js')(cipher, appConn));


  //setting up forwarding of data between user and game server
  //short hand
  var socketObj = io.sockets.sockets;
  //for authentication with AppServer
  appConn.write(JSON.stringify({"password": pass}));
  //send stuff from user to game server
  io.on('connection', function(socket){
    //get login ID
    cipher.decryptJSON(cookie.parse(socket.handshake.headers.cookie))
      .then(function(cookieData) {
        socket.userId = cookieData.id;
        sessionHandler.addUserToRoom(socket, cookieData.room);
      });

    //adding listeners
    console.log("Request received: " +socket.id);
    socket.on('send', function(input){ //from user
      try {
        var data = JSON.parse(input);
        data.socketId = socket.id; //add socketId to identify connection later
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
      if(!(data.type === undefined)) { //custom type defined
        switch(data.type) {
          case 0: { //JOIN_ROOM_RES
            if(data.validLogin == true) {
              let res = pending_responses[data.resNo]; //get pending response
              res.sendFile(__dirname + '/site/play.html')
              delete pending_responses[data.resNo]; //remove the pending request
              //Let socket.io take the game stuff from here
            }
            break;
          }
          //ADD MORE CASES HERE
        }
      } else { //no type -> socket.io stuff
         switch(data.sendTo) {
          case C.SEND_TO.ALL: { //ALL
            io.of('/').emit('receive', JSON.stringify(data));
            break;
          }
          case C.SEND_TO.USER: {
            socketObj[data.targetId].emit('receive', JSON.stringify(data));
            break;
          }
          case C.SEND_TO.ROOM_ALL: {
            io.in(data.targetRoom).emit('receive', JSON.stringify(data));
            break;
          }
          case C.SEND_TO.ROOM_EXCEPT_SENDER: {
            socketObj[data.socketId].to(data.targetRoom).emit('receive', JSON.stringify(data))
            break;
          }
          case C.SEND_TO.NULL: {

            break;
          }
          default: {
            console.log('AppServer to WebServer sendTo value is ' +data.sendTo +', not a preset case');
          }
        }
      }
      if(!(data.callback === undefined)) data.callback();
    } catch (err) {
      console.log(err);
      console.log('Error Processing AppServer to WebServer input!');
    }
  });
}
