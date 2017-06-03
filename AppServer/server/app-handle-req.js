/*
  This module includes functions related to the server requests that
  are NOT socket.io.

  All of them are handling HTTP POST requests (currectly).

  Author: Jin Kuan
*/
var C, allRooms, loadedQuizzes;
module.exports = async function(input) {
  data = input.data;
  C = input.C;
  allRooms = input.allRooms;
  loadedQuizzes = input.loadedQuizzes;

  console.log("REQ TYPE: " +data.type);
  switch(data.type) {
    case C.REQ_TYPE.JOIN_ROOM: {
      return await join_room(data);
      break;
    }
    case C.REQ_TYPE.HOST_ROOM: {
      return await host_room(data);
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
async function join_room(data) {
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
async function host_room(data) {
  response =  {};
  validLogin = true /*TODO::Proper login check*/

  //generate a room number
  roomNo = Math.floor(Math.random() * 10000000 + 1); //generate a number between 1 and 10 million for the room id
  let count = 0;
  while(!(allRooms[roomNo] === undefined)){ //keeps searching for an available number
    roomNo = Math.floor(Math.random() * 10000000 + 1);
    console.log("app-handle-io.js: REGENERATED ROOM, NUMBER: " +roomNo);
    if (count > 100) {
      response.err = C.ERR.NO_SPARE_ROOMS;
      return response;
    }
  }

  //setting the data in allRooms
  allRooms[roomNo] = {
    'host': data.id,
    'joinable' : true,
    'players' : []
  }

  //load quiz
  if(data.quizId == 'TEST') {
    loadedQuizzes[roomNo] = require('../../test-quiz.json');
  } //TODO::Get quiz from database
  else {
    response.err = C.ERR.QUIZ_DOES_NOT_EXIST;
    return response;
  }

  //bulid response
  response = {
    'type': C.RES_TYPE.HOST_ROOM_RES,
    'validLogin': true,//TODO::Proper login check
    'resNo': data.resNo,
    'hostId': data.id,
    'quizId' : data.quizId,
    'roomNo' : roomNo
  };
  return response;
}
