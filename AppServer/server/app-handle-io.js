/**
  This module includes functions that handle all requests related to
  socket.io.

  Author: Jin Kuan
*/
module.exports = async function(data, C, allRooms) {
  switch(data.event) {
    case C.EVENT.INIT_ROOM: {
      return (await init_room(data));
      break;
    }
    case C.EVENT.INIT_HOST_ROOM: {
      return (await init_host_room(data, C, allRooms));
      break;
    }
  }
}

/*
  TODO::FINISH THIS SHIT
*/
async function init_room(data) {
  console.log(data.cookieData);
  let room = data.cookieData.login_and_room.room;
  let user = data.cookieData.login_and_room.id;

  response = {

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
async function init_host_room(data, C, allRooms) {
  let response = {};
  validLogin = true /*TODO::VALID LOGIN*/

  //room number stuff
  roomNo = Math.floor(Math.random() * 10000000 + 1); //generate a number between 1 and 10 million for the room id
  let count = 0;
  while(!(allRooms[roomNo] === undefined)){ //keeps searching for an available number
    roomNo = Math.floor(Math.random() * 10000000 + 1);
    if (count > 100) {
      response.err = C.ERR.NO_SPARE_ROOMS;
      return response;
    }
  }

  //get test quiz
  if(data.quiz == 'TEST') quiz = require('../../test-quiz.json'); //TODO::Get quiz from database
  else {
    response.err = C.ERR.QUIZ_DOES_NOT_EXIST;
    return response;
  }
  if(allRooms[roomNo] === undefined) {  //if number available, add quiz data
    allRooms[roomNo] = {
      'quiz' : quiz
    }
  }
  //build response
  response.roomEvent = C.ROOM_EVENT.JOIN; //Join the created room immediately
  response.room = roomNo;

  response.event = C.EVENT_RES.ROOM_READY;
  response.validLogin = validLogin;
  response.quizId = quiz.id;
  response.socketId = data.socketId;
  return response;
}
