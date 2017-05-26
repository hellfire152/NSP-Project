/*
 * File that's included in the game screen
 * Version: pre02052017
 */
//initializes a socket.io connection
socket.on('receive', function(input) {
  var data = JSON.parse(input);
  console.log(data);
});
