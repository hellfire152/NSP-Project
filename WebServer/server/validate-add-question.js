/**
  Test file for validating the test version of the adding questions

  Author: Chloe
*/

const uuid = require('uuid');
module.exports = function(cipher, appConn) {
  return function(req, res) {
    console.log(cipher);

    // check name + description not empty, ' ' -> id
    req.checkBody('prompt', 'Prompt must be specified').notEmpty().isString;
    req.checkBody('solution', 'Solution must be specified').notEmpty().isString;

    req.sanitize('prompt').escape();
    req.sanitize('solution').escape();
    req.sanitize('prompt').trim();
    req.sanitize('solution').trim();

    console.log(req.body.prompt);
    console.log(req.body.type);
    console.log(req.body.choice);
    console.log(req.body.solution);
    console.log(req.body.time);
    console.log(req.body.reward);
    console.log(req.body.penalty);

    var errors = req.validationErrors();

    if(errors) {


    } else {
      console.log("HOST FORM DATA: ");
      console.log(req.body);
      cipher.encryptJSON({
        "desc": req.body.desc,
        "nameofQuiz": req.body.nameofQuiz
      })
        .catch(function (err) {
          throw new Error('Error parsing JSON!');
        })
        .then(function(cookieData) {
        res.cookie('login', cookieData, {"maxAge": 1000*60*60}); //one hour
        res.redirect('/add-question?prompt=' +req.body.prompt); // For example, if the application is on
        //http://example.com/admin/post/new, the following would redirect to the URL http://example.com/admin:
      });
    }
  }
}
