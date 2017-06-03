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

    //if setId for speed later
    if(data.setId) id = data.id;

    switch(data.event) {
      case C.EVENT_RES.GAMEMODE_CONFIRM : {
        let gameNode = document.getElementById('game');
        gameNode.innerHTML = "";
        let gamemode = document.createElement('h3');
        gamemode.appendChild(document.createTextNode(C.GAMEMODE[data.gamemode] + ": Waiting..."));
        gameNode.appendChild(gamemode)
      }
      //ADD MORE CASES HERE
      default: {
        console.log("Event response value is " +data.event +"not a preset case!");
      }
    }
  } catch (err) {
    console.log("Input not a JSON!");
    console.log(err);
  }
});
socket.on('err', function(err) {
  console.log(err);
});

function gameRoom(gamemode) {
  send({
    "event" : C.EVENT.GAMEMODE_SET,
    "sendLoginCookie" : true,
    "gamemode" : gamemode
  });
}

//convenience function for encoding the json for sending
async function encode(json) {
  return JSON.stringify(json);
}

function send(data) {
  if (data.event === undefined) throw new Error("Event not defined!");
  encode(data)
    .then(encodedData => {
      socket.emit('send', encodedData);
    });
}
