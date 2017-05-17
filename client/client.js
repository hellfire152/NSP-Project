/*
 * Client side code for the NSP project.
 * Version: pre02052017
 */
//initializes a socket.io connection
var socket = io();

function answer(answer) {
  socket.emit('answer_submit', answer);
  console.log(answer);
}

socket.on('test_answer_confirm', function(result){
  if(result) {
    
  } else {

  }
});
