/**
  This module includes functions that handle all requests related to
  socket.io.

  Author: Jin Kuan
*/
module.exports = async function(input) {
  const C = input.C;
  switch(input.data.event) {
    case C.EVENT.JOIN_ROOM : {
      return await join_room(input);
    }
    case C.EVENT.GAMEMODE_SET: {
      return (await gamemode_set(input));
    }
    default: {
      console.log("App-handle-io.js: WebServer to AppServer EVENT is " + data.event +" not a preset case!");
    }
  }
}

/*
  TODO::FINISH THIS SHIT
*/
async function join_room(input) {
  let {data, C, allRooms, conn, sendToServer} = input;
  let r = allRooms[data.room];
  if(r !== undefined) {  //if room exists
    if(r.joinable) {
      if(r.players[data.id] === undefined) {  //if player is not in the room
        allRooms[data.room].players[data.id] = {
          'correctAnswers': 0,
          'wrongAnswers': 0,
          'score': 0,
          'answerStreak': 0
        };
        allRooms[data.room].playerCount++;
      } else {
        return {
          'err': C.ERR.DUPLICATE_ID,
          'id': data.id,
          'sendTo': C.SEND_TO.USER,
          'targetId': data.id
        }
      }
      //send the join room to everybody else in the room
      response = {
        'event' : C.EVENT_RES.PLAYER_JOIN,
        'validLogin' : true,
        'roomEvent' : C.ROOM_EVENT.JOIN,
        'sendTo': C.SEND_TO.ROOM_EXCEPT_SENDER,
        'roomNo': data.room,
        'sourceId': data.id,
        'id': data.id
      }

      //extra response for the player in question
      setTimeout(() => sendToServer(conn, {
        'event': C.EVENT_RES.PLAYER_LIST,
        'playerList': allRooms[data.room].players,
        'sendTo': C.SEND_TO.USER,
        'targetId': data.id,
        'roomEvent': C.ROOM_EVENT.JOIN,
        'roomNo': data.room,
        'id': data.id
      }), 100);

      return response;
    } else {
      return {
        'err': C.ERR.ROOM_NOT_JOINABLE,
        'id': data.id,
        'roomNo': data.room,
        'sendTo': C.SEND_TO.USER,
        'targetId': data.id
      }
    }
  } else {
    return {
      'err': C.ERR.ROOM_DOES_NOT_EXIST,
      'id' : data.id,
      'roomNo': data.room,
      'sendTo': C.SEND_TO.USER,
      'targetId': data.id
    }
  }
}

/*
  Handles host's first socket.io message.
  This function will
    1. Generate a roomNo for the host
    2. Load the quiz from the database
    3. (WebServer) Get the host to join the socket.io room

  Will throw ERR.NO_SPARE_ROOMS after 100 times of failing to find a free roomNo
*/
async function gamemode_set(input) {
  console.log(input);
  let {data, C, allRooms, conn, sendToServer} = input;
  let response = {};
  validLogin = true /*TODO::VALID LOGIN*/

  //setting data in allRooms
  allRooms[data.room].gamemode = data.gamemode;
  allRooms[data.room].host = data.id;
  allRooms[data.room].joinable = true;
  allRooms[data.room].playerCount = 0;

  //build response
  response.roomEvent = C.ROOM_EVENT.JOIN; //Join the created room immediately
  response.roomNo = data.room;

  response.event = C.EVENT_RES.GAMEMODE_CONFIRM;
  response.gamemode = data.gamemode;
  response.validLogin = validLogin;
  response.setId = true;
  response.id = data.id;

  response.sendTo = C.SEND_TO.USER;
  response.targetId = data.id;
  return response;
}
