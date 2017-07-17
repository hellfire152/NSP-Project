/*
  Contains various security middleware implemented by us

  Multiple people are working on this file, so look out for who's the Author
  at the function comments
*/
//global variables/external modules needed (passed in on require)
var app, helmet, C, S;

/*
  Stores all connections for a current user
  Will block multiple sessions, from the same user, on the same computer

  Author: Qing Ning
*/
//variable to store socket data
var connections = {};

function checkMultipleOnSameMachine(req, res, next) {
  //get ip and port

  //IF CONNECTION EXISTS
    //block connection
    //remove login cookie
    //send error page
  //ELSE (no other session exists)
    //store into the object
    //call --> next();
    next();
}

/**PUT SOME COMMENTS**/
function attachCsrfToken(req, res, next){
  res.locals.csrfTokenFunction = req.csrfToken;
  next();
}

function invalidCsrfToken(err, req, res, next){

  if (err.code !== 'EBADCSRFTOKEN') return next(err)

  // handle CSRF token errors here
  res.status(403)
  res.send('session has expired or form tampered with ')
}

module.exports = function(data) {
  ({app, helmet, C, S} = data);

  /***PUT YOUR APP.USE HERE***/
  app.use(checkMultipleOnSameMachine);
  // app.use(helmet.hpkp({
  //   maxAge: 1000 * 60 * 5, //5 minutes, for testing
  //   sha256s: [/*TODO::Generate public key*/]
  // }));

  return { //in case there's any function you need outside here
  }
}
