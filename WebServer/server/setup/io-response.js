/*
*/
var socketObj;
//temp until I do session handler
var socketOfUser = {};
module.exports = function(input) {
  let io = input.io;
  const C = input.C;
  let response = input.response;

  socketObj = io.sockets.sockets;

  if(response.validLogin) {
    if(!(response.roomEvent === undefined)) { //if AppServer wants any operations with rooms
      switch(response.roomEvent.type) {
        case C.ROOM_EVENT.JOIN : {
          socket.join(response.room); //socket joins room
          socketOfUser[response.id] = socket; //assign socket to userId
          break;
        }
        case C.ROOM_EVENT.DELETE_ROOM : {
          io.sockets.clients(response.room).forEach(function(s){
            s.leave(response.room); //remove all clients in the room
          });
        }
      }
    }
    switch(response.event) {
      case C.EVENT_RES.ROOM_READY : {
        clientResponse = {
          'event' : response.event,
          'room': response.room,
          'quizId': response.quizId
        };
        sendToUser(clientResponse, response.socketId);
        break;
      }
      default: {
        console.log('AppServer to WebServer EVENT_RES value is ' +response.event +', not a preset case');
      }
    }
  } else {  //INVALID login
    clientResponse = {
      'err' : C.ERR.INVALID_LOGIN
    }
    sendToUser(clientResponse, response.socketId);
  }
}

//sendTo functions to make things look nicer
function sendToAll(data) {
  io.of('/').emit('receive', encode(data));
}
function sendToUser(data, socketId) {
  socketObj[socketId].emit('receive', encode(data));
}
function sendToRoom(data, room) {
  io.in(room).emit('receive', encode(data));
}
function sendToRoomExceptSender(data, senderId, room) {
  socketObj[senderId].to(room).emit('receive', encode(data))
}

/*
  Convenience function to encode the data properly for sending
  This function exists to make future security implementations easier
*/
function encode(json) {
  return JSON.stringify(json); /*TODO::Encryption and stuff*/
}
