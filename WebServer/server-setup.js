var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var helmet = require('helmet');
var express = require('express');

module.exports = function(data) {
  var app = data.app;
  var io = data.io;
  var sessionHandler = data.sessionHandler;
  var pass = data.pass;

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
  app.get('/client', function(req, res) {
    console.log("shit");
    res.sendFile(__dirname + '/client' + req.path);
  });
  //handling all other requests
  app.get('/*', function(req, res){
    res.sendFile(__dirname + "/site" + req.path);
  });
  //handling form submits
  app.post('/join-room', require('./server/validate-join-room.js')(sessionHandler));

  //Various middleware
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: false}));
  app.use(expressValidator());
  app.use("/", express.static(__dirname));
  app.use(helmet()); //adds a bunch of security features
  app.use(session);

  //setting up the io
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
}
