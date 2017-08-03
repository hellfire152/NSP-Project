//choices in an array
var choiceArr = [];
var create;
var questionArr = [];
var questionNo = 1;

//Validation check for quiz description
$('#next').click(function(){
  if( !$('#nameofQuiz').val() ) {
     alert('Please fill in the name of the quiz!');
     return false;
  }

  else if( !$('#desc').val() ) {
     alert('Please fill in the description!');
     return false;
  }

  else if($('input[name=typeOfQuiz]:checked').length<=0)
  {
   alert("Please pick a type of quiz!");
   return false;
  }
  // else{
  //   $("#addQuestion").show();
  //   $('#createQuiz').hide();
  // }

//   $(document).on('click', 'input[type="checkbox"]', function() {
//       $('input[type="checkbox"]').not(this).prop('checked', false);
//   });
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

//Set the default upon loading web page
 function setDisplay() {
   $("#addQuestion").hide();
   $('#createQuiz').show();
 }

 //Store choices into an array
 function displayAnswer() {
   var choice = [];

   choice[0] = $("#choice1").val();
   choice[1] = $("#choice2").val();
   choice[2] = $("#choice3").val();
   choice[3] = $("#choice4").val();

   var choiceArr  = [];
   choice.forEach(function(individualChoice){
     if(individualChoice !== ""){
       choiceArr.push(individualChoice);
     }
   });
   var choiceArr = [choice[0] , choice[1], choice[2], choice[3]];

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

 // validations when question is added
function sendSetQuiz(){
 if( !$('#prompt').val() ) {
  alert('Please fill in the prompt!');
  return false;
 }

 else if($('input[name=type]:checked').length<=0)
 {
   alert("Please pick a type!");
   return false;
 }

 if ($("#mcq").is(":checked")) {
   if($('input[name=solution]:checked').length<=0)
       {
          alert("Please pick a check box!");
          return false;
       }

       else if( !$('#choice1').val() ) {
          alert('Please fill in at least 2 choices!');
          return false;
       }

       else if( !$('#choice2').val() ) {
          alert('Please fill in at least 2 choices!');
          return false;
       }
     }

 if ($("#short-answer").is(":checked")) {
   if(!$('#shortAns').val())
       {
          alert("Please fill in a short answer!");
          return false;
       }
     }

  //NOTE: This is the place where it send the quiz set to database
   var data = {
     quiz : create,
     question : questionArr,
     choices : choiceArr
   }
   sendToServer(data);
 }

//Input data object into a hidden form #quizSet
//And then send to server via the form.
function sendToServer(inputData){
  $('#quizSet').val(JSON.stringify(inputData));
  console.log($('#quizSet').val());
  document.forms["sendQuiz"].submit(function(){
    alert("send");
  });
}

//check weather it is public or private quiz
function checkPublic() {
if ($("#public").is(":checked")) {
   return true;
 } else {
   return false;
 }
}

//Add and prepare question into array
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

  // function solution(){
  //   if($('input[name="solution"]:checked').val() != undefined){
  //     return $('input[name="solution"]:checked').val();
  //   }
  //   else if ($('input[name="shortAns"]').val() != undefined){
  //     return $('input[name="shortAns"]').val();
  //   }
  //   else {
  //     console.log("NO SOLUTION");
  //     return null;
  //   }
  // }
  function solution(){
    if($("#mcq").is(":checked")){
      
    }
    else{

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
setDisplay();
