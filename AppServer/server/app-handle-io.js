/**
  This module handles all connections
*/
module.exports = async function(data, C, allRooms) {
  switch(data.event) {
    case C.EVENT.INIT_ROOM: {
      return await init_room(data);
      break;
    }
    case C.EVENT.INIT_HOST_ROOM: {
      return await init_host_room(data, C);
      break;
    }
  }
}

async function init_room(data) {
  console.log(data.cookieData);
  let room = data.cookieData.login_and_room.room;
  let user = data.cookieData.login_and_room.id;

  response = {

  }
}

async function init_host_room(data, C) {
  let response = {};
  validLogin = true /*TODO::VALID LOGIN*/
  if(data.quiz == 'TEST') quiz = require('../test-quiz.json'); //TODO::Get quiz from database
  roomNo = Math.floor(Math.random() * 10000000 + 1);
  let count = 0;
  while(!(allRooms[roomNo] === undefined)){ //keeps searching for an available number
    roomNo = Math.floor(Math.random() * 10000000 + 1);
    if (count > 1000) {
      response.err = C.ERR.NO_SPARE_ROOMS;
      break;
    }
  }
  if(allRooms[roomNo] === undefined) {  //if number available, add quiz data
    allRooms[roomNo] = {
      'quiz' : quiz
    }
  }
  //build response
  response.event = C.EVENT_RES.INIT_HOST_ROOM_RES;
  response.validLogin = validLogin;
  response.roomNo = roomNo;
  response.quiz = quiz;
  return response;
}
