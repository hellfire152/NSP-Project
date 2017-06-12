var handleDb = require("./data-handle.js")();
var db = require("../database.js");
const C = require("./clientDbConstants.json");

//Sample data to create student account
function studentAcc(){
  return studentAcc = {
    data: {
      type : C.DB.CREATE.STUDENT_ACC,
      account : {
        email : "nigel_ncch@hotmail.com2",
        password_hash : "PasswordStudent",
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

function teacherAcc(){
  return teacherAcc = {
    data: {
      type : C.DB.CREATE.TEACHER_ACC,
      account : {
        email : "nigel.zch@gmail.com",
        password_hash : "PassowordTeachers",
        name : "Nigel Chen Chin Hao Teacher",
        username : "nigelhao teacher"
      },
      details :{
        organisation : "NYP organisation"
      }
    }
  }
}

//Sample data to create a new quiz
function quiz(){
  return quizSet = {
    data : {
      type : C.DB.CREATE.QUIZ,
      quiz : {
        quiz_title : "quiz title",
        visibility : true,
        description : "quiz description",
        quiz_type : "Classic",
        quiz_rating : 5,
        user_id : 2
      },
      question : [
        {
          question_type : C.DB.QUESTION_TYPE.MCQ,
          question_statement : "Question statement 1",
          correct_ans : "ANS 1",
          question_no : 1,
          time : 30
        },
        {
          question_type : C.DB.QUESTION_TYPE.SHORT_ANS,
          question_statement : "Question statement 2",
          correct_ans : "This is the answer for short answer",
          question_no : 2,
          time : 30
        },
        {
          question_type : C.DB.QUESTION_TYPE.SHORT_ANS,
          question_statement : "Question statement 3",
          correct_ans : "No answer",
          question_no : 3,
          time : 30
        },
        {
          question_type : C.DB.QUESTION_TYPE.MCQ,
          question_statement : "Question statement 4",
          correct_ans : "ANS 4",
          question_no : 4,
          time : 30
        },
        {
          question_type : C.DB.QUESTION_TYPE.MCQ,
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

function retrieveAllQuiz(){
  return quizSet = {
    data : {
      sessionId : "123",
      type : C.DB.SELECT.ALL_QUIZ
    }
  }
}

function retrieveQuestion(){
  return quizSet = {
    data : {
      sessionId : "123",
      type : C.DB.SELECT.QUESTION,
      quizId : 8
    }
  }
}

function searchQuiz(){
  return searchQuiz = {
    data : {
      sessionId : "123",
      type : C.DB.SELECT.SEARCH_QUIZ,
      searchItem : "nigel chen chin hao"
    }
  }
}

// var data = retrieveQuiz();
//
// let x = data => {
//   return db(data).then(value => { return value})
// }
//
// let y = x(data);
//
// x(data).then(function(result){
//   // console.log(result);
// })
// db(searchQuiz());
// db(retrieveAllQuiz());
// db(retrieveQuestion());
// db(quiz());
// handleDb.handleCreateAccount(studentAcc());
// handleDb.handleCreateAccount(teacherAcc());
handleDb.handleSearchQuiz(searchQuiz());
