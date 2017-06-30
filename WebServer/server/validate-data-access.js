/**
  Test file for validating the test version of the room joining form.

  Author: Jin Kuan
*/

const uuid = require('uuid');
module.exports = function(cipher, appConn, C) {
  return function(req, res) {

    //TODO: Data validation

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
      console.log(inputData);

      cipher.encryptJSON(inputData)
        .catch(function (err) {
          throw new Error('Error parsing JSON!');
        })
        .then(function(encryptedDataReq) {
          console.log("DONE");
          console.log(encryptedDataReq);
          // res.encryptedDataReq = encryptedDataReq;
        res.cookie('encryptedDataReq', encryptedDataReq, {"maxAge": 1000*60});//one minutes
        res.redirect('/data');
      });
    }

  }
}
