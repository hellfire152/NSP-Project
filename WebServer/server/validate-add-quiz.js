/**
  Test file for validating the test version of the adding questions

  Author: Chloe
*/

const uuid = require('uuid');
module.exports = function(cipher, appConn, C) {
  return function(req, res) {

    // check name + description not empty, ' ' -> id
    req.checkBody('nameofQuiz', 'Name of quiz must be specified').notEmpty().isString;
    req.checkBody('desc', 'Description must be specified').notEmpty().isString;
    req.checkBody('prompt', 'Prompt must be specified').notEmpty().isString;
    req.checkBody('shortAns', 'Solution must be specified').notEmpty().isString;

    req.sanitize('desc').escape();
    req.sanitize('nameofQuiz').escape();
    req.sanitize('desc').trim();
    req.sanitize('nameofQuiz').trim();
    req.sanitize('prompt').escape();
    req.sanitize('shortAns').escape();
    req.sanitize('prompt').trim();
    req.sanitize('shortAns').trim();


    var nameofQuiz = req.body.nameofQuiz;
    var desc = req.body.desc;
    var reward = req.body.reward;
    var penalty = req.body.penalty;
    var typeOfQuiz = req.body.typeOfQuiz;
    var prompt = req.body.prompt;
    var typeofQuestion = req.body.typeofQuestion;
    var choices = req.body.choices;
    var choiceAns = req.body.choiceAns;
    var shortAns = req.body.shortAns;
    var time = req.body.time;
    var reward = req.body.reward;
    var penalty = req.body.penalty;

      console.log("DATA: ");
      console.log(req.body);

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

        // res.redirect('/add-question?prompt=' +req.body.prompt);
        appConn.send({
          'create quiz': C.REQ_TYPE.CREATE_QUIZ,
          'nameofQuiz' : nameofQuiz,
          'desc' : desc,
          'reward' : reward,
          'penalty' : penalty,
          'typeOfQuiz' : typeOfQuiz,
          'add question': C.REQ_TYPE.ADD_QUESTION,
          'prompt' : prompt,
          'typeofQuestion' : typeofQuestion,
          'choices' : choices,
          'choiceAns' : choiceAns,
          'shortAns' : shortAns,
          'time' : time,
          'reward' : reward,
          'penalty' : penalty,

        }, (response) => {
          res.render('add-quiz', {
            'nameofQuiz' : nameofQuiz,
            'desc' : desc,
            'reward' : reward,
            'penalty' : penalty,
            'typeOfQuiz' : typeOfQuiz,
            'prompt' : prompt,
            'typeofQuestion' : typeofQuestion,
            'choiceAns' : choiceAns,
            'choices' : choices,
            'shortAns' : shortAns,
            'time' : time,
            'reward' : reward,
            'penalty' : penalty,
          });
        });
      }
    };
