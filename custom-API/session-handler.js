const C = require('./constants.json');
class SessionHandler {
  constructor() {
    this.dataOfRoom = {};
    this.loggedInUsers = {};
  }

  userLogin(username, ip, port) {
    let user = this.loggedInUsers[username];
    if(user === undefined) user = {
      'conn' : {
        'ip': ip,
        'port' : port
      }
    } else {
      if(user.conn.ip !== ip || port !== user.conn.port) {
        return C.ERR.DIFFERENT_DEVICE_LOGIN;
    }
  }

  addRoom(room, quizId, hostSocket) {
    var rm = this.dataOfRoom[room];
    rm = {
      "quiz": quizId,
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
