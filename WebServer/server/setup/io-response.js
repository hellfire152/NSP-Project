/*
*/
var socketObj;  //object mapping socketIds to socketS
var socketOfUser; //object mapping userIds to sockets
var io;
module.exports = async function(input) {
  io = input.io;
  const C = input.C;
  let response = input.response;

  socketObj = io.sockets.sockets;
  socketOfUser = input.socketOfUser;

  if(response.sendTo === undefined) throw new Error('sendTo value must be defined!');

  if(response.validLogin || !response.validating) {
    console.log("IO RESPONSE HANDLER");
    if(!(response.roomEvent === undefined)) { //if AppServer wants any operations with rooms
      switch(response.roomEvent) {
        case C.ROOM_EVENT.JOIN : {
          console.log("ROOM JOIN RESPONSE ID: " +response.id);
          try {
            if(socketOfUser[response.id].roomNo === undefined) {  //no not already in room
              socketOfUser[response.id].join(response.roomNo); //socket joins room
              socketOfUser[response.id].roomNo = response.roomNo; //include roomNo in the socketObj
              delete response.roomEvent;
            } else {  //socket already in room, not supposed to happen
              socketOfUser[response.id].emit('err', "Already in a room!");
            }
          } catch(err) {
            console.log("ROOM EVENT ERROR: ");
            console.log(err);
            console.log(response.id);
            console.log(socketOfUser[response.id]);
          }
          break;
        }
        case C.ROOM_EVENT.DELETE_ROOM : {
          io.sockets.clients(response.room).forEach(function(s){
            s.leave(response.room); //remove all clients in the room
          });
        }
      }
    }
    let sendTo = response.sendTo;
    delete response.sendTo
    switch(sendTo) {
      case C.SEND_TO.ALL: {
        sendToAll(response);
        break;
      }
      case C.SEND_TO.USER: {
        let t = response.targetId;
        console.log('SENDING TO USER: ' +response.targetId);
        delete response.targetId;
        sendToUser(response, t);
        break;
      }
      case C.SEND_TO.ROOM: {
        let r = response.roomNo;
        delete response.roomNo;
        sendToRoom(response, r);
        break;
      }
      case C.SEND_TO.ROOM_EXCEPT_SENDER: {
        let s = response.sourceId;
        delete response.sourceId;
        sendToRoomExceptSender(response, s, response.roomNo);
        break;
      }
      default: {
        console.log("AppServer to WebServer sendTo value is " +response.sendTo +" not a preset case!");
      }
    }
  } else {  //INVALID login
    clientResponse = {
      'err' : C.ERR.INVALID_LOGIN
    };
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
