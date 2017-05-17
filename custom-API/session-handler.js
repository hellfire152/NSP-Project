/*
  stores all connected sessions
  individual {
    user_id : {
      limit: boolean,
      rooms : []
    }
  }
  room {
    room_id : [array of user_ids]
  }
  To check if a user is blocked,
*/
var userSessions = {
  individual : {},
  room : {}
};

function addUser(socket) {
  let user = userSessions.individual[socket.userId];
  user.limit = false;
  user.rooms = {};
}

function addUserToRoom(socket, room) {
  let user = userSessions.individual[socket.userId];
  user.rooms.push(room);
  userSessions.room[room].push(socket.userId);
}

function removeUser(socket) {
  let userRooms = userSessions.individual[socket.userId].rooms;
  for(let i = 0; i < userRooms.length; i++) {
    removeUserFromRoom(socket, userRooms[i]);
  }

  //remove user themselves
  delete userSessions.individual[socket.userId];
}

function removeUserFromRoom(socket, room) {
  let room = userSessions.room[room];
  let index = room.indexOf(socket.userId);
  if (index >= 0) arr.splice(index, 1);
}

function removeFromAllRooms(socket) {
  userSessions.individual[socket.userId].rooms = [];
}

function removeRoom(room) {
    delete userSessions.room[room];
}

function limit(socket) {
  userSessions.individual[socket.userId].limit = true;
}

function enable(socket) {
  userSessions.individual[socket.userId].limit = false;
}

//temporary for testing
var id = 0
function generateId(socket) {
  return id++;
}

module.exports = {
  'addUser' : addUser,
  'addUserToRoom' : addUserToRoom,
  'removeUser' : removeUser,
  'removeUserFromRoom' : removeUserFromRoom,
  'removeFromAllRooms' : removeFromAllRooms,
  'removeRoom' : removeRoom,
  'limit' : limit,
  'enable' : enable,
  'generateId' : generateId
}
