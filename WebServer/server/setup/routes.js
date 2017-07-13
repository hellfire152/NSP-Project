/*
  Includes functions that handles all GET or POST requests.

  Author: Jin Kuan
*/
let uuid;

var checkMultipleOnSameMachine = require('./prevent_multiple_session.js');

var express = require('express');
var nodemailer = require('nodemailer');

module.exports = function(data) {

  const C = data.C;
  let app = data.app,
    dirname = data.dirname,
    cipher = data.cipher,
    appConn = data.appConn,
    queryOfUser = data.queryOfUser;
    uuid = data.uuid;
    errors=data.error;
    uuid = data.uuid;

  //middleware
  app.use('*', checkMultipleOnSameMachine);
  //routing
  //handling requests for .html, controller, css or resource files
  app.get('((/resources|/controller|/css)*)|*.html|/favicon.ico', function(req, res) {
    res.sendFile(`${dirname}/site${req.path}`);
  });
  //sends index.html when someone sends a https request
  app.get('/', function(req, res){
    res.sendFile(dirname + "/site/index.html");
  });

  app.get('/data', function(req,res){
      cipher.decryptJSON(req.cookies.encryptedDataReq)
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
      cipher.decryptJSON(req.cookies.login)
        .catch(reason => {
          console.log(reason);
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
                'gamemode': response.gamemode
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
      cipher.decryptJSON(req.cookies.login)
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
            res.render('host', {
              'roomNo' : response.roomNo,
              'gamemode' : response.gamemode
            });
          });
        });
    }
  });

  // app.get('/login', function(req, res){
  //   console.log("RESPONSE");
  //   console.log(res);
  //   res.render('login',{
  //     title : 'Login',
  //     data : res
  //   });
  //   req.session.errors=null;
  // });
  // app.get('/registerstud', function(req, res){
  //   console.log("HEREHE");
  //   res.render('register-student',{title: 'Register(Student)',success:req.session.success, errors:req.session.errors});
  //   req.session.errors=null;
  // });
  // app.get('/registerteach', function(req, res){
  //   res.render('register-teacher',{title: 'Register(Teacher)',success:req.session.success, errors:req.session.errors});
  //   req.session.errors=null;
  // });
  //handling all other
  /*TESTING*/
  app.get('/test', function(req, res) {
    res.render('test', {});
  });


  //handling all other requests (PUT THIS LAST)

  app.get('/*', function(req, res){
    //doing this just in case req.params has something defined for some reason
    console.log("OTHER PATH");
    console.log("GET FILE: " +req.path.substring(1));
    res.render(req.path.substring(1));
  });

  //handling form submits
  app.post('/data-access', require('../validate-data-access.js')(cipher, appConn, C));
  app.post('/join-room', require('../validate-join-room.js')(cipher, appConn));
  app.post('/host-room', require('../validate-host-room.js')(cipher, appConn));
  app.post('/add-quiz', require('../validate-add-quiz.js')(cipher, appConn, C));
  app.post('/login-room', require('../validate-login-room.js')(cipher, appConn, C));
  app.post('/reg-room', require('../validate-register-student.js')(cipher, appConn, C));
  app.post('/reg-room-teach', require('../validate-register-teacher.js')(cipher, appConn,C));
  app.post('/change-password-room-success', require('../validate-change-password.js')(cipher, appConn,C));
  app.post('/forget-password-room-success', require('../validate-forget-password.js')(cipher, appConn,C));
  app.post('/otp-check', require('../validate-otp-check.js')(cipher, appConn,C));

}

function sendErrorPage(res, errormsg) {
  res.render('error', {
    'error': errormsg
  });
}
