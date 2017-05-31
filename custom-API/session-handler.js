class SessionHandler {
  constructor() {
    this.dataOfRoom = {};

  }

  addRoom(room, quiz, hostSocket) {
    var rm = this.dataOfRoom[room];
    rm = {
      "quiz": quiz,
      "host": hostSocket
    }
  }

  addPlayer(socketId, groom) {
    socket.join(room);
  }

  deleteRoom(room) {
    io.sockets.clients(room).forEach(function(s){
      s.leave(room);
    });
  }
}

module.exports = SessionHandler;
