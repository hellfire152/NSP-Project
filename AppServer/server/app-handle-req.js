/*
  This module includes functions related to the server requests that
  are NOT socket.io.

  All of them are handling HTTP POST requests (currectly).

  Author: Jin Kuan
*/
var C, allRooms, createQuiz;
module.exports = async function(input) {
  data = input.data;
  C = input.C;
  descrption = input.description;
  allRooms = input.allRooms;
  createQuiz = input.createQuiz;

  console.log("REQ TYPE: " +data.type);
  switch(data.type) {
    case C.REQ_TYPE.JOIN_ROOM: {
      console.log("ALL ROOMS: ");
      console.log(allRooms);
      return (await join_room(data));
      break;
    }
    case C.REQ_TYPE.HOST_ROOM: {
      return (await host_room(data));
      break;
    }
    case C.DB.CREATE.QUIZ: {
      console.log("CREATING A QUIZ: ")
      return (await create_quiz(data));
      break;
    }
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
      if(allRooms[data.roomNo].players[data.id] === undefined) {
        response = { //build response
          'type': C.RES_TYPE.JOIN_ROOM_RES,
          'validLogin': true, /*TODO::PROPER LOGIN*/
          'roomNo': data.roomNo,
          'resNo': data.resNo,
          'id': data.id,
          'gamemode': allRooms[data.roomNo].gamemode
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
  let roomNo = Math.floor(Math.random() * 899999999 + 100000000); //generate a number between 1 and 10 million for the room id
  let count = 0;
  while(!(allRooms[roomNo] === undefined)){ //keeps searching for an available number
    roomNo = Math.floor(Math.random() * 899999999 + 100000000);
    console.log("app-handle-io.js: REGENERATED ROOM, NUMBER: " +roomNo);
    if (count > 100) {
      return {
        'err': C.ERR.NO_SPARE_ROOMS,
        'id': data.id
      }
    }
  }

  let quiz;
  //load quiz
  if(data.quizId == 'TEST') {
    quiz = require('../../test-quiz.json');
    if(quiz.public == false && data.id !== quiz.author) {
      return {
        'err': C.ERR.INACCESSIBLE_PRIVATE_QUIZ,
        'quizId': data.quizId
      }
    }
  } //TODO::Get quiz from database
  else {
    return {
      'err': C.ERR.QUIZ_DOES_NOT_EXIST,
      'id': data.id,
      'quizId': data.quizId
    }
  }

  async function create_quiz(data) {
    response =  {};
    validLogin = true /*TODO::Proper login check*/
     if(!(createQuiz[data.name] === undefined)) {
        if(createQuiz[data.name].players[data.id] === undefined) {
          response = { //build response
            'type': C.DB.CREATE.QUIZ,
            'name': data.name,
            'description': data.description
          };
          return response;
    }     else {  // no game created
          return {
            'err': C.ERR.NO_GAME_CREATED,
            'name': data.name,
            'description': data.description
            // 'resNo': data.resNo,
            // 'id': data.id,
            // 'socketId': data.socketId
          };
        }
      }
      }


  //add data to allRooms
  allRooms[roomNo] = {
    'host': data.id,
    'players': {},
    'quiz': quiz
  };

  //build response
  response = {
    'type': C.RES_TYPE.HOST_ROOM_RES,
    'validLogin': true,//TODO::Proper login check
    'resNo': data.resNo,
    'hostId': data.id,
    'quizId' : quiz.id,
    'roomNo' : roomNo
  };
  return response;
}



var handleSpecial = require('./app-handle-special.js');
