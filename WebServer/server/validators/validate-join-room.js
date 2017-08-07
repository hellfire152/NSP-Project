/**
  Test file for validating the test version of the room joining form.

  Author: Jin Kuan
*/

const uuid = require('uuid');
module.exports = function(cipher, appConn) {
  return function(req, res) {
    console.log("===Validate-Join-Room.js");
    if(req.session.validLogin) {
      req.checkBody('room', 'Room ID must be specified').notEmpty();

      req.sanitize('room').escape();
      req.sanitize('room').trim();

      req.session.joining = true;
      res.redirect(`/play?room=${req.body.room}`);
    } else {
      req.session.attemptJoin = req.body.room;
      res.redirect('/student-login');
    }
  }
}
