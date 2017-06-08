var mysql = require('mysql');
var crypto = require('crypto');

//Connect to database
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'exquizit'
});

connection.connect(function(error){
  if(!!error){
    console.error('[Failed to connect to database]: ' + error);
  }
  else{
    console.log('[Successfully connected to database]');
  }
});

async function createAccount(data){
  console.log(data);

  var query = connection.query("INSERT INTO user_account SET ?", data.account, function(error, result){
    if(error){
      console.error('[Error in query]: ' + error);
      return;
    }

    console.log('[Query successful]');
    console.log(result);
    var userId = result.insertId; //Get the userId form user_account

    switch(data.type){
      case C.DB.INSERT.STUDENT_DETAILS : {
        userDetails(userId, data.details, "student_details");
        break;
      }
      case C.DB.INSERT.TEACHER_DETAILS : {
        userDetails(userId, data.details, "teacher_details");
        break;
      }
    }
  });

  console.log('[Account created]');
}

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
var index;
async function createQuiz(data){
  data.quiz.date_created = new Date();
  console.log(data);
  var query = connection.query("INSERT INTO quiz SET ?", data.quiz, function(error, result){
    if(error){
      console.error('[Error in query]: ' + error);
      return;
    }

    console.log('[Query successful]');
    console.log(result);
    var quizId = result.insertId; //Get the quizId form quiz

    index = 0;
    data.question.forEach(function(question){
      addQuestion(question, data, quizId);
    });
  });
}

async function addQuestion(questionData, mainData, quizId){
  console.log(quizId);

  questionData.quiz_id = quizId;

  var query = connection.query("INSERT INTO quiz_question SET ?", questionData, function(error, result){
    if(error){
      console.error('[Error in query]: ' + error);
      return;
    }

    console.log('[Query successful]');
    console.log(result);

    var questionId = result.insertId;
    console.log("[question_id: ]: " + questionId);

    console.log(index);
    if(questionData.question_type == C.DB.OTHERS.MCQ){
      addChoices(mainData.choices[index++], questionId);
    }
  });
}

async function addChoices(data, questionId){

data.question_id = questionId;

console.log("[Choices_arr]: " + data.choice_arr);

  var query = connection.query("INSERT INTO quiz_question_choices SET ?", data, function(error, result){
    if(error){
      console.error('[Error in query]: ' + error);
      return;
    }

    console.log('[Query successful]');
    console.log(result);
  });
}

module.exports = async function(input) {
  data = input.data;
  C = input.C;

  console.log("DB TYPE: " +data.type);
  switch(data.type) {
    case C.DB.INSERT.STUDENT_DETAILS : {
      return await createAccount(data);
      break;
    }
    case C.DB.INSERT.TEACHER_DETAILS : {
      return await createAccount(data);
      break;
    }
    case C.DB.INSERT.QUIZ : {
      return await createQuiz(data);
      break;
    }
    //ADD MORE CASES HERE
  }
}
