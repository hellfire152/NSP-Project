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
      if(!(data.type === undefined)) { //custom type -> general website stuff
         await handleOtherResponse({
          'response': data,
          'C' : C,
          'pendingResponses': pendingResponses,
          'dirname' : dirname
        });
      } else { //no type -> socket.io stuff
        await handleIoResponse({
          'response' : data,
          'io' : io,
          'C' : C
        });
      }
      if(!(data.callback === undefined)) data.callback();
    } catch (err) {
      console.log(err);
      console.log('Error Processing AppServer to WebServer input!');
    }
  });
}

var handleIoResponse = require('./io-response.js');
