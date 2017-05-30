module.exports = function(C, dirname, io, sessionHandler, pendingResponses, cipher, appConn) {
  //setting up forwarding of data between user and game server
  //short hand
  var socketObj = io.sockets.sockets;
  //for authentication with AppServer
  appConn.write(JSON.stringify({"password": pass}));
  //send stuff from user to game server
  io.on('connection', function(socket){
    //get login ID
    cipher.decryptJSON(cookie.parse(socket.handshake.headers.cookie))
      .then(function(cookieData) {
        socket.userId = cookieData.id;
        sessionHandler.addUserToRoom(socket, cookieData.room);
      });

    //adding listeners
    console.log("Request received: " +socket.id);
    socket.on('send', function(input){ //from user
      try {
        var data = JSON.parse(input);
        data.socketId = socket.id; //add socketId to identify connection later
        appConn.write(JSON.stringify(data)); //to game server
      } catch (err) {
        socket.emit('err', 'Not a stringified JSON Object!');
      }
    });
  });

  //from game server to user
  appConn.on('data', function(input) { //from app server
    try {
      let data = JSON.parse(input);
      if(!(data.type === undefined)) { //custom type defined
        switch(data.type) {
          case C.RES_TYPE.JOIN_ROOM_RES: {
            if(data.validLogin == true) {
              let res = pendingResponses[data.resNo]; //get pending response
              res.sendFile(dirname + '/site/play.html')
              delete pendingResponses[data.resNo]; //remove the pending request
              //Let socket.io take the game stuff from here
            }
            break;
          }
          //ADD MORE CASES HERE
        }
      } else { //no type -> socket.io stuff
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
            socketObj[data.socketId].to(data.targetRoom).emit('receive', JSON.stringify(data))
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
      if(!(data.callback === undefined)) data.callback();
    } catch (err) {
      console.log(err);
      console.log('Error Processing AppServer to WebServer input!');
    }
  });
}
