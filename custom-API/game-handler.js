/*
  stores all connected sessions
  individual {
    user_id : {
      limit: boolean,
      roomm : room-id
    }
  }
  room {
    room_id : [array of user_ids]
  }
  To check if a user is blocked,

  Author: Jin Kuan (Supposed to be Qing Ning's part tho)
*/
var userSessions = {
  individual : {},
  rooms : {}
};

var ivStore = {};

function addUser(socket) {
  let user = userSessions.individual[socket.userId] = {};
  user.limit = false;
  user.room = null;
}

function addUserToRoom(socket, room) {
  let user = userSessions.individual[socket.userId];
  user.room = room;
  userSessions.rooms[room].push(socket.userId);
}

function removeUser(socket) {
  delete userSessions.individual[socket.userId];
}

function removeUserFromRoom(socket, room) {
  userSessions.individual[socket.userId].room = null;
}

function removeRoom(room) {
  //TODO::search through the list of users in the room and remove the room from
  //their individual object


    delete userSessions.room[room];
}

function limit(socket, time) {
  userSessions.individual[socket.userId].limit = true;

  //TODO::Add timer
}

function enable(socket) {
  userSessions.individual[socket.userId].limit = false;
}

//temporary for testing
var id = 0
function generateId(socket) {
  return id++;
}

//functions for storing temporary IVs
var iv = {
  store: function(user, iv) {
    ivStore[user] = iv;
  },
  remove: function(user) {
    delete ivStore[user];
  }
}
module.exports = {
  'addUser' : addUser,
  'addUserToRoom' : addUserToRoom,
  'removeUser' : removeUser,
  'removeUserFromRoom' : removeUserFromRoom,
  'removeRoom' : removeRoom,
  'limit' : limit,
  'enable' : enable,
  'generateId' : generateId,
  'iv' : iv
}
