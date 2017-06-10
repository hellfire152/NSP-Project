var handleDb = require("./data-handle.js");
var db = require("../database.js");
var cipher = require("../cipher.js")();
const C = require("./clientDbConstants.json");

//Sample data to create student account
function studentAcc(){
  return studentAcc = {
    data: {
      type : C.CREATE.STUDENT_ACC,
      account : {
        email : "nigel_ncch@hotmail.com",
        password_hash : "hiwydwuiagshfgdsigf viuwebgiutvbgfwaiurfyviuewhiufehdsfvsdf bhwedhfksdhkjf",
        name : "Nigel Chen Chin Hao",
        username : "nigelhao"
      },
      details :{
        school : "NYP",
        date_of_birth : new Date()
      }
    }
  }
}

//Sample data to create a new quiz
function quiz(){
  return quizSet = {
    data : {
      type : C.CREATE.QUIZ,
      quiz : {
        quiz_title : "quiz title",
        visibility : true,
        description : "quiz description",
        quiz_type : "Classic",
        quiz_rating : 5
      },
      question : [
        {
          question_type : C.QUESTION_TYPE.MCQ,
          question_statement : "Question statement 1",
          correct_ans : "ANS 1",
          question_no : 1,
          time : 30
        },
        {
          question_type : C.QUESTION_TYPE.SHORT_ANS,
          question_statement : "Question statement 2",
          correct_ans : "This is the answer for short answer",
          question_no : 2,
          time : 30
        },
        {
          question_type : C.QUESTION_TYPE.SHORT_ANS,
          question_statement : "Question statement 3",
          correct_ans : "No answer",
          question_no : 3,
          time : 30
        },
        {
          question_type : C.QUESTION_TYPE.MCQ,
          question_statement : "Question statement 4",
          correct_ans : "ANS 4",
          question_no : 4,
          time : 30
        },
        {
          question_type : C.QUESTION_TYPE.MCQ,
          question_statement : "Question statement 5",
          correct_ans : "ANS 2",
          question_no : 5,
          time : 30
        }

      ],
      choices : [
        {
          choice_arr : JSON.stringify(['ANS1' , 'ANS2' , 'ANS3' , 'ANS4']),
          question_no : 1
        },
        {
          choice_arr : JSON.stringify(['ANS1' , 'ANS2' , 'ANS3' , 'ANS4']),
          question_no : 4
        },
        {
          choice_arr : JSON.stringify(['ANS1' , 'ANS2' , 'ANS3' , 'ANS4']),
          question_no : 5
        }
      ]
    }
  }
}

db(quiz());
handleDb.handleCreateAccount(studentAcc());


// console.log(studentAcc.data.type);
// db(studentAcc);
