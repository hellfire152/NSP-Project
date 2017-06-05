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
      currentRoom.joinable = false; //room not joinable anymore
      currentRoom.questionCounter = 0; //question counter for the whole room
      let question = currentRoom.quiz.question[0]; //get first question

      return {
        'game': C.GAME.BEGIN_FIRST_QUESTION,
        'question': question,
        'roomNo': data.roomNo
      }
    }
  }
};
