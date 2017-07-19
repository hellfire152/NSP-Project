/**
  Test file for validating the test version of the adding questions

  Author: Chloe
*/

const uuid = require('uuid');
module.exports = function(cipher, appConn, C) {
  return function(req, res) {

    // check name + description not empty, ' ' -> id
    // req.checkBody('prompt', 'Prompt must be specified').notEmpty().isString;
    // req.checkBody('shortAns', 'Solution must be specified').notEmpty().isString;
    //
    // req.sanitize('prompt').escape();
    // req.sanitize('shortAns').escape();
    // req.sanitize('prompt').trim();
    // req.sanitize('shortAns').trim();
    //

    console.log(req.body);
    var dataObj = JSON.parse(req.body.quizSet);

      console.log("Data: ");
      dataObj.quiz.quiz_rating = 0; //Default
      dataObj.quiz.reward = parseInt(dataObj.quiz.reward);
      dataObj.quiz.user_id = req.cookies.user_info.user_id;

      // cipher.encryptJSON({
      //
      //   "type": req.body.type,
      //   "prompt": req.body.prompt
      // })
      //   .catch(function (err) {
      //     throw new Error('Error parsing JSON!');
      //   })
      //   .then(function(cookieData) {
      //   res.cookie('login', cookieData, {"maxAge": 1000*60*60});
      // var prompt = req.body.prompt;
      // var type = req.body.type;
      // var choices = req.body.choices;
      // var solution = req.body.solution;
      // var shortAns = req.body.shortAns;
      // var time = req.body.time;
      // var reward = req.body.reward;
      // var penalty = req.body.penalty;
        // res.redirect('/add-question?prompt=' +req.body.prompt);
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
