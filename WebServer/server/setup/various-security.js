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
/**PUT SOME COMMENTS**/
function attachCsrfToken(req, res, next){
  res.locals.csrfTokenFunction = req.csrfToken;
  // console.log(res.locals.csrfTokenFunction);
  next();
}

function invalidCsrfToken(err, req, res, next){
  if (err.code === 'EBADCSRFTOKEN') {
    res.sendErrorPage('Invalid CSRF token!');
  }
  next(err);
}

module.exports = function(data) {
  ({app, helmet, C, S} = data);

  app.use(helmet()); //adds a bunch of security features
  app.use(invalidCsrfToken);
  //app.use(attachCsrfToken);
  return { //in case there's any function you need outside here
  }
}
