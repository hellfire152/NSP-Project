const uuid = require('uuid');
module.exports = function(appConn, C) {
  return function(req, res){

    var userIP = req.connection.remoteAddress;
    var botCheck = req.body._bot;
    var search = req.body.search;

    req.sanitize('search').escape();
    req.sanitize('botCheck').escape();

    appConn.send({
      // 'type':C.REQ_TYPE.ACCOUNT_LOGIN,
      'type':C.REQ_TYPE.DATABASE,
      'data': {
        type : C.DB.SELECT.BANNED_IP,
        ip_address : userIP
      }
    }, (checkBannedResponse) => {
      if(checkBannedResponse.data.success){ //IP banned
        res.sendErrorPage("IP BLOCKED PLEASE CONTACT ADMIN");
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
            res.sendErrorPage("IP BLOCKED PLEASE CONTACT ADMIN");
          });
        }
        else{
          //encode search
          var url = '/search?search='+search;
          res.redirect(url)
        }
      }
    });

  }
}

function validLoginSession(req) {
  req.session.validLogin = true;
  req.session.username = req.body.username;
}
