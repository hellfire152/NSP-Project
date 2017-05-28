/*
 * File that's included in the game screen
 * Version: pre02052017
 */
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