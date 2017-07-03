/**
  Test file for validating the test version of the room joining form.

  Author: Jin Kuan
*/

const uuid = require('uuid');
module.exports = function(cipher, appConn, C) {
  return function(req, res) {

    //TODO: Data validation
    console.log(req.body.data);
    var errors = req.validationErrors();
    if(errors) {
      //TODO::Handle errors
    } else {
      var inputData;
      console.log("REQ.TYPE: " + req.body.dbType);
      if(req.body.dbType == "retrieveQuestion"){
        inputData = {
          data : {
            type : C.DB.SELECT.QUESTION,
            quizId : req.body.quizId
          }
        }
      }
      else if(req.body.dbType == "searchQuestion"){
        inputData = {
          data : {
            type : C.DB.SELECT.SEARCH_QUIZ,
            searchItem : req.body.search
          }
        }
      }
      else if(req.body.dbType == "accountLogin"){
        inputData = {
          data : {
            type : C.DB.SELECT.USER_ACCOUNT,
            account : {
              username : req.body.user,
              password : req.body.password
            }
          }
        }
      }
      else if(req.body.dbType == "createStudentAcc"){
        inputData = {
          data: {
            type : C.DB.CREATE.STUDENT_ACC,
            account : {
              email : req.body.email,
              password_hash : req.body.password,
              name : req.body.name,
              username : req.body.username
            },
            details :{
              school : req.body.school,
              date_of_birth : req.body.dob
            }
          }
        }
      }
      else if(req.body.dbType == "createTeacherAcc"){
        inputData = {
          data: {
            type : C.DB.CREATE.TEACHER_ACC,
            account : {
              email : req.body.email,
              password_hash : req.body.password,
              name : req.body.name,
              username : req.body.username
            },
            details :{
              organisation : req.body.organisation
            }
          }
        }
      }
      else if(req.body.dbType == "updatePassword"){
        inputData = {
          data : {
            type : C.DB.UPDATE.PASSWORD,
            verify : {
              user_id : req.body.userId,
              password_hash : req.body.oldPassword
            },
            account : {
              password_hash : req.body.newPassword
            }
          }
        }
      }
      else if(req.body.dbType == "updateQuiz"){
        inputData = {
          data : {
            type : C.DB.UPDATE.QUIZ,
            quiz : {
              quiz_title : req.body.quizTitle,
              description : req.body.quizDescription,
              visibility : false,
              quiz_id : req.body.quizId
            }
          }
        }
      }
      else if(req.body.dbType == "deleteAccount"){
        inputData = {
          data : {
            type : C.DB.DELETE.ACCOUNT,
            account : {
              user_id : req.body.userId,
              username : req.body.username,
              email : req.body.username,
              password : req.body.password
            }
          }
        }
      }
      else if(req.body.dbType == "updateQuestion"){
        inputData = {
          data : {
            type : C.DB.UPDATE.QUESTION,
            changes : {
              prompt : req.body.prompt,
              solution : req.body.solution,
              choices : req.body.choiceArr,
              time : req.body.time
            },
            questionId : req.body.questionId
          }
        }
      }

      cipher.encryptJSON(inputData)
        .catch(function (err) {
          throw new Error('Error parsing JSON!');
        })
        .then(function(encryptedDataReq) {
        res.cookie('encryptedDataReq', encryptedDataReq, {"maxAge": 1000*60});//one minutes
        res.redirect('/data');
      });
    }

  }
}
