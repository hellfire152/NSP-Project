/*
  Logic for the player side of the quiz game.

  Sequence of events (initialization):
  1. A socket.io instance is created, sends EVENT.INIT_ROOM
  2. WebServer gets cookieData, forwards all to AppServer
  3. AppServer checks for the room number, sends a signal to say valid or notEmpty
  4. (if valid) WebServer assigns the room to the socket, forwards response,
    4.1 emits 'PLAYER_JOIN to everybody else in the room'
  5. Player receives response, joins room, emits 'PLAYER_LIST'
  6. ... ... AppServer sends the player list of the room.
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
    case C.EVENT_RES.ROOM_JOIN : {  //successful room join
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
