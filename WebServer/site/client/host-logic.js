/*
  Client side logic for hosting a room.
  Sequence of events (initialization):
    1. A socket.io-client instance is created
    2. WebServer decrypts cookieData (set via the form), forwards all the data to AppServer
    3. AppServer checks for validity, if valid, generate room no and gets quizId
    4. WebServer assigns the server-side socket a room, sends the room no here
    5. Room number is displayed!
*/
//disable start button
document.getElementById('start').disabled = true;

var socket = io();
socket.on('receive', function(input) {
  try {
    var data = JSON.parse(input);
    console.log(data);

    //if setId for speed later
    if(data.setId) id = data.id;

    if(data.event != undefined) {  //regualr stuff
      switch(data.event) {
        case C.EVENT_RES.GAMEMODE_CONFIRM : {
          //replaces buttons with "<gamemode>: Waiting..."
          let gameNode = document.getElementById('game');
          gameNode.innerHTML = "";
          let gamemode = document.createElement('h3');
          gamemode.appendChild(document.createTextNode(C.GAMEMODE[data.gamemode] + ": Waiting..."));
          gameNode.appendChild(gamemode);
          break;
        }
        case C.EVENT_RES.PLAYER_JOIN: {
          console.log("Player " +data.id +" has joined!");
          appendToWaitingList(data.id);
          break;
        }
        //ADD MORE CASES HERE
        default: {
          console.log("Event response value is " +data.event +"not a preset case!");
        }
      }
    } else if (data.game != undefined) {  //special events
      handleGame(data); //delegate to the handleGame function defined in the gamemode js files
    } else {
      switch(data.special) {
        case C.SPECIAL.SOCKET_DISCONNECT: {
          let player = document.getElementById(response.id);
          player.parentNode.removeChild(player); //remove the player from waiting-list
          break;
        }
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
    "gamemode" : gamemode,
    'roomNo' : room
  });
}

function start(){
  send({
    'game': C.GAME.START
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

function appendToWaitingList(playerId) {
  //append to ul
  let waitingList = document.getElementById('waiting-list');
  console.log(playerId +" joined");
  let li = document.createElement('li');
  li.id = playerId;
  li.appendChild(document.createTextNode(playerId));
  waitingList.appendChild(li);

  //enable start button if at least one player is in the room, else disable
  if(waitingList.childNodes.length > 0) {
    document.getElementById('start').disabled = false;
  } else {
    document.getElementById('start').disabled = true;
  }
}
