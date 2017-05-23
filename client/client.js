/*
 * Client side code for the NSP project.
 * Version: pre02052017
 */
//initializes a socket.io connection
var socket = io();
io.emit('temp');
function joinRoomWithLogin() {
  var username = document.getElementById('id');
  var password = document.getElementById('pass');
  var room = document.getElementById('room');

  io.emit('join_room_with_login', {
    user: username,
    pass: pass,
    room: room
  });
}
io.on('room_join_fail', function(){

});

io.on('redirect_to_room', function(room){
  window.location.replace("https://116.86.186.103:8080/play?room=" +room);
});
