/*
  Includes functions that handles all GET or POST requests.

  Author: Jin Kuan
*/
var uuid;

var express = require('express');
var nodemailer = require('nodemailer');
var rateLimiters = require('./rate-limiters.js');
var cookieValidator = require('./cookie-validation.js');

var S;
module.exports = function(data) {
  S = data.S;
  let {app, dirname, cipher, emailServer, appConn, cookieCipher, xssDefense, csrfProtection}
    = data;
  const C = data.C;;
  uuid = data.uuid;

  //validators
  var validators = {
    // 'data-access' : require('../validators/validate-data-access.js')(cookieCipher, appConn, C),
    'join-room' : require('../validators/validate-join-room.js')(cookieCipher, appConn),
    'host-room' : require('../validators/validate-host-room.js')(cookieCipher, appConn, S),
    'add-quiz' : require('../validators/validate-add-quiz.js')(cookieCipher, appConn, C, cookieValidator),
    'login-room' : require('../validators/validate-login-room.js')(cookieCipher, appConn, C, xssDefense, emailServer, cookieValidator),
    'reg-room' : require('../validators/validate-register-student.js')(cookieCipher, appConn, C, emailServer),
    'reg-room-teach' : require('../validators/validate-register-teacher.js')(cookieCipher, appConn, C, emailServer),
    'forget-password-room' : require('../validators/validate-forget-password.js')(cookieCipher, appConn,C,emailServer, cookieValidator),
    'otp-check' : require('../validators/validate-otp-check.js')(cookieCipher, appConn,C, emailServer, xssDefense, cookieValidator),
    // 'otp-register' : require('../validators/validate-otp-register.js')(cookieCipher, appConn, C),
    'otp-forget-password' : require('../validators/validate-otp-forget-password.js')(cookieCipher, appConn,C,emailServer, cookieValidator),
    'change-forget-password' : require('../validators/validate-change-forget-password.js')(cookieCipher, appConn,C),
    'spam-bot' : require('../validators/validate-spam.js')(appConn, C)
  };

  //routing
  //handling requests for controller, css or resource files
  app.get('((/resources|/controller|/css)*)|/favicon.ico', function(req, res) {
    res.sendFile(`${dirname}/site${req.path}`, (err) => {
      if(err) res.send('Error 404: Not Found!');
    });
  });
  //handling all .html file requests
  app.get('*.html', function(req, res) {
    res.sendFile(`${dirname}/site/html${req.path}`, (err) => {
      res.sendErrorPage('Error 404: Not Found!');
    });
  });
  //redirect to home page
  app.get('/', function(req, res){
    if(req.session.validLogin) {
      res.redirect('/user-home');
    } else {
      res.render('Home', {
        'csrfToken' : req.csrfToken(),
        'validLogin' : false
      });
    }
  });

  app.get('/Home', function(req, res) {
    res.render('Home', {
      'csrfToken' : req.csrfToken(),
      'validLogin' : req.session.validLogin
    });
  });

  app.get('/user-home', function(req, res) {
    appConn.send({
      'type' : C.REQ_TYPE.DATABASE,
      'data' : {
        type : C.DB.GET_ACCOUNT_DETAILS,
        user_id : req.session.username
      }
    } ,(response) => {
      //TODO: WILL INSERT AN REMEMBER ME FUNCCTION OVER HERE TOO TIRED TO IMPLEMENT, CURRENTLY WORKING AT OTP CHECK
      if(response.data.success){
        var userIP = req.connection.remoteAddress;
        var encodedData = xssDefense.jsonEncode(response.data.data[0]);
        cookieCipher.encryptJSON(cookieValidator.generateCheckCookie(encodedData, userIP))
        .then((encryptedCookie) => {
          res.cookie('user_info', encryptedCookie);
          appConn.send({
            'type' : C.REQ_TYPE.DATABASE,
            'data' : {
              'type' : C.DB.SELECT.ALL_QUIZ
            }
          }, (response4) => {
            //TODO: XSS of array of quiz data
            res.render('user-home', {
              data : {
                userInfo : encodedData,
                quizInfo : response4.data.data
              }
            });
          });
        });
    }
    });
  })

  //handling profile pages
  app.get('/profile', (req, res) => {
    res.redirect('/profile/0');
  });
  app.get('/profile/:username', (req, res) => {
    console.log(req.params);
    //go to own profile page if logged in + no specified user profile
    if(req.params.username == "0") {
      if(req.session.validLogin) {
        res.redirect(`/profile/${req.session.username}`);
      } else {
        res.sendErrorPage('No username specified!');
      }
    }

    appConn.send({
      'type' : C.REQ_TYPE.DATABASE,
      'data' : {
        'type' : C.DB.SELECT.ACCOUNT_DETAILS,
        'username' : req.params.username
      }
    }, (response) => {
      console.log(response);
      // let profileDetails =  {
      //   // 'username' : response.username,
      //   // 'email' : response.email,
      //   // 'category' : response.category,
      //   // 'completedQuizzes' : response.completedQuizzes,
      //   // 'creationDate' : response.creationDate,
      //   // 'aboutMe' : response.aboutMe,
      //   // 'quizList' : response.quizList,
      //   // 'achievementsList' : response.achievementsList
      // };
      if(!response.data.success) {
        res.sendErrorPage('Error loading profile page!');
        return;
      }
      let profileDetails = {
        'profile' : response.data.data[0]
      };

      console.log(profileDetails);

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
      res.sendErrorPage("Argument Error!");
    } else if(gameSessionCheck(req, true)) {
      //check for login cookie
      if(req.session.validLogin) {
        let roomNo = req.query.room;
        appConn.send({
          'type' : C.REQ_TYPE.JOIN_ROOM,
          'id' : req.session.username,  //TESTING
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
        res.sendErrorPage('You are not logged in!');
      }
    } else {
      res.sendErrorPage('Invalid game session!');
       //I don't know what other ways there are yet
    }
  });

  //handling hosting
  app.get('/host', rateLimiters.host, function(req, res) { //submit the form for hosting a room
    if(req.query.quizId.constructor === Array) {
      res.sendErrorPage('Argument error!');
    } else if(gameSessionCheck(req, false)) {
      if(/*req.validLogin*/true) {
        let quizId = req.query.quizId;
        appConn.send({
          'type' : C.REQ_TYPE.HOST_ROOM,
          'id' : req.session.username,
          'quizId' : quizId
        }, (response) => {
          if(response.err) {
            for(let e of Object.keys(C.ERR)) {
              if(C.ERR[e] == response.err)
              res.sendErrorPage(e);
            }
          } else {  //no error
            req.session.hosting = true;
            res.render('host', {
              'roomNo' : response.roomNo
            });
          }
        });
      } else {  //req.validLogin is false
        res.sendErrorPage('You are not logged in!');
      }
    } else {  //req.session.hosting is false
      res.sendErrorPage('Invalid hosting session!');
    }
  });

  //handling logout
  app.get('/logout', rateLimiters.logout, function(req,res){
    req.session.destroy(function(err) {
      if(err){
        console.log(err);
        console.log("WHY U STILL HERE????");
      }
      else{
        console.log("successful logout!");
        res.clearCookie("_csrf");
        res.clearCookie("connect.sid");
        res.clearCookie("tempToken");
        res.clearCookie("user_info");
        console.log("CLEAREDDDDDDDDDDDDDDDDDDD");
        res.redirect('/');
      }
    })
  });

  //only allow valid otp
  app.get('/otp', function(req, res) {
    if(!req.session.otpSession)
      res.sendErrorPage('Access denied', '/Home');
    else res.render('otp', {
      'csrfToken' : req.csrfToken()
    });
  });

  //handling all other requests (PUT THIS LAST)
  app.get('/*', function(req, res){
    //doing this just in case req.params has something defined for some reason
    console.log("OTHER PATH");
    console.log("GET FILE: " +req.path.substring(1));
    //handling csrf token
    let c = (S.INCLUDE_CSRF_TOKEN.indexOf(req.path.substring(1)) >= 0)? true : false;
    res.render(req.path.substring(1), {
      'csrfToken' : (c) ? req.csrfToken() : null
    }, (err, html) => {
      if(err) {
        console.log(err);
        if (err.message.indexOf('Failed to lookup view') !== -1) {
          return res.sendErrorPage('Error 404: Not Found!');
        }
        throw err;
      } else res.send(html);
    });
  });
  //handling form submits
  // app.post('/data-access', validators["data-access"]);
  app.post('/join-room', rateLimiters.join, validators["join-room"]);
  app.post('/host-room', rateLimiters.host, validators["host-room"]);
  app.post('/add-quiz',rateLimiters.addQuiz, validators["add-quiz"]);
  app.post('/login',rateLimiters.login, validators["login-room"]);
  app.post('/student-register', rateLimiters.register, validators["reg-room"]);
  app.post('/teacher-register', rateLimiters.register, validators["reg-room-teach"]);
  // app.post('/change-password-room-success', rateLimiters.changePassword, validators["change-password-room"]); //NOTE: Chloe say its not needed
  app.post('/forget-password-room-success',rateLimiters.forgetPassword,validators["forget-password-room"]);
  app.post('/otp-check',rateLimiters.otpCheck, validators["otp-check"]);
  // app.post('/otp-register', rateLimiters.otpRegister,validators["otp-register"]);
  app.post('/otp-forget-password', validators["otp-forget-password"]);
  app.post('/change-forget-password', validators["change-forget-password"]);
  app.post('/spamming-in-progress', validators["spam-bot"]);
  // app.post('/otp-forget-password', require('../validate-otp-forget-password.js')(cipher, appConn, C, xssDefense));
}
function gameSessionCheck(req, isPlaying) {
  //either hosting or joining, not both
  if(S.NO_SIMULTANEOUS_HOST_JOIN && !(!req.session.joining ^ !req.session.hosting)) {
    return false;
  }
  return (isPlaying)? req.session.joining : true;
}
