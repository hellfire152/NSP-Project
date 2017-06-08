/*
  This module handles all special requests
  Special requests are usually ones that disrupt the normal flow
  of whatever stuff is happening, but not enough to warrant an error.

  It could also be communications between only the AppServer and WebServer,
  or ones that take more work than usual...

  Just anything weird, really.

  Author: Jin Kuan
*/
var data, C, allRooms;
module.exports = async function(input) {
  data = input.data;
  C = input.C;
  allRooms = input.allRooms;
  console.log(allRooms);
  switch(data.special) {
    case C.SPECIAL.SOCKET_DISCONNECT: {
      return await socket_disconnect(data);
    }
    //ADD MORE CASES HERE
    default: {
      console.log("Special event value is " +data.special +" not a preset case!");
    }
  }
}

/*
  function that handles what happens when a player disconnects.
  What this does is:
    1. Check to see if the disconnected user is the host or not
      IF HOST
        -> Send SPECIAL.HOST_DISCONNECT
      ELSE
        -> Send SOCKET_DISCONNECT
    2. Remove the player from the associated room's playerList (if applicable)
*/
async function socket_disconnect(data) {
  let r = allRooms[data.roomNo];
  if(r.host == data.id) { //host disconnect
    response = {
      'special': C.SPECIAL.HOST_DISCONNECT,
      'roomNo': data.roomNo
    }
  } else {  //player disconnect
    console.log("PLAYER_DISCONNECT");
    //remove player from playerList
    delete r.players[data.id];

    return {
      'special': C.SPECIAL.SOCKET_DISCONNECT,
      'id': data.id,
      'roomNo': data.roomNo
    }
  }
}
