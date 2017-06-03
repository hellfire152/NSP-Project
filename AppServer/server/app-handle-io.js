/**
  This module includes functions that handle all requests related to
  socket.io.

  Author: Jin Kuan
*/
var data, C, allRooms, loadedQuizzes;
module.exports = async function(input) {
  data = input.data,
  C = input.C,
  allRooms = input.allRooms,
  loadedQuizzes = input.loadedQuizzes;

  switch(data.event) {
    case C.EVENT.GAMEMODE_SET: {
      return (await gamemode_set(data));
      break;
    }
    default: {
      console.log("App-handle-io.js: WebServer to AppServer EVENT is " + data.event +" not a preset case!");
    }
  }
}

/*
  TODO::FINISH THIS SHIT
*/
async function join_room(data) {
  let room = data.cookieData.login.room;
  let user = data.cookieData.login.id;

  response = {
    'event' : C.GAMEMODE.CLASSIC,
    'user' : user,

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
  allRooms[data.room].gamemode = data.gamemode;

  //build response
  response.roomEvent = C.ROOM_EVENT.JOIN; //Join the created room immediately
  response.room = data.room;

  response.event = C.EVENT_RES.GAMEMODE_CONFIRM;
  response.gamemode = data.gamemode;
  response.validLogin = validLogin;
  response.quizId = data.quizId;
  response.socketId = data.socketId;
  response.setId = true;
  response.id = data.cookieData.id;
  return response;
}
