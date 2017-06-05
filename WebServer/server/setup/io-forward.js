/*
  This module is responsible for the most of the communication between the
  AppServer and the WebServer.

  This module will have all the code for error handling too

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
      socket.disconnect();
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

        data.id = socket.userId;  //add userId to the sent data
        data.roomNo = socket.roomNo; //add roomNo (if applicable)

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
      console.log(socket.rooms);
      console.log("Socket with id " +socket.id + " " +"and user " +socket.userId +" has disconnected.");
      delete socketOfUser[socket.userId];
      appConn.write(JSON.stringify({
        'special': C.SPECIAL.SOCKET_DISCONNECT,
        'id': socket.userId,
        'roomNo' : socket.roomNo
      }));
    });
  });

  //from game server to user
  appConn.on('data', async function(input) { //from app server
    try {
      let response = JSON.parse(input);
      console.log("AppServer Response: ");
      console.log(response);
      if(response.err) {  //if there's an error
        await errorHandler({
          'response': response,
          'C': C,
          'pendingResponses': pendingResponses,
          'roomOfUser' : roomOfUser,
          'socketObj':  io.sockets.sockets,
          'socketOfUser': socketOfUser
        });
      }
      if(!(response.type === undefined)) { //custom type -> general website stuff
         await handleOtherResponse({
          'response': response,
          'C' : C,
          'pendingResponses': pendingResponses,
          'dirname' : dirname,
          'roomOfUser': roomOfUser
        });
      } else if(response.special === undefined){ //no type -> socket.io stuff
        await handleIoResponse({
          'response' : response,
          'io' : io,
          'C' : C,
          'socketObj' : io.sockets.sockets,
          'socketOfUser' : socketOfUser
        });
      } else {  //handleSpecial
        await handleSpecialResponse({
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

//handlers for the different response types
var errorHandler = require('./error-handler.js');
var handleIoResponse = require('./io-response.js');
var handleOtherResponse = require('./other-response.js');
var handleSpecialResponse = require('./special-response.js');
var handleGameResponse = require('./game-response.js');

//get login cookie (for socket.io)
async function getLoginCookieS(socket, cipher, cookie) {
  let cookieData = await cipher.decryptJSON((cookie.parse(socket.handshake.headers.cookie).login));
  console.log("decryptedLoginCookie");
  console.log(cookieData);
  return cookieData;
}

function sendErrorPage(data) {
  try { //res/req errors
    data.pendingResponses[data.response.resNo].render('error', {
      'error': data.errormsg
    });
    delete data.pendingResponses[data.response.resNo];
  } catch (err) { //socket.io
    data.socketObj[data.response.socketId].emit('err', ""+response.id + " is already in the room!");
  }
}
