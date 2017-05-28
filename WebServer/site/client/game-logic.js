/*
 * File that's included in the game screen
 * Version: pre28052017
 */
//constants for the MCQ choice
const MCQ_A = 0b1000;
const MCQ_B = 0b0100;
const MCQ_C = 0b0010;
const MCQ_D = 0b0001;

//initializes a socket.io connection
var socket = io();
socket.on('receive', function(input) {
  var data = JSON.parse(input);
  console.log(data);
});
socket.on('err', function(err) {
  console.log(err);
});
socket.emit('send', JSON.stringify({
  hi : 'hi';
}));
