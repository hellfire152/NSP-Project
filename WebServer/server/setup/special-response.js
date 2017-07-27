/*
  Handles special responses from the AppServer.

  Special events are events that are unusual/disrupt the normal flow,
  but don't really warrant an error.

  Author: Jin Kuan
*/
var socketObj;  //object mapping socketIds to socketS
var socketOfUser; //object mapping userIds to sockets
var io;
module.exports = async function(input) {
  socketObj = input.socketObj;
  socketOfUser = input.socketOfUser;
  io = input.io;
  const C = input.C;
  let response = input.response;
  pendingClearGameCookie = input.pendingClearGameCookie;

  switch(response.special) {
    case C.SPECIAL.HOST_DISCONNECT: {
      //TODO::Proper host disconnect handling
      io.emit('err', "Host for " +response.roomNo +" has disconnected!");
      break;
    }
    case C.SPECIAL.SOCKET_DISCONNECT: {
      //Player disconnect
      sendToRoom({
        'special': response.special,
        'id': response.id
      }, response.roomNo);
      del=function(req,res){
        console.log("Clear cookie")
        res.clearCookie('gameCookie');
        res.redirect('/joinroom');
      }
      //TODO::Host disconnect
    }
    case C.SPECIAL.CLEAR_ALL_GAME_COOKIE : {
      for(let user of response.users) {
        pendingClearGameCookie[user] = true;
      }
    }
    case C.SPECIAL.NULL: {
      console.log('null response');
      break;
    }
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
