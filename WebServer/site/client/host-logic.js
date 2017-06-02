/*
  Client side logic for hosting a room.
  Sequence of events (initialization):
    1. A socket.io-client instance is created
    2. WebServer decrypts cookieData (set via the form), forwards all the data to AppServer
    3. AppServer checks for validity, if valid, generate room no and gets quizId
    4. WebServer assigns the server-side socket a room, sends the room no here
    5. Room number is displayed!
*/
var socket = io();
socket.on('receive', function(input) {
  try {
    var data = JSON.parse(input);
    console.log(data);
    switch(data.event) {
      case C.EVENT_RES.ROOM_READY : {
        document.getElementById('game').innerHTML =
          "<h1>Room Number: " + data.room;
        break;
      }
    }
  } catch (err) {
    console.log("Input not a JSON!");
    console.log(err);
  }
  var data = JSON.parse(input);
  console.log(data);
});
socket.on('err', function(err) {
  console.log(err);
});
socket.emit('send', JSON.stringify({
  "event": C.EVENT.INIT_HOST_ROOM,
  "sendCookie": true,
  "quiz": 'TEST'
}));
