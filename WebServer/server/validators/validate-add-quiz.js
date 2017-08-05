/**
  Test file for validating the test version of the adding questions

  Author: Chloe
*/

const uuid = require('uuid');
module.exports = function(cipher, appConn, C, cookieValidator) {
  return function(req, res) {

    var dataObj = JSON.parse(req.body.quizData);
    var botCheck = req.body._bot;
    var userIP = req.connection.remoteAddress;
    var userInfo = req.cookies.user_info;

    console.log(userInfo);

    appConn.send({
      // 'type':C.REQ_TYPE.ACCOUNT_LOGIN,
      'type':C.REQ_TYPE.DATABASE,
      'data': {
        type : C.DB.SELECT.BANNED_IP,
        ip_address : userIP
      }
    }, (checkBannedResponse) => {
      if(checkBannedResponse.success){ //IP banned
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

          if(!cookieValidator.validateCookie(userInfo)){
            console.log("Cookie Modification detected");
            res.clearCookie("user_info");
            res.sendErrorPage("Cookie modification detected");
          }
          else{
            console.log("Data: ");
            dataObj.quiz.quiz_rating = 0; //Default
            dataObj.quiz.reward = parseInt(dataObj.quiz.reward);
            dataObj.quiz.user_id = userInfo.data.user_id;


              appConn.send({
                'type': C.REQ_TYPE.DATABASE,
                'data': {
                  type : C.DB.CREATE.QUIZ,
                  quiz : dataObj.quiz,
                  question : dataObj.question,
                  choices : dataObj.choices
                }
              }, (response) => {
                res.redirect('/CreateQuiz');
              });
          }
        }
      }
    });
      }
    };
