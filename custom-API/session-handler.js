
var userSessions = {
  "individual" : {},
  "rooms" : {}
};

var ivStore = {};

function addUser(socket) {
  let user = userSessions.individual[socket.userId] = {};
  user.limit = false;
  user.room = null;
}

function addUserToRoom(socket, room) {
  if(userSessions.individual[socket.userId] === undefined) addUser(socket);
  let user = userSessions.individual[socket.userId];
  user.room = room;
  userSessions.rooms[room].users.push(socket.userId);
}

function addRoomWithQuiz(room, quiz, hostSocket) {
  let userRoom = userSessions.rooms[room];
  userRoom = {};
  userRoom.users = [];
  userRoom.quiz = quiz;
  userRoom.hostId;
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
