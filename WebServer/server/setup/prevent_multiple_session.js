/*
  Stores all connections for a current user
  Will block multiple sessions, from the same user, on the same computer
*/
//variable to store socket data
var connections = {};

module.exports = function checkMultipleOnSameMachine(req, res, next) {
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
