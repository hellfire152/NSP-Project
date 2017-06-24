<<<<<<< HEAD

console.log("hello");
var question = [{
  "prompt": "1+1=?",
  "type": 1,
  "choices": ["Window", "11", "2", "Some lame ass joke"],
  "solution": "Go away", //there is no solution in the choices
  "time": 20
},
{
  "prompt": "What is zero in Roman Numerals?",
  "type": 1,
  "choices": ["Window", "11", "2", "Some lame ass joke"],
  "solution": "Go away", //there is no solution in the choices
  "time": 20
}]

question.forEach(function(individualQuestion){
  //Display the whole object
  // console.log(individualQuestion);

  //Display the key
  console.log(individualQuestion.prompt);
  console.log(individualQuestion.type);
  console.log(individualQuestion.solution);
  console.log(individualQuestion.time);
})

=======
>>>>>>> origin/master
[
  {
    "prompt": "1+1=?",
    "type": 1,
    "choices": ["Window", "11", "2", "Some lame ass joke"],
    "solution": "Go away",
    "time": 20
  },
  {
    "prompt": "What is zero in Roman Numerals?",
    "type": 1,
    "solution": " ",
    "time": 20
  }
]

<<<<<<< HEAD

console.log(("abcD" === "abcd"));
=======
var x;
console.log(x.range(1,10))
>>>>>>> origin/master
