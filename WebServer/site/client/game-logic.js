/*
 * File that's included in the game screen
 * Version: pre28052017
 */
//constants for the MCQ choice
const MCQ = {
  'A' : 0b1000;
  'B' : 0b0100;
  'C' : 0b0010;
  'D' : 0b0001;
}
const EVENT = {
  'INIT_ROOM': 0
}

//initializes a socket.io connection
var socket = io();
socket.on('receive', function(input) {
  var data = JSON.parse(input);
  console.log(data);
});
socket.on('err', function(err) {
  console.log(err);
});
socket.emit('send', JSON.stringify{
  "event": EVENT.INIT_ROOM
});
