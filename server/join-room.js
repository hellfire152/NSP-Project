module.exports = function(io) {
  io.sockets.on('connection', function(socket){
    io.on('join_room_with_login', function(data) {

    });

    io.on('temp', function(){

    });
  });
};
