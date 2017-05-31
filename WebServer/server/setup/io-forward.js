module.exports = function(data) {
  const C = data.C;
  let dirname = data.dirname,
    pass = data.pass,
    io = data.io,
    pendingResponses = data.pendingResponses,
    cipher = data.cipher,
    appConn = data.appConn;
  //setting up forwarding of data between user and game server
  //short hand
  var socketObj = io.sockets.sockets;
  //for authentication with AppServer
  appConn.write(JSON.stringify({"password": pass}));
  //send stuff from user to game server
  io.on('connection', async function(socket){
    //adding listeners
    console.log("Request received: " +socket.id);
    socket.on('send', function(input){ //from user
      try {
        var data = JSON.parse(input);
        if (data.sendCookie) {  //Sends the cookie data as well.
          cipher.decryptJSON(cookie.parse(socket.handshake.headers.cookie))
            .catch(reason => {
              throw new Error(reason);
            })
            .then(function(cookieData) {
              data.cookieData = cookieData;
              data.socketId = socketId;
              console.log("WebServer to AppServer Data (COOKIE):");
              console.log(data);
              appConn.write(JSON.stringify(data));
            });
        } else {  //Not sending cookie
          console.log("WebServer to AppServer Data:");
          console.log(data);
          data.socketId = socket.id; //add socketId to identify connection later
          appConn.write(JSON.stringify(data)); //to game server
        }
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
        console.log("RES TYPE: " +data.type);
        switch(data.type) {
          case C.RES_TYPE.JOIN_ROOM_RES: {
            if(data.validLogin == true) {
              let res = pendingResponses[data.resNo]; //get pending response
              res.sendFile(dirname + '/site/play.html');
              delete pendingResponses[data.resNo]; //remove the pending request
              //Let socket.io take the game stuff from here
            }
            break;
          }
          case C.RES_TYPE.HOST_ROOM_RES: {
            if(data.validLogin == true) {
              let res = pendingResponses[data.resNo];
              res.sendFile(dirname + '/site/host2.html');
              delete pendingResponses[data.resNo];
              //socket.io will handle the rest
            }
            break;
          }
          //ADD MORE CASES HERE
        }
      } else { //no type -> socket.io stuff
        let socket = socketObj[data.socketId];
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
