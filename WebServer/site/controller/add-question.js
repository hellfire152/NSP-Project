// var mcq = document.getElementById('mcq').value;
// var shortans =document.getElementById('short-answer').value;
// var type;
//
// var check = function() {
// document.getElementsByClassName('type').checked = true;
// }
//
// var uncheck = function() {
// document.getElementsByClassName('type').checked = false;
// }
//
// if(document.getElementById('mcq').checked){
//   type = 0;
// } else if (document.getElementById('short-answer').checked){
//   type = 1;
// }

// const QUESTION_TYPE = {
//   0 : 'mcq',
//   1 : 'short answer'
// };
//
//
// function getCheckedType() {
//   var type = document.getElementsByClassName("type");
//   for (var x = 0; x < type.length; x++) {
//   if (type[x].checked) {
//     QUESTION_TYPE = 0;
//   }
//   else {
//     QUESTION_TYPE = 1;
//   }
// }
//
// }
//
document.getElementById('mcq').onchange = displayTextBox;
document.getElementById('short-answer').onchange = displayTextBox;

var box1 = document.getElementById('choice1');
var box2 = document.getElementById('choice2');
var box3 = document.getElementById('choice3');
var box4 = document.getElementById('choice4');

function displayTextBox(displayText) {
  if (displayText.target.value == "0") {
    box1.disabled = false;
    box2.disabled = false;
    box3.disabled = false;
    box4.disabled = false;

  } else if (displayText.target.value == "1") {
    box1.disabled = false;
  }
}
