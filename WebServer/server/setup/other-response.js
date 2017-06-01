/*
  Contains functions relating to handling responses from the AppServer
  NOT related to socket.io.

  Author: Jin Kuan
*/

module.exports = async function(data) {
  let response = data.response;
  let C = data.C;
  let pendingResponses = data.pendingResponses;

  console.log("RES TYPE: " +data.type);

  switch(response.type) {
    case C.RES_TYPE.JOIN_ROOM_RES: {
      return await join_room_res(response, pendingResponses, dirname);
    }
    case C.RES_TYPE.HOST_ROOM_RES: {
      return await host_room_res(response, pendingResponses, dirname);
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
    let res = pendingResponses[data.resNo]; //get pending response
    res.sendFile(dirname + '/site/play.html');
    delete pendingResponses[data.resNo]; //remove the pending request
    //Let socket.io take the game stuff from here
  }
}

async function host_room_res(response, pendingResponses, dirname) {
  if(response.validLogin == true) {
    let res = pendingResponses[data.resNo];
    res.sendFile(dirname + '/site/host2.html');
    delete pendingResponses[data.resNo];
    //socket.io will handle the rest
  }
}
