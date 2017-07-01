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
  else{
    $("#addQuestion").show();
    $('#createQuiz').hide();
  }

  $(document).on('click', 'input[type="checkbox"]', function() {
      $('input[type="checkbox"]').not(this).prop('checked', false);
  });
});
//hello
 function setMCQ(){
   $("#mcqSection").show();
   $('#shortSection').hide();
 }

 function setShort(){
   $("#mcqSection").hide();
   $('#shortSection').show();
 }

 function setDisplay() {
   $("#addQuestion").hide();
   $('#createQuiz').show();
 }


 // everything in an array
 function displayAnswer() {
   var choice = [];

   choice[0] = $("#choice1").val();
   choice[1] = $("#choice2").val();
   choice[2] = $("#choice3").val();
   choice[3] = $("#choice4").val();

   var choiceArr  = []
   choice.forEach(function(individualChoice){
     if(individualChoice !== ""){
       choiceArr.push(individualChoice);
     }
   });
   var choiceArr = [choice[0] , choice[1], choice[2], choice[3]];

  console.log(choiceArr);
 }

 function displayChoice1() {
   if ($ ('#choice1').val() == "") {
     $("#choice2").empty();
     $("#choice2").prop('disabled', true);
   }else {
     $("#choice2").prop('disabled', false);
   }
 }

 function displayChoice2() {
   if ($ ('#choice2').val() == '') {
     $("#choice3").empty();
     $("#choice3").prop('disabled', true);
   }else {
     $("#choice3").prop('disabled', false);
   }
 }

 function displayChoice3() {
   if ($('#choice3').val() == '') {
     $("#choice4").empty();
     $("#choice4").prop('disabled', true);
   }else {
     $("#choice4").prop('disabled', false);
   }
 }

 function displayChoice(){
   displayChoice1();
   displayChoice2();
   displayChoice3();
 }

 $(".choices").on('keydown', function() {
   displayChoice();
 });


 function defaultSetting(){
   setMCQ();
   //using constants
   $("#mcq").val(0);
   $("#short-answer").val(1);
   $("#choice1Ans").val(C.MCQ.A);
   $("#choice2Ans").val(C.MCQ.B);
   $("#choice3Ans").val(C.MCQ.C);
   $("#choice4Ans").val(C.MCQ.D);

 }

defaultSetting();
setDisplay();

 // validations
$('#submit').click(function()
{
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


 // if($('#mcq').val() == C.DB.QUESTION_TYPE.MCQ){
 //   if($('input[name=solution]:checked').length<=0)
 //     {
 //        alert("Please pick a check box!");
 //        return false;
 //     }
 //
 //     else if( !$('#choice1').val() ) {
 //        alert('Please fill in at least 2 choices!');
 //        return false;
 //     }
 //
 //     else if( !$('#choice2').val() ) {
 //        alert('Please fill in at least 2 choices!');
 //        return false;
 //     }
 //   }

   //TODO: SEND TO SERVER
   var data = {
     quiz : create,
     question : questionArr,
     choices : choiceArr
   }

   var xhr = new XMLHttpRequest();
   xhr.open("POST", '/add-quiz', true);
   xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
  //  xhr.send(data);
   //OR TO STRINGIFY
   xhr.send(JSON.stringify(data));
 });

//choices in an array
var choiceArr = [];
var create;
var questionArr = [];
var questionNo = 1;

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


  choice = {
    choice : choice
  }

  create = {
    name : $("#nameofQuiz").val(),
    description : $("#desc").val(),
    public :  checkPublic(),
    reward : $("#cReward").val()
    }

  question = {
    questionNo : questionNo,
    prompt : $("#prompt").val(),
    type : $('input[name="type"]:checked').val(),
    solution : solution(),
    time : $("#time").val(),
    reward : $("#reward").val(),
    penalty : $("#penalty").val()
  }


  questionNo++;
  choiceArr.push(choice);
  console.log(choiceArr);
  // $('#submit').click(function()
  // {
  //   createArr.push(create);
  //   console.log(createArr);
  // });

  questionArr.push(question);
  console.log(questionArr);

  }
