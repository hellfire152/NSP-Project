/**
  Test file for validating the test version of the room creating.

  Author: Chloe
*/

const uuid = require('uuid');
module.exports = function(cipher, appConn) {
  return function(req, res) {
    console.log(cipher);

    // check description not empty
    req.checkBody('description', 'Description must be specified').notEmpty().isString;
    req.checkBody('name', 'Name of quiz must be specified').notEmpty().isString;

    req.sanitize('description').escape();
    req.sanitize('name').escape();
    req.sanitize('description').trim();
    req.sanitize('name').trim();

    var errors = req.validationErrors();

    if(errors) {


    } else {
      console.log("HOST FORM DATA: ");
      console.log(req.body);
      cipher.encryptJSON({
        "description": req.body.description,
        "name": req.body.name
      })
        .catch(function (err) {
          throw new Error('Error parsing JSON!');
        })
        .then(function(cookieData) {
        res.cookie('login', cookieData, {"maxAge": 1000*60*60}); //one hour
        res.redirect('/createquiz?name=' +req.body.name); // For example, if the application is on
        //http://example.com/admin/post/new, the following would redirect to the URL http://example.com/admin:
      });
    }
  }
}
