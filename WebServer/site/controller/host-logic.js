/*
  Client side logic for hosting a room.
  Sequence of events (initialization):
    1. A socket.io-client instance is created
    2. WebServer decrypts cookieData (set via the form), forwards all the data to AppServer
    3. AppServer checks for validity, if valid, generate room no and gets quizId
    4. WebServer assigns the server-side socket a room, sends the room no here
    5. Room number is displayed!
*/

const GAMEMODE_NO_TO_STRING = {
  0: 'Classic',
  1: 'Race',
  2: 'Team Battle',
  3: 'Tug of War'
};

var S = {};

var socket = io();
socket.on('receive', function(input) {
  try {
    var response = JSON.parse(input);
    console.log(response);

    //if setId for speed later
    if(response.setId) id = response.id;

    if(response.event != undefined) {  //regualr stuff
      switch(response.event) {
        case C.EVENT_RES.GAMEMODE_CONFIRM : {
          //replaces buttons with "<gamemode>: Waiting..."
          let gameNode = document.getElementById('game');
          gameNode.innerHTML = "";
          let gamemode = document.createElement('h3');
          gamemode.appendChild(document.createTextNode(
            `${GAMEMODE_NO_TO_STRING[response.gamemode]} : Waiting...`));
          gameNode.appendChild(gamemode);

          //load gamemode's javascript
          var tag = document.createElement("script");
          switch(response.gamemode) {
            case 0: {
              tag.src = '/controller/game/host/classic.js';
              break;
            }
            case 1: {
              tag.src = '/controller/game/host/race.js';
              break;
            }
            case 2: {
              tag.src = '/controller/game/host/team-battle.js';
              break;
            }
            case 3: {
              tag.src = '/controller/game/host/tug-of-war.js'
              break;
            }
          }
          document.getElementsByTagName("head")[0].appendChild(tag);

          S = response.S;
          break;
        }
        case C.EVENT_RES.PLAYER_JOIN: {
          console.log("Player " +response.id +" has joined!");
          appendToWaitingList(response.id);
          break;
        }
        //ADD MORE CASES HERE
        default: {
          console.log("Event response value is " +response.event +"not a preset case!");
        }
      }
    } else if (response.game !== undefined) {  //special events
      handleGame(response); //delegate to the handleGame function defined in the gamemode js files
    } else {
      switch(response.special) {
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
    "room" : room
  });
}

function start(){
  //create get-ready div
  let getReadyDiv = createNode('div', 'Starting Game...!', null, 'get-ready');
  document.body.innerHTML = ""; //clear body
  document.body.appendChild(getReadyDiv);

  send({
    'game': C.GAME.START
  });
}
//convenience function for encoding the json for sending
async function encode(json) {
  return JSON.stringify(json);
}

function send(data) {
  if (data.event === undefined && data.game === undefined)
    throw new Error("Event/game type not defined!");
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

function test_next_round() {
  send({
    'game': C.GAME.NEXT_ROUND
  });
}

//disable start button
window.onload = function() {
  document.getElementById("start").disabled = true;
};
