/*
  Add data recieve from app server and store to respecitve table in the database.
  Note: only app server will have direct access to database for security purpose
  TODO: All data in the database will be encrypted with AES256 encryption

  Database server port: 7070

  Author: Nigel Chen Chin Hao
  Date: 09062017
 */
process.on('uncaughtException', (err) => {
  console.log(err);
})
var mysql = require('mysql');
var handleDb = require("./data-handle.js")();
const C = require('../custom-API/constants.json');
var net = require('net');
var Promise = require('promise');
//Create connection between app and database
var connection = mysql.createConnection({
  host: 'localhost',
  // user: 'user',
  // password: 'eH7nKNVoeedg7gGZ',
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
      console.log(inputData.data);
      console.log("DB TYPE: " + inputData.data.type);
      switch(inputData.data.type) {
        case C.DB.CREATE.STUDENT_ACC :
        case C.DB.CREATE.TEACHER_ACC : {
          await createAccount(inputData);
          break;
        }
        case C.DB.CREATE.QUIZ : {
          await createQuiz(inputData);
          console.log(inputData);
          break;
        }
        case C.DB.SELECT.ALL_QUIZ : {
          await retrieveAllQuiz();
          break;
        }
        case C.DB.SELECT.QUESTION : {
          await retrieveQuestions(inputData);
          break;
        }
        case C.DB.SELECT.SEARCH_QUIZ : {
          await searchQuiz(inputData);
          break;
        }
        case C.DB.SELECT.USER_ACCOUNT : {
          await retrievePreAccount(inputData);
          break;
        }
        case C.DB.UPDATE.PASSWORD : {
          await updatePassword(inputData);
          break;
        }
        case C.DB.UPDATE.QUIZ : {
          await updateQuiz(inputData);
          break;
        }
        case C.DB.DELETE.ACCOUNT : {
          await deleteAccount(inputData);
          break;
        }
        case C.DB.UPDATE.QUESTION : {
          await updateQuestion(inputData);
          break;
        }
        case C.DB.UPDATE.USERNAME : {
          await updateUsername(inputData);
          break;
        }
        case C.DB.UPDATE.NAME : {
          await updateName(inputData);
          break;
        }
        case C.DB.UPDATE.ABOUT_ME : {
          await updateAboutMe(inputData);
          break;
        }
        case C.DB.UPDATE.SCHOOL : {
          await updateSchool(inputData);
          break;
        }
        case C.DB.UPDATE.STUDENT_CATEGORY : {
          await updateStudentCategory(inputData);
          break;
        }
        case C.DB.UPDATE.ORGANISATION : {
          await updateOrganisation(inputData);
          break;
        }
        case C.DB.DELETE.QUIZ : {
          await deleteQuiz(inputData);
          break;
        }
        case C.DB.SELECT.RETRIEVE_USER_DETAILS : {
          await retrieveUserDetails(inputData);
          break;
        }
        case C.DB.DELETE.QUESTION : {
          await deleteQuestion(inputData);
          break;
        }
        case C.DB.SELECT.FULL_USER_ACCOUNT : {
          await retrieveFullAccount(inputData);
          break;
        }
        case C.DB.CREATE.IP_ADDRESS : {
          await addIpAddress(inputData);
          break;
        }
        default : {
          var response = {
            data : {
              success : false,
              reason : C.ERR.DB_NO_SUCH_FUNCTION,
              message : "Not one of the cases"
            }
          }
          sendToServer(response, inputData);
        }
        //ADD MORE CASES HERE
      }
      // response.reqNo = data.reqNo;
      // sendToServer(response);
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

 // ================================ACCOUNT REALTED SQL ===========================
  //Create user account (student or teacher).
  //data.type should state clearly if it is STUDENT_DETAILS or TEACHER_DETAILS
  async function createAccount(inputData){
    var data = inputData.data;
    await handleDb.handlePassword(data) //TODO: Will shift handlePassword lower, so it will be faster to check email availability
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
                reason : C.ERR.DB_SQL_QUERY,
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
                    reason : C.ERR.DB_SQL_QUERY,
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
                reason : ERR.DB_USERNAME_TAKEN,
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
            reason : C.ERR.DB_SQL_QUERY,
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
  async function retrievePreAccount(inputData){
    var data = inputData.data;
    data.account.email = data.account.username; // seperate email and username to provide encryption for email
    await handleDb.handleEncryption(data.account)
    .then(dataAccount => {
      var query = connection.query(
        "SELECT user_id, password_hash, salt FROM user_account\
        WHERE email = " + connection.escape(dataAccount.email) +
        " OR username = " + connection.escape(dataAccount.username),
        function(err, result){
          if(err){
            console.error('[Error in query]: ' + err);
            var response = {
              data : {
                success : false,
                reason : C.ERR.DB_SQL_QUERY,
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
                  var query = connection.query("SELECT user_account.user_id, ip_address\
                    FROM user_account\
                    LEFT OUTER JOIN new_device\
                    ON user_account.user_id = new_device.user_id\
                    WHERE user_account.user_id = " + connection.escape(dataOut.userId),
                  function(err, result){
                    if(err){
                      console.error('[Error in query]: ' + err);
                      var response = {
                        data : {
                          success : false,
                          reason : C.ERR.DB_SQL_QUERY,
                          message : err
                        }
                      }
                      sendToServer(response, inputData);
                    }
                      handleDb.handleDecryption(result)
                      .then(resultOut => {

                        var ipAddressArr = [];
                        resultOut.forEach(function(obj){
                          ipAddressArr.push(obj.ip_address);
                        });

                        objOutResult = {
                          data:{
                            data : {
                              user_id : resultOut[0].user_id,
                              ip_address : ipAddressArr
                            },
                            success : true
                          }
                        }
                        sendToServer(objOutResult, inputData);
                      })
                      .catch(reason => {
                        console.log(reason);
                      });
                  });
                }
                else {
                  console.log("[Password Incorrect]");
                  //TODO: Send error message to server
                  var response = {
                    data : {
                      success : false,
                      reason : C.ERR.DB_PASSWORD_INCORRECT,
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
                reason : C.ERR.DB_NO_SUCH_USER,
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

  async function retrieveFullAccount(inputData){
    var data = inputData.data
    console.log("HERE");
    console.log(data.user_id);
    var query = connection.query("SELECT user_account.user_id, user_account.name, user_account.username, user_account.email, student_details.student_id, student_details.date_of_birth, student_details.school\
      FROM user_account\
      LEFT OUTER JOIN student_details\
      ON user_account.user_id = student_details.user_id\
      WHERE student_details.user_id = " + connection.escape(data.user_id),
    function(err, result){
      if(err){
        console.error('[Error in query]: ' + err);
        var response = {
          data : {
            success : false,
            reason : C.ERR.DB_SQL_QUERY,
            message : err
          }
        }
        sendToServer(response, inputData);
      }
      if(result.length === 1){ // Student User
        handleDb.handleDecryption(result)
        .then(resultOut => {
          objOutResult = {
            data:{
              data : resultOut,
              success : true
            }
          }
          sendToServer(objOutResult, inputData);
        })
        .catch(reason => {
          console.log(reason);
        });
      }
      else if(result.length === 0){ //Check Teacher user
        var query = connection.query("SELECT user_account.user_id, user_account.name, user_account.username, user_account.email, teacher_details.teacher_id, teacher_details.organisation\
          FROM user_account\
          LEFT OUTER JOIN teacher_details\
          ON user_account.user_id = teacher_details.user_id\
          WHERE teacher_details.user_id = " + connection.escape(dataOut.userId),
        function(err, result){
          if(err){
            console.error('[Error in query]: ' + err);
            var response = {
              data : {
                success : false,
                reason : C.ERR.DB_SQL_QUERY,
                message : err
              }
            }
            sendToServer(response, inputData);
          }

          if(result.length === 1){
            handleDb.handleDecryption(result)
            .then(resultOut => {
              objOutResult = {
                data:{
                  data : resultOut,
                  success : true
                }
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
                reason : C.ERR.DB_NO_SUCH_USER,
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
                reason : C.ERR.DB_DUPLICATE_USER_ID,
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
            reason : C.ERR.DB_DUPLICATE_USER_ID,
            message : "Duplicate user_id"
          }
        }
        sendToServer(response, inputData);

      }
    });
  }

  async function addIpAddress(inputData){
    var data = inputData.data;
    await handleDb.handleHashIP(data)
    .then(dataOut => {
      var query = connection.query("INSERT INTO new_device SET ?", dataOut.inputData, function(error, result){
        if(error){
          var response = {
            data : {
              success : false,
              reason : C.ERR.DB_SQL_QUERY,
              message : error
            }
          }
          sendToServer(response, inputData);
        }
        else{
          var response = {
            data : {
              success : true,
              data : {
                hashedIpAddress : dataOut.inputData.ip_address
              }
            }
          }
          sendToServer(response, inputData);
        }
      });
    });
  }


  async function retrieveUserDetails(inputData){
    var data = inputData.data;
    await handleDb.handleEncryption(data)
    .then(dataOut => {
      var query = connection.query("SELECT user_id FROM user_account WHERE username = ? AND email = ?", [dataOut.username, dataOut.email], function(error, result){
        if(error){
          var response = {
            data : {
              success : false,
              reason : C.ERR.DB_SQL_QUERY,
              message : error
            }
          }
          sendToServer(response, inputData);
        }
        if(result.length === 0){
          var response = {
            data : {
              success : false,
              reason : C.ERR.DB_INCORRECT_INPUT,
              message : "Incorrect username or email"
            }
          }
          sendToServer(response, inputData);
        }
        else if(result.length === 1){
          var response = {
            data : {
              success : true,
              message : "Input correct"
            }
          }
          sendToServer(response, inputData);
        }
        else{
          var response = {
            data : {
              success : false,
              reason : C.ERR.DB_UNKNOWN,
              message : "Something not right"
            }
          }
          sendToServer(response, inputData);
        }
      });
    });
  }

  //Update password,
  //New salt will be generated and hash accordingly.
  //All new data will be encrypted.
  async function updatePassword(inputData){
    var data = inputData.data;
    var query = connection.query("SELECT salt FROM user_account WHERE user_id = " + connection.escape(data.verify.user_id), function(error, result){
      if(error){
        console.error('[Error in query]: ' + error);
        var response = {
          data : {
            success : false,
            reason : C.ERR.DB_SQL_QUERY,
            message : error
          }
        }
        sendToServer(response, inputData);
      }
      handleDb.handleDecryption(result)
      .then(decryptSalt => {
        data.verify.salt = decryptSalt[0].salt;
        handleDb.handleHashPass(data)
        .then(dataOut =>{
          // console.log(dataOut);
          delete data.verify.salt;
          handleDb.handleEncryption(dataOut.verify)
          .then(dataOutEncrypted => {
            dataOut.verify = dataOutEncrypted;
            dataOut.account.user_id = dataOut.verify.user_id;
            var query = connection.query("SELECT username FROM user_account\
              WHERE user_id = " + connection.escape(dataOut.verify.user_id) + " AND password_hash = " + connection.escape(dataOut.verify.password_hash), function(error, result){
              if(error){
                console.error('[Error in query]: ' + error);
                var response = {
                  data : {
                    success : false,
                    reason : C.ERR.DB_SQL_QUERY,
                    message : error
                  }
                }
                sendToServer(response, inputData);
              }
              if(result.length === 1){
                handleDb.handlePassword(dataOut)
                .then(dataAccount => {
                  handleDb.handleEncryption(dataAccount.account)
                  .then(dataAccountEncrypt => {
                    var query = connection.query("UPDATE user_account SET password_hash = " + connection.escape(dataAccountEncrypt.password_hash) + " , salt = " + connection.escape(dataAccountEncrypt.salt) +
                    " WHERE user_id = " + connection.escape(dataAccountEncrypt.user_id), function(error, result){
                      if(error){
                        console.error('[Error in query]: ' + error);
                        var response = {
                          data : {
                            success : false,
                            reason : C.ERR.DB_SQL_QUERY,
                            message : error
                          }
                        }
                        sendToServer(response, inputData);
                      }
                      var response = {
                        data : {
                          success : true,
                          message : "Password updated"
                        }
                      }
                      sendToServer(response, inputData);
                    });
                  });
                });
              }
              else {
                var response = {
                  data : {
                    success : false,
                    reason : C.ERR.DB_PASSWORD_INCORRECT,
                    message : "Incorrect password"
                  }
                }
                sendToServer(response, inputData);
              }
            });
          });
        });
      });
    });
  }

  async function updateName(inputData){
    data = inputData.data;
    handleDb.handleEncryption(data)
    .then(dataOut => {
      var query = connection.query("UPDATE user_account SET name = " + connection.escape(dataOut.name) +
      "WHERE user_id = " + connection.escape(dataOut.user_id), function(error, result){
        if(error){
          var response = {
            data : {
              success : false,
              reason : C.ERR.DB_SQL_QUERY,
              message : error
            }
          }
          sendToServer(response, inputData);
        }
        var response = {
          data : {
            success : true,
            message : "Name updated"
          }
        }
        sendToServer(response, inputData);
      });
    });
  }

  async function updateAboutMe(inputData){
    data = inputData.data;
    console.log(data);
    handleDb.handleEncryption(data)
    .then(dataOut => {
      var query = connection.query("UPDATE user_account SET about_me = " + connection.escape(dataOut.about_me) +
      "WHERE user_id = " + connection.escape(dataOut.user_id), function(error, result){
        console.log("COMPLETED");
        if(error){
          var response = {
            data : {
              success : false,
              reason : C.ERR.DB_SQL_QUERY,
              message : error
            }
          }
          sendToServer(response, inputData);
        }
        var response = {
          data : {
            success : true,
            message : "About me updated"
          }
        }
        sendToServer(response, inputData);
      });
    });
  }

  async function updateUsername(inputData){
    data = inputData.data;

    var query = connection.query("SELECT username FROM user_account\
    WHERE username = " + connection.escape(data.username), function(error, result){
      if(error){
        var response = {
          data : {
            success : false,
            reason : C.ERR.DB_SQL_QUERY,
            message : error
          }
        }
        sendToServer(response, inputData);
      }
      if(result.length == 0){
        var query = connection.query("UPDATE user_account SET username = " + connection.escape(data.username)+
        "WHERE user_id = " + connection.escape(data.user_id), function(error, result){
          if(error){
            var response = {
              data : {
                success : false,
                reason : C.ERR.DB_SQL_QUERY,
                message : error
              }
            }
            sendToServer(response, inputData);
          }
          else{
            var response = {
              data : {
                success : true,
                message : "Username updated"
              }
            }
            sendToServer(response, inputData);
          }
        })
      }
      else{
        var response = {
          data : {
            success : false,
            reason : C.ERR.DB_USERNAME_TAKEN,
            message : "Username taken"
          }
        }
        sendToServer(response, inputData);
      }
    });
  }

  async function updateSchool(inputData){
    var data = inputData.data;
    handleDb.handleEncryption(data)
    .then(dataOut => {
      var query = connection.query("UPDATE student_details SET school = " + connection.escape(dataOut.school) +
      "WHERE student_id = " + connection.escape(dataOut.student_id), function(error, result){
        if(error){
          var response = {
            data : {
              success : false,
              reason : C.ERR.DB_SQL_QUERY,
              message : error
            }
          }
          sendToServer(response, inputData);
        }
        var response = {
          data : {
            success : true,
            message : "School updated"
          }
        }
        sendToServer(response, inputData);
      });
    });
  }

  async function updateStudentCategory(inputData){
    var data = inputData.data;
    handleDb.handleEncryption(data)
    .then(dataOut => {
      var query = connection.query("UPDATE student_details SET student_category = " + connection.escape(dataOut.student_category) +
      "WHERE student_id = " + connection.escape(dataOut.student_id), function(error, result){
        if(error){
          var response = {
            data : {
              success : false,
              reason : C.ERR.DB_SQL_QUERY,
              message : error
            }
          }
          sendToServer(response, inputData);
        }
        var response = {
          data : {
            success : true,
            message : "Student Category updated"
          }
        }
        sendToServer(response, inputData);
      });
    });
  }

  async function updateOrganisation(inputData){
    var data = inputData.data;
    handleDb.handleEncryption(data)
    .then(dataOut => {
      var query = connection.query("UPDATE teacher_details SET organisation = " + connection.escape(dataOut.organisation) +
      "WHERE teacher_id = " + connection.escape(dataOut.teacher_id), function(error, result){
        if(error){
          var response = {
            data : {
              success : false,
              reason : C.ERR.DB_SQL_QUERY,
              message : error
            }
          }
          sendToServer(response, inputData);
        }
        var response = {
          data : {
            success : true,
            message : "Organisataion updated"
          }
        }
        sendToServer(response, inputData);
      });
    });
  }

  async function deleteAccount(inputData){
    var data = inputData.data;
    var query = connection.query("SELECT salt\
    FROM user_account\
    WHERE user_id = " + connection.escape(data.account.user_id), function(error, result){
      if(error){
        var response = {
          data : {
            success : false,
            reason : C.ERR.DB_SQL_QUERY,
            message : error
          }
        }
        sendToServer(response, inputData);
      }
      if(result.length === 0){
        var response = {
          data : {
            success : false,
            reason : C.ERR.DB_NO_SUCH_USER,
            message : "No such user id"
          }
        }
        sendToServer(response, inputData);
      }
      else{
        data.salt = result[0].salt;
        handleDb.handleDeleteAccount(data)
        .then(dataOut =>{
            handleDb.handleEncryption(dataOut.account)
            .then(dataOutEncrypted => {
              var query = connection.query("DELETE FROM user_account\
              WHERE user_id = " + connection.escape(dataOutEncrypted.user_id) +
              " AND (email = " + connection.escape(dataOutEncrypted.email) + " OR username = " + connection.escape(dataOutEncrypted.username) + " )\
              AND password_hash = " +connection.escape(dataOutEncrypted.password_hash), function(error, result){
                if(error){
                  var response = {
                    data : {
                      success : false,
                      reason : C.ERR.DB_SQL_QUERY,
                      message : error
                    }
                  }
                  sendToServer(response, inputData);
                }
                if(result.affectedRows === 1){
                  var response = {
                    data : {
                      success : true,
                      message : "Account deleted successfully"
                    }
                  }
                  sendToServer(response, inputData);
                }
                else if(result.affectedRows === 0){
                  var response = {
                    data : {
                      success : false,
                      reason : C.ERR.DB_INCORRECT_INPUT,
                      message : "Incorrect password, username or email"
                    }
                  }
                  sendToServer(response, inputData);
                }
                else {
                  var response = {
                    data : {
                      success : false,
                      reason : C.ERR.DB_TWO_OR_MORE_ACCOUNT_DELETED,
                      message : "Critical, 2 account been deleted"
                    }
                  }
                  sendToServer(response, inputData);
                }
              });
            });
        });
      }
    });
  }

//============================ QUIZ RELATED SQL ===========================

  //Create quiz and add to database accordinly
  async function createQuiz(inputData){
    var data = inputData.data;
    data.quiz.date_created = new Date();
    console.log("Eadfhjhgfyuiudahfycohasdkgiofhcuds");
    console.log(data.quiz);
    var query = connection.query("INSERT INTO quiz SET ?", data.quiz, function(error, result){
      console.log(query);
      if(error){
        console.error('[Error in query]: ' + error);
        var response = {
          data : {
            success : false,
            reason : C.ERR.DB_SQL_QUERY,
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
              reason : C.ERR.DB_SQL_QUERY,
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
                  reason : C.ERR.DB_SQL_QUERY,
                  message : error
                }
              }
              sendToServer(response, inputData);
            }

            console.log('[Query successful]');
          });
        });
      }
    }
  }

  //Retrieve all the quiz available in the database
  async function retrieveAllQuiz(){
    var query = connection.query('SELECT * FROM quiz ORDER BY date_created DESC', function(err, result, fields){
  			if (err) {
          var response = {
            data : {
              success : false,
              reason : C.ERR.DB_SQL_QUERY,
              message : error
            }
          }
          sendToServer(response, inputData);
  			}
        if(result.length == 0){
          var response = {
            data : {
              success : false,
              reason : C.ERR.DB_NO_QUIZ_AVAILAVLE,
              message : "No quiz available"
            }
          }
          sendToServer(response, inputData);
        }
        else{
          resultOut = {
            data:{
              data : result,
              success : true
            }
          }
          sendToServer(resultOut, inputData);
        }
  	});
  }
  async function updateQuiz(inputData){
    var data = inputData.data.quiz;
    var queryStatment = "UPDATE quiz SET ";
    if(data.quiz_title != undefined){
      queryStatment += "quiz_title = " + connection.escape(data.quiz_title);
    }
    if(data.description != undefined){
      queryStatment += ", description = " + connection.escape(data.description);
    }
    if(data.visibility != undefined){
      queryStatment += ", visibility = " + connection.escape(data.visibility);
    }

    queryStatment += " WHERE quiz_id = " + connection.escape(data.quiz_id);

    connection.query(queryStatment, function(err, result){
      if(err){
        var response = {
          data : {
            success : false,
            reason : C.ERR.DB_SQL_QUERY,
            message : error
          }
        }
        sendToServer(response, inputData);
      }
      else{
        var response = {
          data : {
            success : true,
            message : "Quiz Updated"
          }
        }
        sendToServer(response, inputData);
      }
    });
  }

  async function updateQuestion(inputData){
    var data = inputData.data;
    await handleDb.handleEncryption(data.changes)
    .then(dataChangesOut => {
      var query = connection.query(
        "UPDATE quiz_question\
        JOIN quiz_question_choices\
        ON quiz_question.question_id = quiz_question_choices.question_id\
        SET ?\
        WHERE quiz_question.question_id = " + connection.escape(data.questionId), dataChangesOut, function(err, result){
          if(err){
            var response = {
              data : {
                success : false,
                reason : C.ERR.DB_SQL_QUERY,
                message : error
              }
            }
            sendToServer(response, inputData);
          }
          if(result.affectedRows == 0){
            var response = {
              data : {
                success : false,
                reason : C.ERR.DB_QUESTION_ID_NOT_FOUND,
                message : "Question ID not found"
              }
            }
            sendToServer(response, inputData);
          }
          else if(result.affectedRows == 2){
            var response = {
              data : {
                success : true,
                message : "Question Updated"
              }
            }
            sendToServer(response, inputData);
          }
          else {
            var response = {
              data : {
                success : false,
                reason : C.ERR.DB_UNKNOWN,
                message : "Something not right"
              }
            }
            sendToServer(response, inputData);
          }
        });
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
                reason : C.ERR.DB_SQL_QUERY,
                message : error
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
    var quizInfo;
    var query = connection.query("SELECT quiz.reward, user_account.name, quiz.date_created, quiz.visibility, quiz.description\
    FROM quiz\
    LEFT OUTER JOIN user_account\
      ON user_account.user_id = quiz.user_id\
    WHERE quiz.quiz_id = '" + quizId + "'", function(err, result){
      if(err){
        var response = {
          data : {
            success : false,
            reason : C.ERR.DB_SQL_QUERY,
            message : error
          }
        }
        sendToServer(response, inputData);
      }

      handleDb.handleDecryption(result)
      .then(resultOut => {
        quizInfo = resultOut[0]; //A really lazy way, but it works
      });
    });

    var query = connection.query("SELECT quiz_question.type, quiz_question.prompt, quiz_question.solution, quiz_question.time, quiz_question_choices.choices, quiz_question.reward, quiz_question.penalty\
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
                data:{
                  data : {
                    id : quizId,
                    question : outResult,
                    reward : quizInfo.reward,
                    author : quizInfo.name,
                    creationDate : quizInfo.date_created,
                    'public' : quizInfo.visibility,
                    description : quizInfo.description
                  },
                  success : true
                }
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
              reason : C.ERR.DB_SQL_QUERY,
              message : err
            }
          }
          sendToServer(response, inputData);
  			}
  	});
  }

  async function deleteQuiz(inputData){
    var data = inputData.data;
    var query = connection.query("DELETE FROM quiz WHERE quiz_id = " + connection.escape(data.quiz_id), function(error, result){
      if(error){
        var response = {
          data : {
            success : false,
            reason : C.ERR.DB_SQL_QUERY,
            message : error
          }
        }
        sendToServer(response, inputData);
      }
      var response = {
        data : {
          success : true,
          message : "Quiz deleted successfully"
        }
      }
      sendToServer(response, inputData);
    });
  }

  async function deleteQuestion(inputData){
    var data = inputData.data;
    var query = connection.query("DELETE FROM quiz_question WHERE question_id = " + connection.escape(data.question_id), function(error, result){
      if(error){
        var response = {
          data : {
            success : false,
            reason : C.ERR.DB_SQL_QUERY,
            message : error
          }
        }
        sendToServer(response, inputData);
      }
      var response = {
        data : {
          success : true,
          message : "Question deleted successfully"
        }
      }
      sendToServer(response, inputData);
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
