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
 *
*/
//initializes a socket.io connection
var socket = io();
socket.on('receive', function(data) {
  var response = JSON.parse(data);
  console.log(response);
  if(response.special === undefined) {
    switch(response.event) {
      case C.EVENT_RES.PLAYER_LIST: {
        Object.keys(response.playerList).forEach(playerId => {
          //generate a new li for each player
          appendToWaitingList(playerId);
        });
        break;
      }
      case C.EVENT_RES.PLAYER_JOIN: {
        //create a new text node for the player
        appendToWaitingList(response.id);
        break;
      }

    }
  } else {
    switch(response.special) {
      case C.SPECIAL.SOCKET_DISCONNECT: {
        let player = document.getElementById(response.id);
        player.parentNode.removeChild(player); //remove the player from waiting-list
      }
    }
  }
});
socket.on('err', function(err) {
  console.log(err);
}

send({
  'event': C.EVENT.JOIN_ROOM,
  'roomNo' : room
});

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
  let li = document.createElement('li');
  li.id = playerId;
  li.appendChild(document.createTextNode(playerId));
  document.getElementById('waiting-list')
    .appendChild(li);
}
