/*
  Add data recieve from app server and store to respecitve table in the database.
  Note: only app server will have direct access to database for security purpose
  TODO: All data in the database will be encrypted with AES256 encryption

  Database server port: 7070

  Author: Nigel Chen Chin Hao
  Date: 09062017
 */

var mysql = require('mysql');
// var crypto = require('crypto');
var handleDb = require("./database/data-handle.js")();
const C = require('./constants.json');
var net = require('net');

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


var server = net.createServer(function(conn){
  console.log("Database server start");

  conn.on('end', function(){
    console.log('App server disconnected');
    server.close();
    process.exit(0);
  });

  conn.on('data', async function(input){
    data = (JSON.parse(input)).data;
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
      case C.DB.SELECT.ALL_QUIZ : {
        return await retrieveAllQuiz();
        break
      }
      case C.DB.SELECT.QUESTION : {
        return await retrieveQuestions(data.quizId); //quizId of the data
        break;
      }
      case C.DB.SELECT.SEARCH_QUIZ : {
        return await searchQuiz(data);
        break;
      }
      //ADD MORE CASES HERE
    }
  });
})

console.log("Listening on port 7070")
server.listen(7070);


/*
  After this will be codes that access to physical database
 */
//Create user account (student or teacher).
//data.type should state clearly if it is STUDENT_DETAILS or TEACHER_DETAILS
async function createAccount(data){
  await handleDb.handleCreateAccount(data)
  .then(dataOut => {
    var query = connection.query("SELECT user_id FROM user_account WHERE email = " + connection.escape(dataOut.account.email), function(error, result){
      // console.log(query);
      if(error){
        console.error('[Error in query]: ' + error);
        return;
      }

      if(result.length === 0){
        console.log("[Email available]");

        var query = connection.query("INSERT INTO user_account SET ?", dataOut.account, function(error, result){
          if(error){
            console.error('[Error in query]: ' + error);
            return;
          }

          console.log('[Query successful]');
          console.log(result);
          var userId = result.insertId; //Get the userId for this user

          switch(dataOut.type){
            case C.DB.CREATE.STUDENT_ACC : {
              userDetails(userId, dataOut.details, "student_details");
              break;
            }
            case C.DB.CREATE.TEACHER_ACC : {
              userDetails(userId, dataOut.details, "teacher_details");
              break;
            }
          }
        });

        console.log('[Account created]');
      }
      else{
        console.log("[Email have been taken]");
      }
    });
  });
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

//Create quiz and add to database accordinly
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

//Function will be called by createQuiz(), addQuestion will be called repeatedly until all question is stored.
async function addQuestion(questionData, data, quizId){
  console.log(quizId);

  questionData.quiz_id = quizId;

  var query = connection.query("INSERT INTO quiz_question SET ?", questionData, function(error, result){
    if(error){
      console.error('[Error in query]: ' + error);
      return;
    }

    var questionId = result.insertId; // Get the questionId from the question
    console.log("[question_id: ]: " + questionId);

    //If question is a MCQ, addChoice function will be called to store the MCQ choices
    if(questionData.question_type == C.DB.QUESTION_TYPE.MCQ){
      addChoices(data.choices, questionId, questionData.question_no);
    }
  });
}

//Search for matching questionNo, and then store the data accordingly
async function addChoices(choiceData, questionId, questionNo){
  data.question_id = questionId;
  choiceData.forEach(function(choice){
    if(choice.question_no == questionNo){
      choice.question_id = questionId;
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

//Retrieve all the quiz available in the database
async function retrieveAllQuiz(){
  var query = connection.query('SELECT * FROM quiz ORDER BY date_created DESC', function(err, rows, fields){
			if (!err) {
        console.log(rows);
        //TODO: Method to send data to app server
			} else {
				console.log('No results.');
			}
	});
}


async function retrieveQuiz(){

}

//Search quiz
async function searchQuiz(data){
  console.log(data);
  await handleDb.handleSearchQuiz(data)
  .then(dataOut => {
    console.log(dataOut);
    var searchQuery = ""
    if(dataOut.searchArr.length > 1){
      for( i=0 ; i<dataOut.searchArr.length ; i++){
        console.log(dataOut.searchArr[i]);
        searchQuery +=
        " OR quiz_title LIKE '%" + dataOut.searchArr[i] + "%'\
          OR description LIKE '%" + dataOut.searchArr[i] + "%'"
      }
    }

    var query = connection.query("SELECT * FROM quiz\
    WHERE\
      quiz_title LIKE '%" + dataOut.searchItem + "%'\
      OR\
      description LIKE '%" + dataOut.searchItem + "%'" + searchQuery,
      function(err, rows, fields){
  			if (!err) {
          console.log(rows);
          //TODO: Method to send data to app server
  			} else {
  				console.log('No results.');
  			}
  	});
  });
}

//Retrieve every questions corresponding to the quiz specifed (quizId)
//If question type is a short ans, choice_arr will be null
async function retrieveQuestions(quizId){
  var query = connection.query("SELECT quiz_question.question_no, quiz_question.question_type, quiz_question.question_statement, quiz_question.correct_ans, quiz_question.correct_ans, quiz_question.time, quiz_question_choices.choice_arr\
  FROM quiz_question\
  LEFT OUTER JOIN quiz_question_choices\
    ON quiz_question.question_id = quiz_question_choices.question_id\
  WHERE quiz_question.quiz_id = '" + quizId + "'\
  ORDER BY quiz_question.question_no",
  function(err, rows, fields){
			if (!err) {
        console.log(rows); //rows = data recieve from database
        //TODO:Method to send data to app server
			} else {
				console.log('No results.');
			}
	});
}
