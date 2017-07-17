/*
  Includes functions that handles all GET or POST requests.

  Author: Jin Kuan
*/
var uuid;

var express = require('express');
var nodemailer = require('nodemailer');

module.exports = function(data) {
  let {app, dirname, cipher, appConn, queryOfUser, errors, cookieCipher, xssDefense}
    = data;
  const C = data.C;
  uuid = data.uuid;

  //validators
  var validators = {
    'data-access' : require('../validators/validate-data-access.js')(cookieCipher, appConn, C),
    'join-room' : require('../validators/validate-join-room.js')(cookieCipher, appConn),
    'host-room' : require('../validators/validate-host-room.js')(cookieCipher, appConn),
    'add-quiz' : require('../validators/validate-add-quiz.js')(cookieCipher, appConn, C),
    'login-room' : require('../validators/validate-login-room.js')(cookieCipher, appConn, C, xssDefense),
    'reg-room' : require('../validators/validate-register-student.js')(cookieCipher, appConn, C),
    'reg-room-teach' : require('../validators/validate-register-teacher.js')(cookieCipher, appConn,C),
    'change-password-room' : require('../validators/validate-change-password.js')(cookieCipher, appConn,C),
    'forget-password-room' : require('../validators/validate-forget-password.js')(cookieCipher, appConn,C),
    'otp-check' : require('../validators/validate-otp-check.js')(cookieCipher, appConn,C),
    'otp-register' : require('../validators/validate-otp-register.js')(cookieCipher, appConn, C)
  };

  //routing
  //handling requests for .html, controller, css or resource files
  app.get('((/resources|/controller|/css)*)|/favicon.ico', function(req, res) {
    res.sendFile(`${dirname}/site${req.path}`);
  });
  //handling all .html file requests
  app.get('*.html', function(req, res) {
    res.sendFile(`${dirname}/site/html${req.path}`);
  });
  //sends index.html when someone sends a https request to the root directory
  app.get('/', function(req, res){
    res.sendFile(dirname + "/site/html/index.html");
  });

  app.get('/data', function(req,res){
      cookieCipher.decryptJSON(req.cookies.encryptedDataReq)
        .catch(reason => {
          console.log(reason);
        })
        .then(function(cookieData) {
          console.log(cookieData);
          appConn.send({
            'type': C.REQ_TYPE.DATABASE, //JOIN_ROOM
            'data': cookieData.data
          }, (response) => {
            res.render('dbTest', {
              data: response.data
            });
          });
        });
    // }
  })
  //handling play path
  app.get('/play', function(req, res) { //submitted a form for playing in a room
    if(req.query.room.constructor === Array) { //if the room variable has been defined multiple times
      console.log("Well someone's trying to cause an error...");
    } else {
      let roomNo = req.query.room;
      cookieCipher.decryptJSON(req.cookies.login)
        .catch(reason => {
          console.log(reason);
          sendErrorPage(res, 'You are not logged in!');
        })
        .then(function(cookieData) {
          appConn.send({
            'type': C.REQ_TYPE.JOIN_ROOM, //JOIN_ROOM
            'id': cookieData.id,
            'pass': cookieData.pass,
            'roomNo': roomNo
          }, (response) => {
            //TODO::Valid Login
            let errorMsg;
            if(response.err) {
              for(let e of Object.keys(C.ERR)) {
                if(C.ERR[e] == response.err) {
                  errorMsg = e;
                }
              }
              res.render('error', {
                'error' : `Encountered error ${errorMsg}`
              });
            } else {
              res.render('play', {
                'roomNo' : response.roomNo,
                'gamemode': response.gamemode,
                'name' : response.id
              });
            }
          });
        });
    }
  });

  //handling hosting

  app.get('/host', function(req, res) { //submit the form for hosting a room
    if(req.query.quizId.constructor === Array) {
      console.log("Please don't mess with my webpage");
    } else {
      let quizId = req.query.quizId;
      cookieCipher.decryptJSON(req.cookies.login)
        .catch(reason => {
          console.log(reason);
        })
        .then(cookieData => {
          console.log("COOKIE DATA: ");
          console.log(cookieData);
          appConn.send({
            'type' : C.REQ_TYPE.HOST_ROOM,
            'id': cookieData.id,
            'pass': cookieData.pass,
            'quizId': quizId
          }, (response) => {
            if(response.err) {
              for(let e of Object.keys(C.ERR)) {
                if(C.ERR[e] == response.err) {
                  errorMsg = e;
                }
              }
              res.render('error', {
                'error' : `Encountered error ${errorMsg}`
              });
            }
            res.render('host', {
              'roomNo' : response.roomNo,
              'gamemode' : response.gamemode
            });
          });
        });
    }
  });

  app.get('/test', function(req, res) {
    res.render('test', {});
  });

  app.get('/add-quiz', function (req, res) {
    res.render('add-quiz', {});
})


  //handling all other requests (PUT THIS LAST)

  app.get('/*', function(req, res){
    //doing this just in case req.params has something defined for some reason
    console.log("OTHER PATH");
    console.log("GET FILE: " +req.path.substring(1));
    res.render(req.path.substring(1));
  });

  //handling form submits
  app.post('/data-access', validators["data-access"]);
  app.post('/join-room', validators["join-room"]);
  app.post('/host-room', validators["host-room"]);
  app.post('/add-quiz', validators["add-quiz"]);
  app.post('/login-room', validators["login-room"]);
  app.post('/reg-room', validators["reg-room"]);
  app.post('/reg-room-teach', validators["reg-room-teach"]);
  app.post('/change-password-room-success', validators["change-password-room"]);
  app.post('/forget-password-room-success', validators["forget-password-room"]);
  app.post('/otp-check', validators["otp-check"]);
  app.post('/otp-register', validators["otp-register"]);

}

function sendErrorPage(res, errormsg) {
  res.render('error', {
    'error': errormsg
  });
}
