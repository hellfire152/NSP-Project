var choiceArr = [];
var create;
var questionArr = [];
var questionNo = 1;

//Validation check for quiz description
$('#addQuestion').click(function(){
  if( !$('#quizTitle').val() ) {
     alert('Please fill in the name of the quiz!');
     event.stop(); // TODO:NEED TO CHANGE
     return false;
  }

  else if( !$('#quizDescription').val() ) {
     alert('Please fill in the description!');
     event.stop(); // TODO:NEED TO CHANGE
     return false;
  }

  else if($('input[name=visibility]:checked').length<=0)
  {
   alert("Please select the visibility");
   event.stop(); // TODO:NEED TO CHANGE
   return false;
  }
  else{
    return true;
  }
});

// Activate choice 2 when field is choice 1 is properly set
function displayChoice1() {
 if ($ ('#choice1').val() == "") {
   $("#choice2").empty();
   $("#choice2").prop('disabled', true);
   $("#filled-in-box1").prop('disabled', true);
 }else {
   $("#choice2").prop('disabled', false);
   $("#filled-in-box1").prop('disabled', false);
 }
}

// Activate choice 3 when field is choice 2 is properly set
function displayChoice2() {
 if ($ ('#choice2').val() == '') {
   $("#choice3").empty();
   $("#choice3").prop('disabled', true);
   $("#filled-in-box2").prop('disabled', true);
 }else {
   $("#choice3").prop('disabled', false);
   $("#filled-in-box2").prop('disabled', false);
 }
}
// Activate choice 4 when field is choice 3 is properly set
function displayChoice3() {
 if ($('#choice3').val() == '') {
   $("#choice4").empty();
   $("#choice4").prop('disabled', true);
   $("#filled-in-box3").prop('disabled', true);
 }else {
   $("#choice4").prop('disabled', false);
   $("#filled-in-box3").prop('disabled', false);
 }
}
function displayChoice4() {
 if ($('#choice4').val() == '') {
   $("#filled-in-box4").prop('disabled', true);
 }else {
   $("#filled-in-box4").prop('disabled', false);
 }
}

//On every key stroke, check weahter there is input in field
//If field is empty deactiveate accordingly
function displayChoice(){
  displayChoice1();
  displayChoice2();
  displayChoice3();
  displayChoice4() ;
}
$(".choices").on('keydown', function() {
  displayChoice();
});

//Activate upon changing radio button
function showChoiceFields(){
  $('#choice').show();
  displayChoice();
  $('input[id="choiceShortAns"]').val("")
  $('#short').hide();
}

//Activate upon changing radio button
function showShortFields(){
  $('#short').show();
  $ ('#choice1').val("");
  $ ('#choice2').val("");
  $ ('#choice3').val("");
  $ ('#choice4').val("");
  $('#filled-in-box').attr('checked', false);
  $('#filled-in-box2').attr('checked', false);
  $('#filled-in-box3').attr('checked', false);
  $('#filled-in-box4').attr('checked', false);
  $('#choice').hide();
}

$('input[type=radio][name=type]').change(function(){
    if (this.value == 0) {
        showChoiceFields();
    }
    else if (this.value == 1) {
        showShortFields();
    }
    });

//Set default setting when adding question is loaded
function defaultSetting(){
 $("#mcq").prop("checked", true);
 //using constants
 $("#mcq").val(0);
 $("#shortans").val(1);
 $("#filled-in-box").val(C.MCQ.A);
 $("#filled-in-box2").val(C.MCQ.B);
 $("#filled-in-box3").val(C.MCQ.C);
 $("#filled-in-box4").val(C.MCQ.D);
 showChoiceFields();
 displayChoice();
}

//check weather it is public or private quiz
function checkPublic() {
if ($("#visibleYes").is(":checked")) {
  return true;
} else {
  return false;
}
}

//Generate the solution
function solution(){
 if($('#mcq').is(':checked')){
  var totalSolution = 0;
    if($('input[id="filled-in-box"]:checked').val() != undefined){
      totalSolution += parseInt($('input[id="filled-in-box"]:checked').val());
    }
    if($('input[id="filled-in-box2"]:checked').val() != undefined){
      totalSolution += parseInt($('input[id="filled-in-box2"]:checked').val());
    }
    if($('input[id="filled-in-box3"]:checked').val() != undefined){
      totalSolution += parseInt($('input[id="filled-in-box3"]:checked').val());
    }
    if($('input[id="filled-in-box4"]:checked').val() != undefined){
      totalSolution += parseInt($('input[id="filled-in-box4"]:checked').val());
    }
    return totalSolution.toString();
 }
 else if ($('#shortans').is(':checked')){
   return $('input[id="choiceShortAns"]').val();
 }
 else {
   console.log("NO SOLUTION");
   return null;
 }
}

//Check user input
function verifyAddQuestion(){
  if($("#prompt").val() == ""){
    alert("Please enter your prompt");
    return false;
  }
  if($('input[name="type"]:checked').val() == 0){
    if($('#choice1').val() == "" || $('#choice2').val() == ""){
      alert("Please enter at least 2 choices");
      return false;
    }
    if(!$("#filled-in-box").is(":checked") && !$("#filled-in-box2").is(":checked") && !$("#filled-in-box3").is(":checked") && !$("#filled-in-box4").is(":checked")){
      alert("Please check one of the answer");
      return false;
    }
  }
  else if($('input[name="type"]:checked').val() == 1){
    if($('input[id="choiceShortAns"]').val() == ""){
      alert("Please write the answer in the answer field");
      return false;
    }
  }
  return true;
}

//Add question and format accordingly
function addQuestion(){
  if(verifyAddQuestion()){
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

    choice = {
      choices : JSON.stringify(choice),
      question_no : questionNo
    }

    question = {
      question_no : questionNo,
      prompt : $("#prompt").val(),
      type : $('input[name="type"]:checked').val(),
      solution : solution(),
      time : $("#time").val(),
      reward : $("#specificReward").val(),
      penalty : $("#specificPenatly").val()
    }

     $( "#questionAppend" ).append( "<p>"+questionNo+") "+$("#prompt").val()+"</p>" );

    questionNo++;

    if($("#mcq").is(":checked")){
      choiceArr.push(choice);
    }
    questionArr.push(question);
    console.log(choiceArr);
    console.log(questionArr);
    $('#addQuestionForm').trigger("reset");
    showChoiceFields();
  }
  else{
    return false;
  }
}

function sendSetQuiz(){
 if( !$('#quizTitle').val() ) {
    alert('Please fill in the name of the quiz!');
    event.stop(); // TODO:NEED TO CHANGE
    return false;
 }
 else if( !$('#quizDescription').val() ) {
    alert('Please fill in the description!');
    event.stop(); // TODO:NEED TO CHANGE
    return false;
 }
 else if($('input[name=visibility]:checked').length<=0)
 {
  alert("Please select the visibility");
  event.stop(); // TODO:NEED TO CHANGE
  return false;
}
else if(questionArr.length == 0){
  alert("Please key add some question");
  event.stop(); // TODO:NEED TO CHANGE
  return false;
}
else{
  create = {
    quiz_title : $("#quizTitle").val(),
    description : $("#quizDescription").val(),
    visibility :  checkPublic(),
    reward : $("#mainReward").val()
  }

  //NOTE: This is the place where it send the quiz set to database
  var data = {
    quiz : create,
    question : questionArr,
    choices : choiceArr
  }
  sendToServer(data);
}
}

function sendToServer(inputData){
 alert("Quiz Submitted");
 $('#quizSet').val(JSON.stringify(inputData));
 console.log($('#quizSet').val);
 document.forms["sendQuiz"].submit(function(){
   alert("send");
 });
}

defaultSetting()
