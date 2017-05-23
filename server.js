/*
 * Network Security and Project - Group PANDA
 * Members: Ang Jin Kuan, Nigel Chen Chin Hao, Low Qing Ning, Bryan Tan Shao Xuan, Chloe Ang
 * Project start date: 27/4/2017 (Week 2 Thursday)
 * Current Version: pre02052017
 */

//various imports
var express = require('express');
var app = express();
var https = require('https');
var fs = require('fs');
var helmet = require('helmet');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var key = fs.readFileSync('./cert/server.key');
var cert = fs.readFileSync('./cert/server.crt');
//Gives me a way to store/get session unique data
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
//https nonsense, have yet to set it up properly
var https_options = {
    key: key,
    cert: cert
};

//setting up the server + socket.io listening
var server = https.createServer(https_options, app);
server.listen(8080);
var io = require('socket.io').listen(server);

//sends index.html when someone sends a https request
app.get('/', function(req, res){
  res.sendFile(__dirname + "/site/index.html");
});
//handling all other requests
app.get('/*', function(req, res){
  console.log('%s %s %s', req.method, req.url, req.path);
  res.sendFile(__dirname + "/site" + req.path);
});

//Various middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(expressValidator());
app.use("/", express.static(__dirname));
app.use(helmet()); //adds a bunch of security features
app.use(session);

// shared session handler
var sessionHandler = require('./custom-API/game-handler.js');
//handling form submits
app.post('/join-room', require('./server/validate-join-room.js')(sessionHandler));

require('./server/game.js')(io);

//confimation message
console.log("Listening on port 8080...");
