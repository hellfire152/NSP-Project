module.exports = function(input) {
  let io = input.io;
  const C = input.C;
  let socketObj = io.sockets.sockets;
  let socket =socketObj[input.socketId];
  let response = input.data;

  if(!(response.roomEvent === undefined)) { //if AppServer wants any operations with rooms
    switch(data.roomEvent.type) {
      case C.ROOM_EVENT.JOIN : {
        socket.join(data.room);
        break;
      }
      case C.ROOM_EVENT.DELETE_ROOM : {
        io.sockets.clients(data.room).forEach(function(s){
          s.leave(data.room);
        });
      }
    }
  }
  switch(response.event) {
    case C.EVENT_RES.ROOM_READY : {
      if(validLogin == true) {
        clientResponse = {
          'event' : response.event,
          'roomNo': response.roomNo,
          'quizId': response.quizId
        }
        socketObj[response.socketId].emit('receive', JSON.stringify(clientResponse));
      }
      break;
    }
    default: {
      console.log('AppServer to WebServer EVENT_RES value is ' +data.event +', not a preset case');
    }
  }
}
