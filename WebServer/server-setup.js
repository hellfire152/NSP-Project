/**
  File that does most of the setup work.
  Most of the actual setting of stuff is delegated to smaller, easier to parse
  modules.
  This file does set most of the middleware used
  Author: Jin Kuan
*/
//required modules
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var helmet = require('helmet');
var uuid = require('uuid');
var cookie = require('cookie');
var ios = require('socket.io-express-session');
var xssDefense = require('./server/setup/xss-defense.js');
var emailServer = require('./server/setup/email.js');
var csrfProtection = require('csurf')({'cookie' : true});
var socketOfUser = {};
setTimeout(() => {  //clear after 2 seconds (so no bugs on instant connection)
  socketOfUser = {};
}, 2000);
module.exports = function(data) {
  //extracting data
  let {app, io, pass, appConn, Cipher, express, net, cookieParser, pendingAppResponses,
    decryptResponse, logResponse, runCallback} = data;
  const S = data.S;
  const C = data.C;

  //cipher for cookies
  var cookieCipher = new Cipher({
    'password' : S.COOKIE.KEY,
    'iv' : S.COOKIE.IV
  });

  //express-session stuff
  var Session = require('express-session');
  var session = Session({
        secret: S.COOKIE.KEY,
        resave: true,
        saveUninitialized: true,
        cookie : {
          secure : true
        }
      });

  //enables my use of socket.handshake.session
  io.use(ios(session));

  //template engine used
  app.set('view engine', 'pug');
  //where the templates are located
  app.set('views', './site/views');

  //Various middleware
  app.use(session);
  app.use(cookieParser(S.COOKIE_KEY));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: false}));
  app.use(expressValidator());
  app.use("/", express.static(__dirname));
  //make sendErrorPage available for every request
  app.use((req, res, next) => {
    res.sendErrorPage = sendErrorPage;
    next();
  });

  //decrypt cookies
  app.use(async (req, res, next) => {
    for(let cookie in req.cookies) {
      if(req.cookies.hasOwnProperty(cookie)) {
        if(S.COOKIE.CIPHERED.indexOf(cookie) >= 0) {
          try {
            req.cookies[cookie] = await cookieCipher.decryptJSON(req.cookies[cookie]);
          } catch (e) { //unencrypted cookie (just continue on)
            continue;
          }
        }
      }
    }
    next();
  });
  app.use(csrfProtection);

  //implementing our own security stuff
  var security = require('./server/setup/various-security.js')({
    'app':  app,
    'C' : C,
    'S' : S,
    'helmet' : helmet
  });

  //setting routes
  require('./server/setup/routes.js')({
    'S' : S,
    'C' : C,
    'app' : app,
    'dirname' : __dirname,
    'Cipher' : Cipher,
    'appConn' : appConn,
    'uuid' : uuid,
    'pendingAppResponses' : pendingAppResponses,
    'cookieCipher' : cookieCipher,
    'xssDefense' : xssDefense,
    'emailServer' : emailServer,
    'csrfProtection' : csrfProtection
  });

  //setting up the communication between the WebServer and AppServer
  require('./server/setup/io-forward.js')({
    'C' : C,
    'dirname' : __dirname,
    'pendingAppResponses' : pendingAppResponses,
    'Cipher' : Cipher,
    'appConn' : appConn,
    'io' : io,
    'cookie' : cookie,
    'cookieCipher' : cookieCipher,
    'socketOfUser': socketOfUser,
    'decryptResponse' : decryptResponse,
    'logResponse' : logResponse,
    'runCallback' : runCallback
  });
}

function sendErrorPage(errormsg) {
  this.render('error', {
    'error': errormsg
  });
  //stop anymore responses
  this.end();
}
