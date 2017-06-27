/**
  Test file for validating the test version of the room creating.

  Author: Chloe
*/

const uuid = require('uuid');
module.exports = function(cipher, appConn, C) {
  return function(req, res) {
    // console.log(cipher);

    // check name + description not empty, ' ' -> id
    req.checkBody('nameofQuiz', 'Name of quiz must be specified').notEmpty().isString;
    req.checkBody('desc', 'Description must be specified').notEmpty().isString;

    req.sanitize('desc').escape();
    req.sanitize('nameofQuiz').escape();
    req.sanitize('desc').trim();
    req.sanitize('nameofQuiz').trim();

    var errors = req.validationErrors();

    if(errors) {


    } else {
      var nameofQuiz = req.body.nameofQuiz;
      var desc = req.body.desc;
      console.log("Creating a quiz data: ");
      console.log(req.body);

      //the undefined cases: password' 123' there
        res.redirect('/create-quiz?nameofQuiz=' +req.body.nameofQuiz);
        appConn.write(JSON.stringify({ //AppServer does verification
          'type': C.REQ_TYPE.CREATE_QUIZ,
          'name': nameofQuiz,
          'description': desc
        }));
      }
    };
}
