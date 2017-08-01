/*
  Includes functions that handles all GET or POST requests.

  Author: Jin Kuan
*/
var uuid;

var express = require('express');
var nodemailer = require('nodemailer');
var rateLimiters = require('./rate-limiters.js');
module.exports = function(data) {
  let {app, dirname, cipher, emailServer, appConn, queryOfUser, errors, cookieCipher, xssDefense}
    = data;
  const C = data.C;
  uuid = data.uuid;

  //validators
  var validators = {
    'data-access' : require('../validators/validate-data-access.js')(cookieCipher, appConn, C),
    'join-room' : require('../validators/validate-join-room.js')(cookieCipher, appConn),
    'host-room' : require('../validators/validate-host-room.js')(cookieCipher, appConn),
    'add-quiz' : require('../validators/validate-add-quiz.js')(cookieCipher, appConn, C),
    'login-room' : require('../validators/validate-login-room.js')(cookieCipher, appConn, C, xssDefense, emailServer),
    'reg-room' : require('../validators/validate-register-student.js')(cookieCipher, appConn, C, emailServer),
    'reg-room-teach' : require('../validators/validate-register-teacher.js')(cookieCipher, appConn, C, emailServer),
    'change-password-room' : require('../validators/validate-change-password.js')(cookieCipher, appConn, C),
    'forget-password-room' : require('../validators/validate-forget-password.js')(cookieCipher, appConn,C),
    'otp-check' : require('../validators/validate-otp-check.js')(cookieCipher, appConn,C),
    'otp-register' : require('../validators/validate-otp-register.js')(cookieCipher, appConn, C)
  };

var parseForm = bodyParser.urlencoded({extended: false});
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

  app.get('/form', csrfProtection, function(req,res){
    res.render('form', {
      csrfToken: req.csrfToken()
    });
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

  //handling profile pages
  app.get('/profile/:username', (req, res) => {
    appConn.send({
      'type' : C.REQ_TYPE.ACCOUNT_DETAILS,
      'username' : req.params.username
    }, (response) => {
      let profileDetails =  {
        'username' : response.username,
        'email' : response.email,
        'category' : response.category,
        'completedQuizzes' : response.completedQuizzes,
        'creationDate' : response.creationDate,
        'aboutMe' : response.aboutMe,
        'quizList' : response.quizList,
        'achievementsList' : response.achievementsList
      };

      //viewing own profile
      if(req.validLogin && req.session.id === req.params.username) {
        //display editable version
        res.render('editable-profile', profileDetails);
      } else {
        //display non-editable version
        res.render('profile', profileDetails);
      }
    })
  });

  //handling play path
  app.get('/play', rateLimiters.join, function(req, res) { //submitted a form for playing in a room
    if(req.query.room.constructor === Array) { //if the room variable has been defined multiple times
      res.sendErrorPage("Don't Think you can hack me!");
    } else if(req.session.joining) {
      //check for login cookie
      if(false /*!req.validLogin*/)
        res.sendErrorPage('You are not logged in!');

      let roomNo = req.query.room;
      appConn.send({
        'type' : C.REQ_TYPE.JOIN_ROOM,
        'id' : req.session.username,  //TESTING
        'pass' : req.cookies.login.pass,
        'roomNo' : roomNo
      }, (response) => {
        if(response.err) {
          for(let e of Object.keys(C.ERR)) {
            if(C.ERR[e] == response.err) {
              res.sendErrorPage(e);
            }
          }
        } else {
          res.render('play', {
            'roomNo' : response.roomNo,
            'gamemode' : response.gamemode,
            'name' : response.id
          });
        }
      });
    } else {
      res.sendErrorPage('Please join via the home page or...??');
       //I don't know what other ways there are yet
    }
  });

  //handling hosting

  app.get('/host', rateLimiters.host, function(req, res) { //submit the form for hosting a room
    if(req.query.quizId.constructor === Array) {
      res.sendErrorPage('Argument error!');
    } else if(req.session.hosting) {
      if(req.cookies.login === undefined)
        res.sendErrorPage('You are not logged in!');

      let quizId = req.query.quizId;
      appConn.send({
        'type' : C.REQ_TYPE.HOST_ROOM,
        'id' : req.cookies.login.id,
        'pass' : req.cookies.login.pass,
        'quizId' : quizId
      }, (response) => {
        if(response.err) {
          for(let e of Object.keys(C.ERR)) {
            if(C.ERR[e] == response.err)
              res.sendErrorPage(e);
          }
        } else {
          res.render('host', {
            'roomNo' : response.roomNo,
            'gamemode' : response.gamemode
          });
        }
      });
    } else {
      res.sendErrorPage('Not valid hosting thing...?')
    }
  });

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
  app.post('/reg-room', rateLimiters.register, validators["reg-room"]);
  app.post('/reg-room-teach', rateLimiters.register, validators["reg-room-teach"]);
  app.post('/change-password-room-success', validators["change-password-room"]);
  app.post('/forget-password-room-success', validators["forget-password-room"]);
  app.post('/otp-check', validators["otp-check"]);
  app.post('/otp-register', validators["otp-register"]);
  app.post('/otp-forget-password', require('../validate-otp-forget-password.js') (cipher, appConn, C, xssDefense));
  app.post('/change-forget-password', require('../validate-change-forget-password.js') (cipher, appConn, C, xssDefense));
  app.post('/process', parseForm, csrfProtection, function(req,res){
    res.redirect('/');
  })
}
