/*
  Handles first connection, up till selecting gamemodes
*/
/*
  keeps track of all progress

  {
    room_id : auiz _object
  }
*/
var allProgress = {};

//var sessionHandler = require('./custom-API/session-handler.js');
var shortid = require('shortid');
module.exports = function (io) {
  io.sockets.on('connection', function(socket) {
    console.log("Request received");
    
  });
};
