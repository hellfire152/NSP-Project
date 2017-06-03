/*
  This module includes functions related to the server requests that
  are NOT socket.io.

  All of them are handling HTTP POST requests (currectly).

  Author: Jin Kuan
*/
var C, allRooms;
module.exports = async function(input) {
  data = input.data;
  C = input.C;
  allRooms = input.allRooms;

  if (data.type >= 500) { //type code greater than 500 are special
    return await handleSpecial({

    });
  }

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
  if(!(allRooms[data.roomNo] === undefined)) { //if room exists
    if(allRooms[data.roomNo].joinable) {
      //if player is not in the room
      if(allRooms[data.roomNo].players.indexOf(data.id) < 0) {
        response = { //build response
          'type': C.RES_TYPE.JOIN_ROOM_RES,
          'validLogin': true, /*TODO::PROPER LOGIN*/
          'roomNo': data.roomNo,
          'resNo': data.resNo,
          'id': data.id
        };
        return response;
      } else {  //player already in room
        return {
          'err': C.ERR.DUPLICATE_ID,
          'resNo': data.resNo,
          'id': data.id,
          'socketId': data.socketId
        }
      }
    } else {  //room not joinable
      return {
        'err': C.ERR.ROOM_NOT_JOINABLE,
        'id': data.id,
        'roomNo': data.roomNo,
        'resNo': data.resNo
      }
    }
  } else { //room does not exist
    return {
      'err' : C.ERR.ROOM_DOES_NOT_EXIST,
      'resNo': data.resNo,
      'id': data.id,
      'roomNo' : data.roomNo
    };
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
    'joinable' : false,
    'players' : [],
    'quiz' : null
  }

  //load quiz
  if(data.quizId == 'TEST') {
    allRooms[roomNo].quiz = require('../../test-quiz.json');
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

var handleSpecial = require('./app-handle-special.js');
