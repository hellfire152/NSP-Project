/**
  Test file for validating the test version of the adding questions

  Author: Chloe
*/

const uuid = require('uuid');
module.exports = function(appConn, C) {
  return function(req, res) {

    console.log(req.connection.remoteAddress);
    console.log(req.connection.remotePort);
    console.log(req.connection.localAddress);
    console.log(req.connection.localPort);

    var ip = req.ip || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
    console.log("HERE");
    console.log(ip);
    appConn.send({
      'type': C.REQ_TYPE.DATABASE,
      'data': {
        type : C.DB.CREATE.SPAM_AREA,
        info : {
          username : req.body.username,
          spam_text : req.body.spamText
        }
      }
    }, (response) => {
      res.redirect('/spam');
    });
  }
};
