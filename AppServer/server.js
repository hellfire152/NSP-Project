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

//Check for password's existence
var pass = process.argv[2];
if(pass === undefined) {
  throw new Error("Usage: ./run-server.bat <password>");
  process.exit(1);
}

var net = require('net');

var allRooms = {};

//setting up of the logic server
var connection;
var server = net.createServer(function (conn) {
  console.log("Logic: Server Start");
  connection = conn;
  // If connection is closed
  conn.on("end", function() {
      console.log('Server: Logic disconnected');
      // Close the server
      server.close();
      // End the process
      process.exit(0);
  });

  // Handle data from client
  conn.on("data", async function(input) {
    try {
      let data = JSON.parse(input);
      console.log("FROM WEBSERVER"); //Log all data received from the WebServer
      console.log(data);

      //if there's an Error
      if (data.err) {
        console.log("ERROR RECEIVED, CODE: " + data.err);
        switch(data.err) {
          //handle errors
        }
      } else {
        if(conn.auth === undefined && data.password === undefined) { //not authenticated, no password
          throw new Error("WebServer unauthenticated, missing password");
        }

        let response = {};
        if(conn.auth) { //if already authenticaed
          if(!(data.type === undefined)) { //data type defined
            response = await handleReq({
              'data' : data,
              'C' : C,
              'allRooms' : allRooms
            });
          } else if (!(data.event === undefined)){ //event defined -> socket.io stuff
            response = await handleIo({
              'data' : data,
              'C' : C,
              'allRooms' : allRooms,
              'sendToServer': sendToServer,
              'conn': connection
            });
          } else if (!(data.game === undefined)){  //special
            response = await handleGame({
              'data' : data,
              'C' : C,
              'allRooms' : allRooms,
              'conn': connection,
              'sendToServer': sendToServer
            });
          } else {
            response = await handleSpecial({  //special
              'data' : data,
              'C' : C,
              'allRooms' : allRooms
            });
          }

          //logging and response
          console.log("AppServer Response: ");
          console.log(response);
          sendToServer(conn, response);
        } else if(data.password === pass) { //valid password
          console.log("WebServer Validated");
          conn.auth = true;
        } else { //data sent without authorization
          conn.destroy(); //destroy connection
        }
      }
    } catch (err) {
      console.log(err);
      console.log('WebServer to AppServer input Error!');
    }
  });
});
  console.log("Listening on port 9090...");
  server.listen(9090);

/*
  Function that encodes the data in a proper format and sends it to the WebServer
  This is a convenience function, so that future implementations of encryption/whatever
  will be easy to add in
*/
async function sendToServer(conn, json) {
  conn.write(JSON.stringify(json));
}

var handleIo = require('./server/app-handle-io.js');
var handleReq = require('./server/app-handle-req.js');
var handleGame = require('./server/app-handle-game.js')
var handleSpecial = require('./server/app-handle-special.js');
