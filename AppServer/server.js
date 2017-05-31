/**
  Application Server for the Project.
  This server handles all processing of data, this data is sent from
  the WebServer, and may or may not be from socket.io
  Socket.io requests have data.type undefined.

  This should be the only server that accesses the database.
  That means the WebServer will not make any direct database queries.

  Author: Jin Kuan
  Version: pre28052017
*/ 
//do not shut down on error
process.on('uncaughtException', function (err) {
    console.log(err);
});

const C = require('../custom-API/constants.json');

//password
var pass = process.argv[2];
if(pass === undefined) {
  throw new Error("Usage: ./run-server.bat <password>");
  process.exit(1);
}

var net = require('net');

//setting up of the logic server
var server = net.createServer(function (conn) {
  console.log("Logic: Server Start");

  // If connection is closed
  conn.on("end", function() {
      console.log('Server: Logic disconnected');
      // Close the server
      server.close();
      // End the process
      process.exit(0);
  });

  // Handle data from client
  conn.on("data", function(input) {
    try {
      let data = JSON.parse(input);
      console.log("FROM WEBSERVER");
      console.log(data);
      let response = {};
      if(conn.auth === undefined && data.password === undefined) { //not authenticated, no password
        throw new Error("Missing password");
      }
      if(conn.auth) { //if already authenticaed
        if(!(data.type === undefined)) { //data type defined
          console.log("REQ TYPE: " +data.type);
          switch(data.type) {
            case C.REQ_TYPE.JOIN_ROOM: {
              if(/*TODO::VALID LOGIN*/true) {
                response.type = C.RES_TYPE.JOIN_ROOM_RES;
                response.validLogin = true;
                response.room = data.room;
                response.resNo = data.resNo;
                response.id = data.id;
                break;
              } else {
                //INVALID LOGIN
              }
            }
            case C.REQ_TYPE.HOST_ROOM: {
              console.log("HOST_ROOM_REQ");
              response = {
                'type': C.RES_TYPE.HOST_ROOM_RES,
                'validLogin': true,//TODO::Proper login check
                'room': data.room,
                'resNo': data.resNo,
                'hostId': data.id,
                'quiz': (data.quiz == 'TEST')? require('../test-quiz.json'): null
              };
              break;
            }
            //ADD MORE CASES HERE
          }
        } else { //no data type -> socket.io stuff
          switch(data.event) {
            case C.EVENT.INIT_ROOM: {
              console.log(data.cookieData);
              let room = data.cookieData.login_and_room.room;
              let user = data.cookieData.login_and_room.id;
              if(dataOfRoom[room].players === undefined) {
                dataOfRoom[room].players = [];
              }
              dataOfRoom[room].players.push(data.socketId);

              response = {

              }
              break;
            }
            case C.EVENT.INIT_HOST_ROOM: {

              break;
            }
          }
        }
        console.log("AppServer Response: ");
        console.log(response);
        conn.write(JSON.stringify(response));
      } else if(data.password === pass) { //valid password
        console.log("WebServer Validated");
        conn.auth = true;
      } else { //data sent without authorization
        conn.destroy(); //destroy connection
      }
    } catch (err) {
      console.log(err);
      console.log('WebServer to AppServer input Error!');
    }
  });
});
  console.log("Listening on port 9090...");
  server.listen(9090);
