var socket = io();
socket.on('receive', function(input) {
  try {
    var data = JSON.parse(input);
    switch(data.event) {
      case: C.EVENT_RES.ROOM_READY {

        break;
      }
    }
  } catch {
    console.log("Input not a JSON!");
  }
  var data = JSON.parse(input);
  console.log(data);
});
socket.on('err', function(err) {
  console.log(err);
});
socket.emit('send', JSON.stringify{
  "event": C.EVENT.INIT_HOST_ROOM,
  "sendCookie": true,
  "quiz": 'TEST'
});
