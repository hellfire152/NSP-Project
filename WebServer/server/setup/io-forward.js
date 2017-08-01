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
  let {dirname, io, pendingResponses, pendingAppResponses, Cipher, appConn,
    cookie, socketOfUser, roomOfUser, cookieCipher, decryptResponse, logResponse
    ,  runCallback, pendingClearGameCookie} = data;

  //setting up forwarding of data between user and game server
  //short hand
  var socketObj = io.sockets.sockets;

  //send stuff from user to game server
  io.on('connection', async function(socket){
    //get login cookie first
    socket.on('disconnect', () => {
      console.log("Socket with id " +socket.id + " " +", user " +socket.userId +" and room " +socket.roomNo +" has disconnected.");
      delete socketOfUser[socket.userId];
      pendingClearGameCookie[socket.userId] = true;
      appConn.send({
        'special': C.SPECIAL.SOCKET_DISCONNECT,
        'id': socket.userId,
        'roomNo' : socket.roomNo
      }, null);
    });

    /**CHECK MULTIPLE ON SAME MACHINE**/

    try {
      //let loginCookie = await getLoginCookieS(socket, cookieCipher, cookie);
      let id = socket.handshake.session.username;
      console.log("SOCKET IO CONNECTION INITIATED BY");
      console.log(id);
      if(socketOfUser[id] !== undefined) { //if user with that id already exists
        console.log('User with that ID already logged in!');
        socket.disconnect();
      }
      socketOfUser[id] = socket;
      socket.userId = id;
    } catch (err) {
      console.log(err);
      console.log("Invalid login cookie detected");
      socket.disconnect();
    }

    //preventing outsiders from randomly connecting
    if(!socket.handshake.session.joining && !socket.handshake.session.hosting) {
      console.log('Illegal connection!');
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
          let cookieData = await getLoginCookieS(socket, cookieCipher, cookie);
          data.cookieData = cookieData;
        }

        data.id = socket.userId;  //add userId to  the sent data
        data.roomNo = socket.roomNo; //add roomNo (if applicable)

        appConn.send(data, null);
      } catch (err) {
        console.log(err);
        socket.emit('err', 'User to WebServer input Not a stringified JSON Object!\n Error Data:\n');
        socket.emit('err', input);
      }
    });
  });

  //from AppServer to WebServer
  appConn.on('data', async function(input) { //from app server
    let response = await decryptResponse(input);
    logResponse(response);
    try {
      if(response.special !== undefined){ //handling special stuff
        await handleSpecialResponse({
          'pendingResponses' : pendingResponses,
          'response' : response,
          'io' : io,
          'C' : C,
          'socketObj' : io.sockets.sockets,
          'socketOfUser' : socketOfUser,
          'pendingClearGameCookie' : pendingClearGameCookie
        });
      } else {  //others
        if(response.sendTo !== undefined) {
          await handleIoResponse({
            'response' : response,
            'io' : io,
            'C' : C,
            'socketObj' : io.sockets.sockets,
            'socketOfUser' : socketOfUser
          });
        } else {  //others
          if(response.sendTo !== undefined) {
            await handleIoResponse({
              'response' : response,
              'io' : io,
              'C' : C,
              'socketObj' : io.sockets.sockets,
              'socketOfUser' : socketOfUser
            });
          }
          runCallback(response);
        }
      }
    }catch (err) {
      console.log(err);
      console.log('Error Processing AppServer to WebServer input!');
    }
  });
}

//handlers for the different response types
var handleIoResponse = require('./io-response.js');
var handleSpecialResponse = require('./special-response.js');

//get login cookie (for socket.io)
async function getLoginCookieS(socket, cookieCipher, cookie) {
  let cookieData = await cookieCipher.decryptJSON((cookie.parse(socket.handshake.headers.cookie).login));
  console.log("decryptedLoginCookie");
  console.log(cookieData);
  return cookieData;
}
// get game cookie (for socket.io)
async function getGameCookieS(socket,cookieCipher,cookie) {
  let cookieData = await cookieCipher.decryptJSON((cookie.parse(socket.handshake.headers.cookie).game));
  console.log("decryptedGameCookie");
  console.log(cookieData);
  return cookieData;
}
