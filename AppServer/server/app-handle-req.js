/*
  This module includes functions related to the server requests that
  are NOT socket.io.

  All of them are handling HTTP POST requests (currectly).

  Author: Jin Kuan
*/

module.exports = async function(data, C) {
  console.log("REQ TYPE: " +data.type);
  switch(data.type) {
    case C.REQ_TYPE.JOIN_ROOM: {
      return await join_room(data, C);
      break;
    }
    case C.REQ_TYPE.HOST_ROOM: {
      return await host_room(data, C);
      break;
    }
    //ADD MORE CASES HERE
  }
}

/**
  Checks for a valid login using cookie data.
  Currently it sends the room number, although that might not be needed.
  Or it might be, I dunno.
*/
async function join_room(data, C) {
  if(/*TODO::VALID LOGIN*/true) {
    response = { //build response
      'type': C.RES_TYPE.JOIN_ROOM_RES,
      'validLogin': true, /*TODO::PROPER LOGIN*/
      'room': data.room,
      'resNo': data.resNo,
      'id': data.id
    };
    return response;
  } else {
    //INVALID LOGIN
  }
}

/**
  Function that handles the host-room form.

  The only thing this does is check the cookie for a valid login,
  socket.io will take the rest, including generating a room number.
*/
async function host_room(data, C) {
  //bulid response
  response = {
    'type': C.RES_TYPE.HOST_ROOM_RES,
    'validLogin': true,//TODO::Proper login check
    'resNo': data.resNo,
    'hostId': data.id,
  };
  return response;
}
