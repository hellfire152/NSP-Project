var socket = io();
$('#dbRetrieveQuiz').submit(function(){
  var type = C.DB.SELECT.QUESTION;

  var retrieveQuiz = {
    data : {
      type : type,
      quizId : $('#quizId').val()
    }
  }

  send(retrieveQuiz);

  return false;
});

//convenience function for encoding the json for sending
async function encode(json) {
  return JSON.stringify(json);
}

function send(data) {
  // if (data.event === undefined && data.game === undefined) throw new Error("Event/game type not defined!");
  encode(data)
    .then(encodedData => {
      console.log(socket);
      socket.emit('send', encodedData);
    });
}
