/*
  Handles first connection, up till selecting gamemodes
*/
var shortid = require('shortid');
module.exports = function (io) {
  io.sockets.on('connection', function(socket) {
    console.log("Request received");
    socket.handshake.session.data = {
        id: shortid.generate() //generate a random id for each connected user
    };
    socket.on('answer_submit', function(answer) {
    })
  });
};
