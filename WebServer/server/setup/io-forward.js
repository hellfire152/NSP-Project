/*
  This module is responsible for the most of the communication between the
  AppServer and the WebServer.

  This breaks down into 3 things:
    1. forwarding of user socket.io requests to the AppServer
    2. Handling all data from the AppServer, including
      2.a Socket.io requests (via io-response.js)
      2.b Other responses (via other-response.js)
*/
module.exports = function(data) {
  //extracting data...
  const C = data.C;
  var dirname = data.dirname,
    pass = data.pass,
    io = data.io,
    pendingResponses = data.pendingResponses,
    cipher = data.cipher,
    appConn = data.appConn,
    cookie = data.cookie

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
        console.log("User to WebServer: ");
        console.log(data);
        if (data.sendCookie) {  //Sends the cookie data as well.
          cipher.decryptJSON((cookie.parse(socket.handshake.headers.cookie).hosting_room))
            .catch(reason => {
              throw new Error(reason);
            })
            .then(function(cookieData) {
              console.log(cookieData);
              data.cookieData = cookieData;
              data.socketId = socket.id;
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
        console.log(err);
        socket.emit('err', 'User to WebServer input Not a stringified JSON Object!\n Error Data:\n');
        socket.emit('err', input);
      }
    });
  });

  //from game server to user
  appConn.on('data', function(input) { //from app server
    try {
      let data = JSON.parse(input);
      console.log("AppServer Response: ");
      console.log(data);
      if(!(data.type === undefined)) { //custom type -> general website stuff
         handleOtherResponse({
          'response': data,
          'C' : C,
          'pendingResponses': pendingResponses,
          'dirname' : dirname
        });
      } else { //no type -> socket.io stuff
        handleIoResponse({
          'response' : data,
          'io' : io,
          'C' : C,
          'socketObj' : io.sockets.sockets
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
var handleOtherResponse = require('./other-response.js');
