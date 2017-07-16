/*
  Includes functions that handles all GET or POST requests.

  Author: Jin Kuan
*/
let uuid;

var checkMultipleOnSameMachine = require('./prevent_multiple_session.js');

var express = require('express');
var nodemailer = require('nodemailer');
var helmet = require('helmet');
var app = express();
var xssDefense = require('xss');
var frameguard = require('frameguard');


app.use(helmet.noSniff()); // content type should not be changed or followed
app.use(helmet.frameguard("deny")); // prevent clickjacking - prevent others from putting our sites in a frame - not working **
app.use(helmet.xssFilter()); // protects against reflected XSS
module.exports = function(data) {

  const C = data.C;
  let app = data.app,
    dirname = data.dirname,
    cipher = data.cipher,
    appConn = data.appConn,
    queryOfUser = data.queryOfUser;
    uuid = data.uuid;
    errors=data.error;
    cookieCipher = data.cookieCipher;
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
          res.render('error', {
            'error' : 'Invalid login cookie'
          });
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
  app.post('/data-access', require('../validators/validate-data-access.js')(cipher, appConn, C));
  app.post('/join-room', require('../validators/validate-join-room.js')(cipher, appConn));
  app.post('/host-room', require('../validators/validate-host-room.js')(cipher, appConn));
  app.post('/add-quiz', require('../validators/validate-add-quiz.js')(cipher, appConn, C));
  app.post('/login-room', require('../validators/validate-login-room.js')(cipher, appConn, C, xssDefense));
  app.post('/reg-room', require('../validators/validate-register-student.js')(cipher, appConn, C));
  app.post('/reg-room-teach', require('../validators/validate-register-teacher.js')(cipher, appConn,C));
  app.post('/change-password-room-success', require('../validators/validate-change-password.js')(cipher, appConn,C));
  app.post('/forget-password-room-success', require('../validators/validate-forget-password.js')(cipher, appConn,C));
  app.post('/otp-check', require('../validators/validate-otp-check.js')(cipher, appConn,C));
  app.post('/otp-register', require('../validators/validate-otp-register.js') (cipher, appConn, C));

}

function sendErrorPage(res, errormsg) {
  res.render('error', {
    'error': errormsg
  });
}
