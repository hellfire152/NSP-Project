var socketObj;  //object mapping socketIds to socketS
var socketOfUser; //object mapping userIds to sockets
var io;
module.exports = async function(input) {
  io = input.io;
  const C = input.C;
  let response = input.response;

  socketObj = io.sockets.sockets;
  socketOfUser = input.socketOfUser;

  switch(response.game) {
    case C.GAME_RES.BEGIN_FIRST_QUESTION: {
      console.log("CLASSIC: BEGIN FIRST QUESTION");
      sendToRoom({
        'game': C.GAME_RES.BEGIN_FIRST_QUESTION,
        'question': response.question
      }, response.roomNo);
      break;
    }
    case C.GAME_RES.ANSWER_CHOSEN: {
      console.log("ANSWER_CHOSEN");
      sendToUser({
        'game': C.GAME_RES.ANSWER_CHOSEN,
        'id': response.id,
        'answer': response.answer
      }, response.hostId);
      break;
    }
    case C.GAME_RES.ROUND_END: {
      sendToRoom({
        'game': C.GAME_RES.ROUND_END,
        'roundEndResults': response.roundEndResults,
        'answers': response.answers
      }, response.roomNo);
      break;
    }
    //ADD MORE CASES HERE
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
