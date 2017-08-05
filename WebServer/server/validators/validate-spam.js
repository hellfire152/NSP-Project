/**
  Test file for validating the test version of the adding questions

  Author: Chloe
*/

const uuid = require('uuid');
module.exports = function(appConn, C) {
  return function(req, res) {

    var userIP = req.connection.remoteAddress;
    var botCheck = req.body._bot;

    appConn.send({
      // 'type':C.REQ_TYPE.ACCOUNT_LOGIN,
      'type':C.REQ_TYPE.DATABASE,
      'data': {
        type : C.DB.SELECT.BANNED_IP,
        ip_address : userIP
      }
    }, (checkBannedResponse) => {
      if(checkBannedResponse.data.success){ //IP banned
        res.end()
      }
      else{
        if(botCheck !== ''){
          console.log("BOT DETECTED");
          appConn.send({
            // 'type':C.REQ_TYPE.ACCOUNT_LOGIN,
            'type':C.REQ_TYPE.DATABASE,
            'data': {
              type : C.DB.CREATE.BANNED_IP,
              ip_address : userIP
            }
          }, (response) => {
            res.end()
          });
        }
        else{
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
      }
    });
  }
};
