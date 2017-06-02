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

  console.log("OTHER RES TYPE: " +response.type);

  switch(response.type) {
    case C.RES_TYPE.JOIN_ROOM_RES: {
      join_room_res(response, pendingResponses, dirname);
      break;
    }
    case C.RES_TYPE.HOST_ROOM_RES: {
      host_room_res(response, pendingResponses, dirname);
    }
    //ADD MORE CASES HERE
  }
}

/*
  Handles the join_room form submittion results

  Send the /site/play.html (initialting the socket.io connection) on a valid login
*/
async function join_room_res(response, pendingResponses, dirname) {
  if(response.validLogin == true) {
    let res = pendingResponses[response.resNo]; //get pending response
    res.sendFile(dirname + '/site/play.html');
    delete pendingResponses[response.resNo]; //remove the pending request
    //Let socket.io take the game stuff from here
  }
  return;
}

async function host_room_res(response, pendingResponses, dirname) {
  console.log("DIRECTORY NAME: " + dirname);
  if(response.validLogin == true) {
    let res = pendingResponses[response.resNo];
    res.sendFile(dirname + '/site/host.html');  //sending the html file
    delete pendingResponses[response.resNo];
    //socket.io will handle the rest
  }
  return;
}
