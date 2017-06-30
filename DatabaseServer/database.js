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
var Promise = require('promise');
//Create connection between app and database
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'exquizit'
});

//Ensure connection have been successful between data and database
connection.connect(function(error){
  if(error){
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
    try{
      var inputData = (JSON.parse(input));

      console.log("DB TYPE: " + inputData.data.type);
      switch(inputData.data.type) {
        case C.DB.CREATE.STUDENT_ACC :
        case C.DB.CREATE.TEACHER_ACC : {
          await createAccount(inputData);
          break;
        }
        case C.DB.CREATE.QUIZ : {
          await createQuiz(inputData);
          break;
        }
        case C.DB.SELECT.ALL_QUIZ : {
          await retrieveAllQuiz();
          break;
        }
        case C.DB.SELECT.QUESTION : {
          await retrieveQuestions(inputData); //quizId of the data
          break;
        }
        case C.DB.SELECT.SEARCH_QUIZ : {
          await searchQuiz(inputData);
          break;
        }
        case C.DB.SELECT.USER_ACCOUNT : {
          await retrieveAccount(inputData);
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
  async function sendToServer(response, inputData) {
    response.reqNo = inputData.reqNo;
    conn.write(JSON.stringify(response));
  }

  //==================== After this will be codes that access to physical database ====================

  //Create user account (student or teacher).
  //data.type should state clearly if it is STUDENT_DETAILS or TEACHER_DETAILS
  async function createAccount(inputData){
    var data = inputData.data;
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
            var response = {
              data : {
                success : false,
                message : error
              }
            }
            sendToServer(response, inputData);
          }

          if(result.length === 0){
            console.log("[Email available]");

            var query = connection.query("INSERT INTO user_account SET ?", dataAccount, function(error, result){
              if(error){
                console.error('[Error in query]: ' + error);
                var response = {
                  data : {
                    success : false,
                    message : error
                  }
                }
                sendToServer(response, inputData);
              }
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
            var response = {
              data : {
                success : true,
                message : "Account Created"
              }
            }
            sendToServer(response, inputData);
          }
          else{
            console.log("[Username or Email have been taken]");
            //TODO: return error to server
            var response = {
              data : {
                success : false,
                message : "Username or Email have been taken"
              }
            }
            sendToServer(response, inputData);
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
        var response = {
          data : {
            success : false,
            message : error
          }
        }
        sendToServer(response, inputData);
      }
    });
  }

  //Check if account exist or not
  //Check if password input is correct
  //If correct, user personal data will be retrieved from database
  //Else no personal data will be sent
  async function retrieveAccount(inputData){
    var data = inputData.data;
    await handleDb.handleEncryption(data.account)
    .then(dataAccount => {
      console.log(dataAccount);
      var query = connection.query(
        "SELECT user_id, password_hash, salt FROM user_account\
        WHERE email = " + connection.escape(dataAccount.username) +
        " OR username = " + connection.escape(dataAccount.username),
        function(err, result){
          if(err){
            console.error('[Error in query]: ' + err);
            var response = {
              data : {
                success : false,
                message : err
              }
            }
            sendToServer(response, inputData);
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
                    if(err){
                      console.error('[Error in query]: ' + err);
                      var response = {
                        data : {
                          success : false,
                          message : err
                        }
                      }
                      sendToServer(response, inputData);
                    }
                    if(result.length === 1){
                      handleDb.handleDecryption(result)
                      .then(resultOut => {
                        objOutResult = {
                          data : resultOut
                        }
                        sendToServer(objOutResult, inputData);
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
                        if(err){
                          console.error('[Error in query]: ' + err);
                          var response = {
                            data : {
                              success : false,
                              message : err
                            }
                          }
                          sendToServer(response, inputData);
                        }
                        if(result.length === 1){
                          handleDb.handleDecryption(result)
                          .then(resultOut => {
                            objOutResult = {
                              data : resultOut
                            }
                            sendToServer(objOutResult, inputData);
                          })
                          .catch(reason => {
                            console.log(reason);
                          });
                        }
                        else if(result.length === 0){
                          console.log("[No related data found]");
                          //TODO: Send error message to server
                          var response = {
                            data : {
                              success : false,
                              message : "No such user"
                            }
                          }
                          sendToServer(response, inputData);
                        }
                        else{
                          console.log("[Duplicate user_id, Entity integrity compromise]");
                          //TODO: Send error message to server
                          var response = {
                            data : {
                              success : false,
                              message : "Duplicate user_id"
                            }
                          }
                          sendToServer(response, inputData);

                        }
                      });
                    }
                    else{
                      console.log("[Duplicate user_id, Entity integrity compromise]");
                      //TODO: Send error message to server
                      var response = {
                        data : {
                          success : false,
                          message : "Duplicate user_id"
                        }
                      }
                      sendToServer(response, inputData);
                    }
                  });
                }
                else {
                  console.log("[Password Incorrect]");
                  //TODO: Send error message to server
                  var response = {
                    data : {
                      success : false,
                      message : "Password Incorrect"
                    }
                  }
                  sendToServer(response, inputData);
                }
              })
              .catch(reason => {
                console.log(reason);
              });
          }
          else{
            console.log("[No such user found]");
            //TODO: return error to server
            var response = {
              data : {
                success : false,
                message : "No such user"
              }
            }
            sendToServer(response, inputData);
          }
        }
      );
    })
    .catch(reason => {
      console.log(reason);
    });
  }

  //Create quiz and add to database accordinly
  async function createQuiz(inputData){
    var data = inputData.data;
    data.quiz.date_created = new Date();
    var query = connection.query("INSERT INTO quiz SET ?", data.quiz, function(error, result){
      if(error){
        console.error('[Error in query]: ' + error);
        var response = {
          data : {
            success : false,
            message : error
          }
        }
        sendToServer(response, inputData);
      }

      console.log('[Query successful]');
      var quizId = result.insertId; //Get the quizId form quiz

      data.question.forEach(function(question){
        addQuestion(question, data, quizId, inputData);
      });
      var response = {
        data : {
          success : true,
          message : "Quiz Created"
        }
      }
      sendToServer(response, inputData);
    });

  }

  //Function will be called by createQuiz(), addQuestion will be called repeatedly until all question is stored.
  async function addQuestion(questionData, data, quizId, inputData){
    questionData.quiz_id = quizId;
    await handleDb.handleEncryption(questionData)
    .then(questionDataOut => {
      var query = connection.query("INSERT INTO quiz_question SET ?", questionDataOut, function(error, result){
        if(error){
          console.error('[Error in query]: ' + error);
          var response = {
            data : {
              success : false,
              message : error
            }
          }
          sendToServer(response, inputData);
        }

        var questionId = result.insertId; // Get the questionId from the question
        //If question is a MCQ, addChoice function will be called to store the MCQ choices
        if(questionData.type == C.DB.QUESTION_TYPE.MCQ){
          addChoices(data.choices, questionId, questionData.question_no, inputData);
        }
      });
    })
  }

  //Search for matching questionNo, and then store the data accordingly
  async function addChoices(choiceData, questionId, questionNo, inputData){
    choiceData.question_id = questionId;
    for(let choice of choiceData){
      if(choice.question_no == questionNo){
        choice.question_id = questionId;
        await handleDb.handleEncryption(choice)
        .then(choiceDataOut => {
          var query = connection.query("INSERT INTO quiz_question_choices SET ?", choiceDataOut, function(error, result){
            if(error){
              console.error('[Error in query]: ' + error);
              var response = {
                data : {
                  success : false,
                  message : error
                }
              }
              sendToServer(response, inputData);
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
  async function searchQuiz(inputData){
    var data = inputData.data;
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
              objResult = {
                data : result
              }
            sendToServer(objResult, inputData);
    			} else {
            var response = {
              data : {
                success : false,
                message : err
              }
            }
            sendToServer(response, inputData);
    			}
    	});
    });
  }

  //Retrieve every questions corresponding to the quiz specifed (quizId)
  //If question type is a short ans, choice_arr will be null
  async function retrieveQuestions(inputData){
    var quizId = inputData.data.quizId;
    var query = connection.query("SELECT quiz_question.quiz_id, quiz_question.type, quiz_question.prompt, quiz_question.solution, quiz_question.time, quiz_question_choices.choices\
    FROM quiz_question\
    LEFT OUTER JOIN quiz_question_choices\
      ON quiz_question.question_id = quiz_question_choices.question_id\
    WHERE quiz_question.quiz_id = '" + quizId + "'\
    ORDER BY quiz_question.question_no",
    async function(err, result, fields){
  			if (!err) { //result = data recieve from database
          handleDb.handleDecryption(result)
          .then(outPlainResult => {
            handleDb.handleRecieveQuestion(outPlainResult)
            .then(outResult => {
              objOutResult = {
                data : outResult
              }
              sendToServer(objOutResult, inputData);
            })
            .catch(reason => {
              console.log(reason);
            });
          })
          .catch(reason => {
            console.log(reason);
          });
  			} else {
          console.error('[Error in query]: ' + err);
          var response = {
            data : {
              success : false,
              message : err
            }
          }
          sendToServer(response, inputData);
  			}
  	});
  }

  async function createLogQuiz(data){
    data.log_quiz.date = new Date();
    var query = connection.query("INSERT INTO log_quiz SET ?", data.log_quiz, function(error, result){
      if(error){
        console.error('[Error in query]: ' + error);
        return;
      }

      console.log('[Query successful]');
      var quizId = result.insertId; //Get the quizId form quiz

      data.log_question.forEach(function(logQuestion){
        addQuestion(logQuestion, data, quizId);
      });
    });
  }

  async function addLogQuestion(logQuestion, data, quizId){
    logQuestion.log_quiz_id = quizId;
    // console.log(questionData);
    await handleDb.handleEncryption(logQuestion)
    .then(logQuestionDataOut => {
      console.log(questionDataOut);
      var query = connection.query("INSERT INTO quiz_question SET ?", logQuestionDataOut, function(error, result){
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
});

console.log("Listening on port 7070");
server.listen(7070);
