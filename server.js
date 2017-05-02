/* 
 * Network Security and Project - Group PANDA
 * Members: Ang Jin Kuan, Nigel Chen Chin Hao, Low Qing Ning, Bryan Tan Shao Xuan, Chloe Ang
 * Project start date: 27/4/2017 (Week 2 Thursday)
 * Current Version: pre27042017
 */
var express = require('express');
var app = express();
var https = require('https');
var fs = require('fs');
var key = fs.readFileSync('./cert/NSP-key.pem');
var cert = fs.readFileSync('./cert/NSPCert.pem');
var cookieParser = require('cookie-parser');
var shortid = require('shortid');
var Session = require('express-session'),
    SessionStore = require('session-file-store')(Session),
    session = Session({
      store: new SessionStore({ path: './tmp/sessions' }),
      secret: 'a very long pass phrase or something I dunno',
      resave: true,
      saveUninitialized: true
    });
var https_options = {
    key: key,
    cert: cert,
    requestCert: false,
    rejectUnauthorized: false,
    agent: false
};

var server = https.createServer(https_options, app);
server.listen(8080);
var io = require('socket.io').listen(server);
app.get('/', function(req, res){
    res.sendFile(__dirname + '/main.html');
});

app.use("/client", express.static(__dirname + '/client'));
app.use(cookieParser);
app.use(session);

io.use(function(socket, next) {
  session(socket.handshake, {}, next);
});

io.sockets.on('connection', function(socket) {
    console.log("Request received");
    socket.handshake.session.data = {
        id: shortid.generate()
    }
    io.emit('message_receive', socket.handshake.session.data['id'] + ' has connected');
    socket.on('disconnect', function(){
        console.log('user disconnected');
        io.emit('message_receive', socket.handshake.session.data['id'] +' has disconnected');
    });
    socket.on('message_send', function(message){
        io.emit('message_receive', socket.handshake.session.data['id'] +': ' +message);
    });
});
 
console.log("Listening on port 8080...");