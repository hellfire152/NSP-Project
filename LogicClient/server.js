var pass = process.argv[2];

var io = require('socket.io-client');
var socket = io.connect('https://localhost:8080');

socket.emit('logic', pass);
console.log("Logic Server running");
