/*
  Stores all connections for a current user
  Will block multiple sessions, from the same user, on the same computer
*/
//variable to store socket data
var connections = {};

module.exports = function checkMultipleOnSameMachine(req, res, next) {
  next();
  //get ip and port
  console.log("hi");
  var ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
  console.log("hi2")
  console.log(ip);
  // // var port ="8080";
  //
  // // var port = req
  // 
  // //IF CONNECTION EXISTS
  //
  // if (connections!= null && connections.data.ip== ip){
  //   console.log("if");
  //   req.session.destroy(function (err) {
  //       res.redirect('/login'); //Inside a callback… bulletproof!
  //   });
  // }
  // else{
  //   console.log("else");
  //   connections={
  //     data:{
  //       'ip': ip
  //     }
  //   }
  // }
  //   //block connection
  //   //remove login cookie
  //   //send error page
  // //ELSE (no other session exists)
  //   //store into the object
  //   //call --> next();
    next();
}
