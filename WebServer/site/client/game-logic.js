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
socket.on('receive', function(data) {
  var response = JSON.parse(data);
  console.log(response);

  switch(response.event) {
    case C.EVENT_RES.ROOM_READY : {
      console.log('ROOM_READY: ' + data.);
      break;
    }
  }
});
socket.on('err', function(err) {
  console.log(err);
});
socket.emit('send', JSON.stringify{
  "event": EVENT.INIT_ROOM
});
