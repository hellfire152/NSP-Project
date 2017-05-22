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
var key = fs.readFileSync('./cert/key.key');
var cert = fs.readFileSync('./cert/cert.cert');
var shortid = require('shortid');
//Gives me a way to store/get session unique data
var Session = require('express-session'),
    SessionStore = require('session-file-store')(Session),
    session = Session({
      store: new SessionStore({ path: './tmp/sessions' }),
      secret: 'a very long pass phrase or something I dunno',
      resave: true,
      saveUninitialized: true
    });
//https nonsense, have yet to set it up properly
var https_options = {
    key: key,
    cert: cert,
    requestCert: false,
    rejectUnauthorized: false,
    agent: false
};

//setting up the server + socket.io listening
var server = https.createServer(https_options, app);
server.listen(8080);
var io = require('socket.io').listen(server);

//sends main.html when someone sends a https request
app.get('/', function(req, res){
    res.sendFile(__dirname + '/main.html');
});

//I have no idea how this works, but it does
app.use("/client", express.static(__dirname + '/client'));
app.use(session);

//enables my use of socket.handshake.session
io.use(function(socket, next) {
  session(socket.handshake, {}, next);
});

//handling a new connection
io.sockets.on('connection', function(socket) {
    console.log("Request received");
    socket.handshake.session.data = {
        id: shortid.generate() //generate a random id for each connected user
    };
    io.emit('message_receive', socket.handshake.session.data['id'] + ' has connected');
    socket.on('disconnect', function(){
        console.log('user disconnected');
        io.emit('message_receive', socket.handshake.session.data['id'] +' has disconnected');
    });
    socket.on('message_send', function(message){
        io.emit('message_receive', socket.handshake.session.data['id'] +': ' +message);
    });
});
//confimation message
console.log("Listening on port 8080...");
