/*
  Game logic for the classic gamemode.

  Author: Jin Kuan
*/
var data, C, allRooms;
var currentRoom;
module.exports = function(input) {
  data = input.data;
  C = input.C;
  allRooms = input.allRooms;
  currentRoom = allRooms[data.roomNo];

  switch(data.game) {
    case C.GAME.START: {
      
    }
  }
};
