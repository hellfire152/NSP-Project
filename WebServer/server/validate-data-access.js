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
