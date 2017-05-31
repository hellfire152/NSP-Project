module.exports = function(input) {
  let io = input.io;
  const C = input.C;
  let socketObj = io.sockets.sockets;
  let socket =socketObj[input.socketId];
  let data = input.data;

  if(!(data.roomEvent === undefined)) { //if AppServer wants any operations with rooms
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
  switch(data.sendTo) {
    case C.SEND_TO.ALL: { //ALL
      io.of('/').emit('receive', JSON.stringify(data));
      break;
    }
    case C.SEND_TO.USER: {
      socketObj[data.targetId].emit('receive', JSON.stringify(data));
      break;
    }
    case C.SEND_TO.ROOM_ALL: {
      io.in(data.targetRoom).emit('receive', JSON.stringify(data));
      break;
    }
    case C.SEND_TO.ROOM_EXCEPT_SENDER: {
      socket.to(data.targetRoom).emit('receive', JSON.stringify(data))
      break;
    }
    case C.SEND_TO.NULL: {
      break;
    }
    default: {
      console.log('AppServer to WebServer sendTo value is ' +data.sendTo +', not a preset case');
    }
  }
}
