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
var key = fs.readFileSync('./cert/key.key');
var cert = fs.readFileSync('./cert/cert.cert');
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
//sends main.html when someone sends a https request
app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

//I have no idea how this works, but it does
app.use("/client", express.static(__dirname + '/client'));
app.use(helmet()); //adds a bunch of security features
app.use(session);

//enables my use of socket.handshake.session
io.use(function(socket, next) {
  session(socket.handshake, {}, next);
});
require('./server/game.js')(io);

//confimation message
console.log("Listening on port 8080...");
