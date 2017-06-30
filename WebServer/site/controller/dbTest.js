var socket = io();
var output;
$('#dbCreateStudentAccount').submit(function(){
  var data = formatData({
    type : C.DB.CREATE.STUDENT_ACC,
    email : $("#email").val(),
    password : $("#password").val(),
    name : $("#name").val(),
    username : $("#username").val(),
    school : $("#school").val()
  });

  send(data);
  return false;
});

$('#dbLoginAccount').submit(function(){
  var data = formatData({
    type : C.DB.SELECT.USER_ACCOUNT,
    user : $("#user").val(),
    password : $("#loginPassword").val(),
  });

  send(data);
  return false;
});

$('#dbCreateQuiz').click(function(){
  console.log("CREATING QUIZ");
  var data = formatData({
    type :  C.DB.CREATE.QUIZ,
    quizTitle : $("#quizTitle").val(),
    visibility : true, //Lazy Set
    description : $("#quizDescription").val(),
    quiz_type : "Classic", //lazy Set
    quiz_rating : 5, //Lazy Set
    user_id : 1, //Lazy Set
    question : questionArr,
    choices : choiceArr
  });

  console.log(data);

  send(data);
  return false;
});

$('#dbRetrieveQuestion').submit(function(){
  var data = formatData({
    type : C.DB.SELECT.QUESTION,
    quizId : $("#quizId").val(),
  });

  send(data);
  return false;
});

$('#dbSearchQuiz').submit(function(){
  var data = formatData({
    type : C.DB.SELECT.SEARCH_QUIZ,
    searchItem : $("#search").val(),
  });

  send(data);
  return false;
});

//convenience function for encoding the json for sending
async function encode(json) {
  console.log("JSON");
  console.log(json);
  return JSON.stringify(json);
}

function send(data) {
  console.log("Data send to webserver");
  console.log(data);
  encode(data)
    .then(encodedData => {
      socket.emit('send', encodedData);
    });
}

//Recieve data from webserver
socket.on('receive', function(data){
  console.log("Data recived from webserver");
  output = JSON.parse(data);
  console.log(output);
});
