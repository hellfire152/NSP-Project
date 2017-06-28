/*
  Includes functions that handles all GET or POST requests.

  Author: Jin Kuan
*/
let uuid;
module.exports = function(data) {
  const C = data.C;
  let app = data.app,
    dirname = data.dirname,
    cipher = data.cipher,
    appConn = data.appConn,
    queryOfUser = data.queryOfUser;
  uuid = data.uuid;
  //routing
  //handling requests for .html, controller, css or resource files
  app.get('((/resources|/controller|/css)*)|*.html|/favicon.ico', function(req, res) {
    res.sendFile(`${dirname}/site${req.path}`);
  });
  //sends index.html when someone sends a https request
  app.get('/', function(req, res){
    res.sendFile(dirname + "/site/index.html");
  });
//Nigel area
  app.get('/nigel', function(req,res){
    res.sendFile(dirname + "/site/dbTest.html")
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
            'resNo': resNo,
            'roomNo': roomNo
          }, (response) => {
            res.render('play', {
              'roomNo' : response.roomNo,
              'gamemode': response.gamemode
            });
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

// var passport=require('passport');
// var flash = require ('connect-flash');
// app.use(flash());
// app.use(passport.initialize());
// app.use(passport.session());
  //handling login
  var express=require('express');
  // var cookieParser=require('cookie-parser');
  // var bodyParser= require('body-parser');
  var session = require('express-session');
  // app.use(bodyParser());
  // app.use(cookieParser('secret'));
  app.use(session());
  app.get('/login', function(req, res){
    res.render('login',{title: 'Login',success:req.session.success, errors:req.session.errors});
    req.session.errors=null;
  });
  app.get('/registerstud', function(req, res){
    res.render('register-student',{title: 'Register(Student)',success:req.session.success, errors:req.session.errors});
    req.session.errors=null;
  });
  app.get('/registerteach', function(req, res){
    res.render('register-teacher',{title: 'Register(Teacher)',success:req.session.success, errors:req.session.errors});
    req.session.errors=null;
  });
  //handling all other
  /*TESTING*/
  app.get('/test', function(req, res) {
    res.render('test', {});
  });


  //handling all other requests (PUT THIS LAST)

  app.get('/*', function(req, res){
    //doing this just in case req.params has something defined for some reason
    res.render(req.path.substring(1));
  });

  //handling form submits
  app.post('/join-room', require('../validate-join-room.js')(cipher, appConn));
  app.post('/host-room', require('../validate-host-room.js')(cipher, appConn));
  app.post('/login-room', require('../validate-login-room.js')(cipher, appConn));
  app.post('/reg-room', require('../validate-register-student.js')(cipher, appConn));
    app.post('/reg-room-teach', require('../validate-register-teacher.js')(cipher, appConn));
}

function sendErrorPage(res, errormsg) {
  res.render('error', {
    'error': errormsg
  });
}
