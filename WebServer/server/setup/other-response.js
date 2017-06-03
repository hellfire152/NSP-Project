/*
  Contains functions relating to handling responses from the AppServer
  NOT related to socket.io.

  Author: Jin Kuan
*/

module.exports = async function(data) {
  let response = data.response;
  let C = data.C;
  let pendingResponses = data.pendingResponses;
  let dirname = data.dirname;
  let queryOfUser = data.queryOfUser;
  console.log("OTHER RES TYPE: " +response.type);

  switch(response.type) {
    case C.RES_TYPE.JOIN_ROOM_RES: {
      join_room_res(response, pendingResponses);
      break;
    }
    case C.RES_TYPE.HOST_ROOM_RES: {
      host_room_res(response, pendingResponses);
    }
    //ADD MORE CASES HERE
  }
}

/*
  Handles the join_room form submittion results

  Send the /site/play.html (initialting the socket.io connection) on a valid login
*/
async function join_room_res(response, pendingResponses) {
  if(response.validLogin == true) {
    let res = pendingResponses[response.resNo]; //get pending response
    res.render('play', {
      'roomNo' : response.roomNo
    });
    delete pendingResponses[response.resNo]; //remove the pending request
    //Let socket.io take the game stuff from here
  } else {
    sendErrorPage({
      'response': response,
      'errormsg': "You are not logged in! (I haven't implemented guest accounts)",
      'pendingResponses': pendingResponses
    })
  }
  return;
}

async function host_room_res(response, pendingResponses) {
  if(response.validLogin == true) {
    let res = pendingResponses[response.resNo];
    res.render('host', {
      'roomNo': response.roomNo
    });  //sending the html file
    delete pendingResponses[response.resNo];
    //socket.io will handle the rest
  }
  return;
}


function sendErrorPage(data) {
  data.pendingResponses[data.response.resNo].render('error', {
    'error': data.errormsg
  });
  delete data.pendingResponses[data.response.resNo];
}
