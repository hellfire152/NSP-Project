/*
  Add data recieve from app server and store to respecitve table in the database.
  Note: only app server will have direct access to database for security purpose
  TODO: All data in the database will be encrypted with AES256 encryption

  Database server port: 7070

  Author: Nigel Chen Chin Hao
  Date: 09062017
 */

var mysql = require('mysql');
var handleDb = require("./data-handle.js")();
const C = require('../custom-API/constants.json');
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
    console.log("Request recieved from appserver");
    console.log(input);
    try{
      data = (JSON.parse(input)).data;
      console.log(data);
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
        case C.DB.SELECT.USER_ACCOUNT : {
          return await retrieveAccount(data);
          break;
        }
        //ADD MORE CASES HERE
      }
    }
    catch (err) {
      console.log(err);
      console.log('AppServer to DatabaseServer input Error!');
    }
  });

  //Send JSON string to app server
  async function sendToServer(json) {
    conn.write(JSON.stringify(json));
  }

  //==================== After this will be codes that access to physical database ====================

  //Create user account (student or teacher).
  //data.type should state clearly if it is STUDENT_DETAILS or TEACHER_DETAILS
  async function createAccount(data){
    await handleDb.handleCreateAccount(data) //TODO: Will shift handleCreateAccount lower, so it will be faster to check email availability
    .then(dataOut => {
      //Checking email availability
      handleDb.handleEncryption(dataOut.account)
      .then(dataAccount => {
        var query = connection.query(
          "SELECT user_id FROM user_account\
          WHERE email = " + connection.escape(dataAccount.email) +
          " OR username = " + connection.escape(dataAccount.username), function(error, result){
          // console.log(query);
          if(error){
            console.error('[Error in query]: ' + error);
            return;
          }

          if(result.length === 0){
            console.log("[Email available]");

            var query = connection.query("INSERT INTO user_account SET ?", dataAccount, function(error, result){
              if(error){
                console.error('[Error in query]: ' + error);
                return;
              }

              console.log('[Query successful]');
              console.log(result);
              var userId = result.insertId; //Get the userId for this user
              handleDb.handleEncryption(dataOut.details)
              .then(dataDetails => {
                switch(dataOut.type){
                  case C.DB.CREATE.STUDENT_ACC : {
                    userDetails(userId, dataDetails, "student_details");
                    break;
                  }
                  case C.DB.CREATE.TEACHER_ACC : {
                    userDetails(userId, dataDetails, "teacher_details");
                    break;
                  }
                }
              })
              .catch(reason => {
                console.log(reason);
              });
            });

            console.log('[Account created]');
          }
          else{
            console.log("[Username or Email have been taken]");
            //TODO: return error to server
          }
        });
      })
      .catch(reason => {
        console.log(reason);
      });
    });
  }

  //Apply additional details for teacher or student respecively
  async function userDetails(userId, details, type){
    details.user_id = userId;

    var query = connection.query("INSERT INTO " + type + " SET ?", details, function(error, result){
      if(error){
        console.error('[Error in query]: ' + error);
        return;
      }

      console.log('[Query successful]');
      console.log(result);
    });
  }

  //Check if account exist or not
  //Check if password input is correct
  //If correct, user personal data will be retrieved from database
  //Else no personal data will be sent
  async function retrieveAccount(data){
    await handleDb.handleEncryption(data.account)
    .then(dataAccount => {
      var query = connection.query(
        "SELECT user_id, password_hash, salt FROM user_account\
        WHERE email = " + connection.escape(dataAccount.username) +
        " OR username = " + connection.escape(dataAccount.username),
        function(err, result){
          if(err){
            console.error('[Error in query]: ' + err);
            return;
          }
          if(result.length > 0){
              dataAccount.userId = result[0].user_id;
              dataAccount.salt = result[0].salt;
              dataAccount.dbPass = result[0].password_hash;
              delete dataAccount.username; //Remove username to improve data processing

              handleDb.handleRecieveAccount(dataAccount)
              .then(dataOut => {
                //If user password input is equal to database password
                if(dataOut.hash_password === dataOut.dbPass){
                  console.log("Password correct");
                  var query = connection.query("SELECT user_account.user_id, user_account.name, user_account.username, user_account.email, student_details.student_id, student_details.date_of_birth, student_details.school\
                    FROM user_account\
                    LEFT OUTER JOIN student_details\
                    ON user_account.user_id = student_details.user_id\
                    WHERE student_details.user_id = " + connection.escape(dataOut.userId),
                  function(err, result){
                    if(result.length === 1){
                      handleDb.handleDecryption(result)
                      .then(resultOut => {
                        console.log(result);
                        sendToServer(result);
                      })
                      .catch(reason => {
                        console.log(reason);
                      });
                    }
                    else if(result.length === 0){
                      console.log(dataOut.account.userId);
                      var query = connection.query("SELECT user_account.user_id, user_account.name, user_account.username, user_account.email, teacher_details.teacher_id, teacher_details.organisation\
                        FROM user_account\
                        LEFT OUTER JOIN teacher_details\
                        ON user_account.user_id = teacher_details.user_id\
                        WHERE teacher_details.user_id = " + connection.escape(dataOut.account.userId),
                      function(err, result){
                        if(result.length === 1){
                          sendToServer(result);
                        }
                        else if(result.length === 0){
                          console.log("[No related data found]");
                          //TODO: Send error message to server
                        }
                        else{
                          console.log("[Duplicate user_id, Entity integrity compromise]");
                          //TODO: Send error message to server

                        }
                        console.log(result)
                      });
                    }
                    else{
                      console.log("[Duplicate user_id, Entity integrity compromise]");
                      //TODO: Send error message to server
                    }
                  });
                }
                else {
                  console.log("[Password Incorrect]");
                  //TODO: Send error message to server
                }
              })
              .catch(reason => {
                console.log(reason);
              });
          }
          else{
            console.log("[No such user found]");
            //TODO: return error to server
          }
        }
      );
    })
    .catch(reason => {
      console.log(reason);
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

      data.question.forEach(function(question){
        addQuestion(question, data, quizId);
      });
    });
  }

  //Function will be called by createQuiz(), addQuestion will be called repeatedly until all question is stored.
  async function addQuestion(questionData, data, quizId){
    questionData.quiz_id = quizId;
    // console.log(questionData);
    await handleDb.handleEncryption(questionData)
    .then(questionDataOut => {
      console.log(questionDataOut);
      var query = connection.query("INSERT INTO quiz_question SET ?", questionDataOut, function(error, result){
        if(error){
          console.error('[Error in query]: ' + error);
          return;
        }

        var questionId = result.insertId; // Get the questionId from the question
        //If question is a MCQ, addChoice function will be called to store the MCQ choices
        if(questionData.type == C.DB.QUESTION_TYPE.MCQ){
          addChoices(data.choices, questionId, questionData.question_no);
        }
      });
    })
  }

  //Search for matching questionNo, and then store the data accordingly
  async function addChoices(choiceData, questionId, questionNo){
    data.question_id = questionId;
    for(let choice of choiceData){
      console.log(choice);
      if(choice.question_no == questionNo){
        choice.question_id = questionId;
        await handleDb.handleEncryption(choice)
        .then(choiceDataOut => {
          var query = connection.query("INSERT INTO quiz_question_choices SET ?", choiceDataOut, function(error, result){
            if(error){
              console.error('[Error in query]: ' + error);
              return;
            }

            console.log('[Query successful]');
            console.log(result);
          });
        });
      }
    }
  }

  //Retrieve all the quiz available in the database
  async function retrieveAllQuiz(){
    var query = connection.query('SELECT * FROM quiz ORDER BY date_created DESC', function(err, result, fields){
  			if (!err) {
          console.log(result);
          //TODO: Method to send data to app server
          sendToServer(result);
  			} else {
  				console.log('[No result]');
          //TODO: return error to server
  			}
  	});
  }

  async function retrieveQuiz(){

  }

  //Search quizes in database
  async function searchQuiz(data){
    await handleDb.handleSearchQuiz(data)
    .then(dataOut => {
      var searchQuery = ""
      if(dataOut.searchArr.length > 1){
        for( i=0 ; i<dataOut.searchArr.length ; i++){
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
        function(err, result, fields){
    			if (!err) {
            console.log(result);
            //TODO: Method to send data to app server
            sendToServer(result);
    			} else {
    				console.log('[No result]');
            //TODO: return error to server
    			}
    	});
    });
  }

  //Retrieve every questions corresponding to the quiz specifed (quizId)
  //If question type is a short ans, choice_arr will be null
  async function retrieveQuestions(quizId){
    var query = connection.query("SELECT quiz_question.type, quiz_question.prompt, quiz_question.solution, quiz_question.time, quiz_question_choices.choices\
    FROM quiz_question\
    LEFT OUTER JOIN quiz_question_choices\
      ON quiz_question.question_id = quiz_question_choices.question_id\
    WHERE quiz_question.quiz_id = '" + quizId + "'\
    ORDER BY quiz_question.question_no",
    function(err, result, fields){
  			if (!err) { //result = data recieve from database
          handleDb.handleDecryption(result)
          .then(outPlainResult => {
            handleDb.handleRecieveQuestion(outPlainResult)
            .then(outResult => {
              // console.log(outResult);
              sendToServer(outResult);
            })
            .catch(reason => {
              console.log(reason);
            });
          })
          .catch(reason => {
            console.log(reason);
          });
  			} else {
          console.log(err);
  				console.log('[No result]');
          //TODO: return error to server
  			}
  	});
  }
});

console.log("Listening on port 7070");
server.listen(7070);
