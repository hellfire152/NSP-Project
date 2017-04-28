/* 
 * Network Security and Project - Group PANDA
 * Members: Ang Jin Kuan, Nigel Chen Chin Hao, Low Qing Ning, Bryan Tan Shao Xuan, Chloe Ang
 * Project start date: 27/4/2017 (Week 2 Thursday)
 * Current Version: pre27042017
 */
var express = require('express');
var app = express();
var http = require('http').Server(app);
var  io = require('socket.io')(http);

app.get('/', function(req, res){
    res.sendFile(__dirname + '/main.html');
});

app.use("/client", express.static(__dirname + '/client'));

io.on('connection', function(socket) {
    console.log("Request received");
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
    socket.on('message_send', function(message){
        console.log(message);
        socket.broadcast.emit('message_receive', message);
    });
});

http.listen(8080, function(){
    console.log('Listening on 8080...');
});