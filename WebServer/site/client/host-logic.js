"MCQ" : {
  "A" : 8,
  "B" : 4,
  "C" : 2,
  "D" : 1
},
const EVENT : {
  "INIT_ROOM": 0,
  "INIT_HOST_ROOM": 1,
  "ASSURE_HOST": 2
},
const SEND_TO : {
  "ALL": 0,
  "USER": 1,
  "ROOM_ALL": 2,
  "ROOM_EXCEPT_SENDER": 3,
  "NULL": -1
}

var socket = io();
socket.on('receive', function(input) {
  try {
    var data = JSON.parse(input);
    switch(data.event) {
      case:
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
  "event": EVENT.ASSURE_HOST
});
