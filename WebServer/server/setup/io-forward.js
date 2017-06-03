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
  let dirname = data.dirname,
    pass = data.pass,
    io = data.io,
    pendingResponses = data.pendingResponses,
    cipher = data.cipher,
    appConn = data.appConn,
    cookie = data.cookie,
    socketOfUser = data.socketOfUser,
    roomOfUser = data.roomOfUser;
  //setting up forwarding of data between user and game server
  //short hand
  var socketObj = io.sockets.sockets;
  //for authentication with AppServer
  appConn.write(JSON.stringify({"password": pass}));
  //send stuff from user to game server
  io.on('connection', async function(socket){
    //get login cookie first
    try {
      let loginCookie =  await getLoginCookieS(socket, cipher, cookie);
      socketOfUser[loginCookie.id] = socket;
      socket.userId = loginCookie.id;
    } catch (err) {
      console.log(err);
      console.log("Invalid login cookie detected");
      socket.disconnect(); //invalid login cookie
    }

    //adding listeners
    console.log("Request received: " +socket.id);
    socket.on('send', async function(input){ //from user
      try {
        var data = JSON.parse(input);
        console.log("User to WebServer: ");
        console.log(data);
        if (data.sendLoginCookie) {  //Sends the cookie data as well.
          let cookieData = await getLoginCookieS(socket, cipher, cookie);
          data.cookieData = cookieData;
        }

        data.socketId = socket.id; //add socketId to identify connection later
        console.log("WebServer to AppServer Data:");
        console.log(data);
        appConn.write(JSON.stringify(data)); //to game server

      } catch (err) {
        console.log(err);
        socket.emit('err', 'User to WebServer input Not a stringified JSON Object!\n Error Data:\n');
        socket.emit('err', input);
      }
    });
    socket.on('disconnect', () => {
      console.log("Socket with id" +socket.id + " " +"and user " +socket.userId +" has disconnected.");
      delete socketOfUser[socket.userId];
    })
  });

  //from game server to user
  appConn.on('data', function(input) { //from app server
    try {
      let response = JSON.parse(input);
      console.log("AppServer Response: ");
      console.log(response);
      if(!(response.type === undefined)) { //custom type -> general website stuff
         handleOtherResponse({
          'response': response,
          'C' : C,
          'pendingResponses': pendingResponses,
          'dirname' : dirname,
          'roomOfUser': roomOfUser
        });
      } else { //no type -> socket.io stuff
        handleIoResponse({
          'response' : response,
          'io' : io,
          'C' : C,
          'socketObj' : io.sockets.sockets,
          'socketOfUser' : socketOfUser
        });
      }
      if(!(response.callback === undefined)) response.callback();
    } catch (err) {
      console.log(err);
      console.log('Error Processing AppServer to WebServer input!');
    }
  });
}

var handleIoResponse = require('./io-response.js');
var handleOtherResponse = require('./other-response.js');

//get login cookie (for socket.io)
async function getLoginCookieS(socket, cipher, cookie) {
  let cookieData = await cipher.decryptJSON((cookie.parse(socket.handshake.headers.cookie).login));
  console.log("decryptedLoginCookie");
  console.log(cookieData);
  return cookieData;
}
