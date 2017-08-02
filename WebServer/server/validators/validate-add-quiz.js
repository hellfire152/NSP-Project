/**
  Test file for validating the test version of the adding questions

  Author: Chloe
*/

const uuid = require('uuid');
module.exports = function(cipher, appConn, C) {
  return function(req, res) {


    console.log(req.body);
    var dataObj = JSON.parse(req.body.quizSet);

      console.log("Data: ");
      dataObj.quiz.quiz_rating = 0; //Default
      dataObj.quiz.reward = parseInt(dataObj.quiz.reward);
      dataObj.quiz.user_id = req.cookies.user_info.user_id;


        appConn.send({
          'type': C.REQ_TYPE.DATABASE,
          'data': {
            type : C.DB.CREATE.QUIZ,
            quiz : dataObj.quiz,
            question : dataObj.question,
            choices : dataObj.choices
          }
        }, (response) => {
          res.redirect('add-quiz');
        });
      }
    };
