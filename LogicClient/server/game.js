/*
  Handles the code for the game, that are not gamemode-specific
*/
/*
  keeps track of all progress

  {
    room_id : auiz _object
  }
*/
var allProgress = {};
var cipher = require('../custom-API/cipher.js');
//var sessionHandler = require('./custom-API/session-handler.js');
var shortid = require('shortid');
module.exports = function (io) {
  io.sockets.on('connection', function(socket) {
    console.log("Request received");

  });
};
