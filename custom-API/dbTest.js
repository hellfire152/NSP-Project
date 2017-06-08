var db = require("./database.js");
var C = require("./constants.json");
var cipher = require("./cipher.js");

var input = {
  C : C,
  data: {
    type : C.DB.INSERT.STUDENT_DETAILS,
    account : {
      email : "nigel_ncch@hotmail.com",
      password_hash : "password_not hashed..",
      name : "Nigel Chen Chin Hao",
      username : "nigelhao"
    },
    details :{
      school : "NYP",
      date_of_birth : new Date()
    }
  }
}
db(input);

var input = {
  C : C,
  data: {
    type : C.DB.INSERT.TEACHER_DETAILS,
    account : {
      email : "nigel.zch@gmail.com",
      password_hash : "password_not hashed..",
      name : "Nigel teacher",
      username : "nigelTeacher"
    },
    details :{
      organisation : "NYP TEACHER"
    }
  }
}
db(input);

var choiceArr = JSON.stringify(['ANS1' , 'ANS2' , 'ANS3' , 'ANS4']);

var input = {
  C : C,
  data: {
    type : C.DB.INSERT.QUIZ,
    quiz : {
      quiz_title : "quiz title",
      visibility : true,
      description : "quiz description",
      quiz_rating : 5
    },
    question : [
      {
        question_type : C.DB.OTHERS.MCQ,
        question_statement : "Question statement",
        correct_ans : "ANS",
        time : 30
      },
      {
        question_type : C.DB.OTHERS.SHORT_ANS,
        question_statement : "Question statement2",
        correct_ans : "ANS2",
        time : 30
      },
      {
        question_type : C.DB.OTHERS.MCQ,
        question_statement : "Question statement3",
        correct_ans : "ANS3",
        time : 30
      }
    ],
    choices : [
      {
        choice_arr :choiceArr
      },
      {
        choice_arr : choiceArr
      }
    ]
  }
}
function go(){
  db(input);
}

db(input);
setTimeout(go, 2000);
