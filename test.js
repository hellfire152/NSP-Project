var io = require('socket.io-client');
var socket = io.connect('https://localhost:8080');

socket.emit('logic', 'password');
console.log("Logic Server running");
