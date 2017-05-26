//do not shut down on error
process.on('uncaughtException', function (err) {
    console.log(err);
});

//constants
const TO_ALL = 0;
const TO_ONE_USER = 1;
const TO_ROOM_ALL = 2;
const TO_ROOM_EXCEPT_SENDER = 3;

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
      var data = JSON.parse(input);
    } catch (err) {
      console.log('WebServer to AppServer input not a JSON Object!');
    }
    if(conn.auth === undefined && data.password === undefined) { //not authenticated, no password
      throw new Error("Missing password");
    }

    if(conn.auth) { //if already authenticaed
      //Processing proper input
      //returns the same object with an extra property
      data.fromAppServer = true;
      //TEST VALUE
      data.sendTo = TO_ALL;
      conn.write(JSON.stringify(data));
    } else if(data.password === pass) { //valid password
      console.log("Validated");
      conn.auth = true;
    } else { //data sent without authorization
      conn.destroy(); //destroy connection
    }
  });
});
  console.log("Listening on port 9090...");
  server.listen(9090);
