//do not shut down on error
process.on('uncaughtException', function (err) {
    console.log(err);
});

//constants
const ALL = 0;
const USER = 1;
const ROOM_ALL = 2;
const ROOM_EXCEPT_SENDER = 3;

//password
var pass = process.argv[2];
if(pass === undefined) {
  throw new Error("Usage: ./run-server.bat <password>");
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
      let response = {};
      if(conn.auth === undefined && data.password === undefined) { //not authenticated, no password
        throw new Error("Missing password");
      }
      if(conn.auth) { //if already authenticaed
        if(!(data.type === undefined)) { //data type defined
          switch(data.type) {
            case 'JOIN_ROOM': {
              response.type = 'JOIN_ROOM_RESPONSE';
              response.validLogin = true; //TODO::Proper login checks
              response.room = data.room;
              response.resNo = data.resNo;
              break;
            }
          }
        } else { //no data type -> socket.io stuff

        }
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
