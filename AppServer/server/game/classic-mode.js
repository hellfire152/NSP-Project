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
  console.log("CLASSIC-MODE HANDLER");
  console.log(currentRoom);
  switch(data.game) {
    case C.GAME.START: {
      currentRoom.joinable = false; //room not joinable anymore
      currentRoom.questionCounter = 0; //question counter for the whole room
      let question = currentRoom.quiz.questions[0]; //get first question

      return {
        'game': C.GAME_RES.BEGIN_FIRST_QUESTION,
        'question': question,
        'roomNo': data.roomNo
      }
    }
    default: {
      console.log("CLASSIC MODE: Game event of " +data.game +" is not defined!");
    }
  }
};
