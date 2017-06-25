/*
  Module for handling all types of errors.

  Errors can be of the socket.io type, or the normal req type,
  there's no separation of the two here, just sendErrorPage taking in an extra
  boolean argument to handle errors appropriately
*/

var response, pendingResponses, socketObj, socketOfUser, C;
module.exports = async function(input) {
  response = input.response;
  pendingResponses = input.pendingResponses;
  socketObj = input.socketObj;
  socketOfUser = input.socketOfUser;
  C = input.C;

  switch(response.err) {
    /*
      OTHER ERRORS
    */
    case C.ERR.NO_SPARE_ROOMS: {
      sendError(false, "Unable to generate unique room ID!");
      break;
    }
    case C.ERR.QUIZ_DOES_NOT_EXIST: {
      sendError(false, 'Quiz ' +response.quizId +' does not exist!');
      break;
    }
    case C.ERR.INACCESSIBLE_PRIVATE_QUIZ: {
      sendError(false, 'Quiz is a private quiz by someone else!');
      break;
    }
    case C.ERR.ROOM_DOES_NOT_EXIST: {
      console.log(response);
      sendError(false, 'Room ' +response.roomNo + ' does not exist!');
      break;
    }
    case C.ERR.ROOM_NOT_JOINABLE: {
      sendError(false, 'Room ' +response.roomNo +' is not joinable!');
      break;
    }
    case C.ERR.DUPLICATE_ID: {
      sendError(false, 'ID ' +response.id +' is already in the room!');
      break;
    }
    /*
      SOCKET_IO ERRORS
    */
    case C.ERR.ALREADY_ANSWERED: {

      break;
    }
    //ADD MORE CASES HERE
    default: {
      console.log("AppServer to WebServer ERR value is " +response.err +" not a preset case!");
    }
  }
}

function sendError(socketError, errormsg) {
  console.log("DFSYUGIHOJHGFDFGYHU");
  console.log(socketOfUser);
  console.log(response.id);
  if(socketError) {
    socketObj[socketOfUser[response.id]].emit('err', errormsg);
  } else {
    try { //res/req errors
      pendingResponses[response.resNo].render('error', {
        'error': errormsg
      });
      delete pendingResponses[response.resNo];
    } catch (err) { //socket.io
      console.log('ERROR-HANDLER: ResponseNo ' +response.resNo +' is not found!');;
    }
  }
}
