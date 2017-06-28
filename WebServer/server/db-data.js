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
      cipher.encryptJSON({
        data : {
          type : C.DB.SELECT.QUESTION,
          quizId : req.body.quizId
        }
      })
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
