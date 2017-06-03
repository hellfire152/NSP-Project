/*
*/
var socketObj;  //object mapping socketIds to socketS
var socketOfUser; //object mapping userIds to sockets
module.exports = async function(input) {
  let io = input.io;
  const C = input.C;
  let response = input.response;

  socketObj = io.sockets.sockets;
  socketOfUser = input.socketOfUser;

console.log(socketOfUser);

  if(response.validLogin) {
    if(!(response.roomEvent === undefined)) { //if AppServer wants any operations with rooms
      switch(response.roomEvent.type) {
        case C.ROOM_EVENT.JOIN : {
          socketOfUser[response.id].join(response.room); //socket joins room
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
      case C.EVENT_RES.GAMEMODE_CONFIRM : {
        clientResponse = {
          'event': response.event,
          'gamemode': response.gamemode,
          'id': response.id,
          'setId': response.setId
        };
        sendToUser(clientResponse, response.id);
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
    sendToUser(clientResponse, response.id);
  }
}

//sendTo functions to make things look nicer
function sendToAll(data) {
  io.of('/').emit('receive', encode(data));
}
function sendToUser(data, user) {
  socketOfUser[user].emit('receive', encode(data));
}
function sendToRoom(data, room) {
  io.in(room).emit('receive', encode(data));
}
function sendToRoomExceptSender(data, senderId, room) {
  socketOfUser[senderId].to(room).emit('receive', encode(data))
}

/*
  Convenience function to encode the data properly for sending
  This function exists to make future security implementations easier
*/
function encode(json) {
  return JSON.stringify(json); /*TODO::Encryption and stuff*/
}
