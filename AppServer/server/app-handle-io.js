/**
  This module includes functions that handle all requests related to
  socket.io.

  Author: Jin Kuan
*/
var data, C, allRooms;
module.exports = async function(input) {
  data = input.data,
  C = input.C,
  allRooms = input.allRooms;

  switch(data.event) {
    case C.EVENT.JOIN_ROOM : {
      return await join_room();
    }
    case C.EVENT.GAMEMODE_SET: {
      return (await gamemode_set());
    }
    case C.EVENT.START: {
      return await start();
    }
    default: {
      console.log("App-handle-io.js: WebServer to AppServer EVENT is " + data.event +" not a preset case!");
    }
  }
}

/*
  TODO::FINISH THIS SHIT
*/
async function join_room() {
  let r = allRooms[data.roomNo];
  if(!(r === undefined)) {  //if room exists
    if(r.joinable) {
      if(r.players.indexOf(data.id) < 0) {
        allRooms[data.roomNo].players.push(data.id); //add use to player list
      } else {
        return {
          'err': C.ERR.DUPLICATE_ID,
          'id': data.id,
        }
      }
      response = {
        'event' : C.EVENT_RES.PLAYER_JOIN,
        'validLogin' : true,
        'roomEvent' : C.ROOM_EVENT.JOIN,
        'roomNo': data.roomNo,
        'id': data.id,
        'playerList' : allRooms[data.roomNo].players
      }
      return response;
    } else {
      return {
        'err': C.ERR.ROOM_NOT_JOINABLE,
        'id': data.id,
        'roomNo': data.roomNo
      }
    }
  } else {
    return {
      'err': C.ERR.ROOM_DOES_NOT_EXIST,
      'id' : data.id,
      'roomNo': data.roomNo
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
async function gamemode_set() {
  let response = {};
  validLogin = true /*TODO::VALID LOGIN*/

  //set the data in allRooms
  allRooms[data.roomNo].gamemode = data.gamemode;
  allRooms[data.roomNo].host = data.cookieData.id;
  allRooms[data.roomNo].joinable = true;

  //build response
  response.roomEvent = C.ROOM_EVENT.JOIN; //Join the created room immediately
  response.roomNo = data.roomNo;

  response.event = C.EVENT_RES.GAMEMODE_CONFIRM;
  response.gamemode = data.gamemode;
  response.validLogin = validLogin;
  response.socketId = data.socketId;
  response.setId = true;
  response.id = data.id;
  return response;
}

async function start() {
  //shorthand
  let r = allRooms[data.roomNo];
  r.joinable = false; //room no longer can be joined

  //set a question counter
  r.questionCounter = 0;

  //get first question
  let question = r.quiz.questions[r.questionCounter];
  //build response
  return {
    'event': C.EVENT_RES.GAME_START,
    'roomNo': data.roomNo,
    'question': question,
    'gamemode': r.gamemode
  }
}
