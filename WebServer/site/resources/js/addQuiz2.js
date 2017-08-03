//Initialize variable
var choiceArr = [];
var create;
var questionArr = [];
var questionNo = 1;

$('#quizDetails').click(function(event) {
  if( !$('#nameofQuiz').val() ) {
     alert('Please fill in the name of the quiz!');
     event.stop(); // TODO:NEED TO CHANGE
     return;
  }

  else if( !$('#desc').val() ) {
     alert('Please fill in the description!');
     event.stop(); // TODO:NEED TO CHANGE
     return;
  }

  else if($('input[name=typeOfQuiz]:checked').length<=0)
  {
   alert("Please pick a type of quiz!");
   event.stop(); // TODO:NEED TO CHANGE
   return;
  }
});

//Display MCQ fields to user to input
function setMCQ(){
  $("#mcqSection").show();
  $('#shortSection').hide();
}

//Display Short answer fields to user to input
 function setShort(){
   $("#mcqSection").hide();
   $('#shortSection').show();
 }

 // Activate choice 2 when field is choice 1 is properly set
  function displayChoice1() {
    if ($ ('#choice1').val() == "") {
      $("#choice2").empty();
      $("#choice2").prop('disabled', true);
    }else {
      $("#choice2").prop('disabled', false);
    }
  }

 // Activate choice 3 when field is choice 2 is properly set
  function displayChoice2() {
    if ($ ('#choice2').val() == '') {
      $("#choice3").empty();
      $("#choice3").prop('disabled', true);
    }else {
      $("#choice3").prop('disabled', false);
    }
  }
 // Activate choice 4 when field is choice 3 is properly set
  function displayChoice3() {
    if ($('#choice3').val() == '') {
      $("#choice4").empty();
      $("#choice4").prop('disabled', true);
    }else {
      $("#choice4").prop('disabled', false);
    }
  }

 //On every key stroke, check weahter there is input in field
 //If field is empty deactiveate accordingly
  function displayChoice(){
    displayChoice1();
    displayChoice2();
    displayChoice3();
  }
  $(".choices").on('keydown', function() {
    displayChoice();
  });

 //Set default setting when adding question is loaded
  function defaultSetting(){
    $("#mcq").prop("checked", true);
    setMCQ();
    //using constants
    $("#mcq").val(0);
    $("#short-answer").val(1);
    $("#filled-in-box").val(C.MCQ.A);
    $("#filled-in-box2").val(C.MCQ.B);
    $("#filled-in-box3").val(C.MCQ.C);
    $("#filled-in-box4").val(C.MCQ.D);

  }

  //check weather it is public or private quiz
  function checkPublic() {
  if ($("#public").is(":checked")) {
     return true;
   } else {
     return false;
   }
  }

  function addQuestion() {
    var choice = [];
    if ($ ('#choice1').val().length != 0) {
      choice.push($('#choice1').val());
    }
    if ($ ('#choice2').val().length != 0) {
      choice.push($('#choice2').val());
    }
    if ($ ('#choice3').val().length != 0) {
        choice.push($('#choice3').val());
    }
    if ($ ('#choice4').val().length != 0) {
        choice.push($('#choice4').val());
    }

    function solution(){
      if($('input[name="solution"]:checked').val() != undefined){
        return $('input[name="solution"]:checked').val();
      }
      else if ($('input[name="shortAns"]').val() != undefined){
        return $('input[name="shortAns"]').val();
      }
      else {
        console.log("NO SOLUTION");
        return null;
      }
    }

    //Prepare choices Object and store into an array
    choice = {
      choices : JSON.stringify(choice),
      question_no : questionNo
    }

    //Prepare Quiz Object
    create = {
      quiz_title : $("#nameofQuiz").val(),
      description : $("#desc").val(),
      visibility :  checkPublic(),
      reward : $("#cReward").val()
    }

    //Prepare Question Object and store into an array
    question = {
      question_no : questionNo,
      prompt : $("#prompt").val(),
      type : $('input[name="type"]:checked').val(),
      solution : solution(),
      time : $("#time").val(),
      reward : $("#reward").val(),
      penalty : $("#penalty").val()
    }

    questionNo++;

    if($("#mcq").is(":checked")){
      choiceArr.push(choice);
    }
    questionArr.push(question);
  }






  defaultSetting();
