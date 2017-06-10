/*
  Add data recieve from app server and store to respecitve table in the database.
  Note: only app server will have direct access to database for security purpose
  TODO: All data in the database will be encrypted with AES256 encryption

  Author: Nigel Chen Chin Hao
  Date: 09062017
 */

var mysql = require('mysql');
var crypto = require('crypto');
const C = require('./constants.json')

//Create connection between app and database
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'exquizit'
});

//Ensure connection have been successful between data and database
connection.connect(function(error){
  if(!!error){
    console.error('[Failed to connect to database]: ' + error);
  }
  else{
    console.log('[Successfully connected to database]');
  }
});

module.exports = async function(input) {
  data = input.data;
  // C = input.C;

  console.log("DB TYPE: " +data.type);
  switch(data.type) {
    case C.DB.CREATE.STUDENT_ACC :
    case C.DB.CREATE.TEACHER_ACC : {
      return await createAccount(data);
      break;
    }
    case C.DB.CREATE.QUIZ : {
      return await createQuiz(data);
      break;
    }
    //ADD MORE CASES HERE
  }
}

//Create user account (student or teacher).
//data.type should state clearly if it is STUDENT_DETAILS or TEACHER_DETAILS
async function createAccount(data){
  console.log(data);

  var query = connection.query("INSERT INTO user_account SET ?", data.account, function(error, result){
    if(error){
      console.error('[Error in query]: ' + error);
      return;
    }

    console.log('[Query successful]');
    console.log(result);
    var userId = result.insertId; //Get the userId for this user

    switch(data.type){
      case C.DB.CREATE.STUDENT_ACC : {
        userDetails(userId, data.details, "student_details");
        break;
      }
      case C.DB.CREATE.TEACHER_ACC : {
        userDetails(userId, data.details, "teacher_details");
        break;
      }
    }
  });

  console.log('[Account created]');
}

//Apply additional details for teacher or student respecively
async function userDetails(userId, details, type){
  console.log("[Creating student]");
  console.log("[data.details]: " + details.date_of_birth);
  //
  details.user_id = userId;

  console.log("[student_details, user_id {FK}]: " + details.user_id);

  var query = connection.query("INSERT INTO " + type + " SET ?", details, function(error, result){
    if(error){
      console.error('[Error in query]: ' + error);
      return;
    }

    console.log('[Query successful]');
    console.log(result);
  });
}

//Planning to recreate create quiz function
async function createQuiz(data){
  data.quiz.date_created = new Date();
  var query = connection.query("INSERT INTO quiz SET ?", data.quiz, function(error, result){
    if(error){
      console.error('[Error in query]: ' + error);
      return;
    }

    console.log('[Query successful]');
    var quizId = result.insertId; //Get the quizId form quiz

    console.log("[quiz_id]: " + quizId);

    data.question.forEach(function(question){
      addQuestion(question, data, quizId);
    });
  });
}

async function addQuestion(questionData, data, quizId){
  console.log(quizId);

  questionData.quiz_id = quizId;

  var query = connection.query("INSERT INTO quiz_question SET ?", questionData, function(error, result){
    if(error){
      console.error('[Error in query]: ' + error);
      return;
    }

    var questionId = result.insertId;
    console.log("[question_id: ]: " + questionId);

    if(questionData.question_type == C.DB.QUESTION_TYPE.MCQ){
      addChoices(data.choices, questionId, questionData.question_no);
    }
  });
}

async function addChoices(choiceData, questionId, questionNo){
  data.question_id = questionId;
  var choice;
  console.log(choiceData);
  choiceData.forEach(function(choice){
    console.log("IN");
    if(choice.question_no == questionNo){
      console.log(choice.question_no);
      choice.question_id = questionId;
      console.log(choice);
      var query = connection.query("INSERT INTO quiz_question_choices SET ?", choice, function(error, result){
        if(error){
          console.error('[Error in query]: ' + error);
          return;
        }

        console.log('[Query successful]');
        console.log(result);
      });
    }
  });
}
