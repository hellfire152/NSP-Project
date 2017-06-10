var data, C, allRooms, sendToServer, conn;
var currentRoom, currentPlayer;
var common = require('./common.js');
module.exports = async function(input) {
  ({data, C, allRooms, conn, sendToServer} = input);
  currentRoom = allRooms[data.roomNo];
  currentPlayer = currentRoom.players[data.id];

  switch(data.game) {
    case C.GAME.START: {
      //prevent others from joining the room
      currentRoom.joinable = false;

      //get the first question
      let question = currentRoom.quiz.questions[0];

      //add a questionCounter to each player
      let players = currentRoom.players;
      for(let player in players) {
        if(players.hasOwnProperty(player)) {
          players[player].questionCounter = 0;
          players[player].answerable = true;
        }
      }

      //send the first question to all players
      let question = currentRoom.quiz.questions[0];
      return {
        'game': C.GAME_RES.NEXT_QUESTION,
        'question': common.removeSolution(question),
        'sendTo': C.SEND_TO.ROOM,
        'roomNo': data.roomNo
      }

      //send the game start response to the host
      sendToServer({
        'game' : C.GAME_RES.START,
        'playerList' : common.playersObjectToArray(currentRoom.players)
      });
    }
    case C.GAME.SUBMIT_ANSWER: {
      if(currentPlayer.answerable) {
        let question = currentRoom.quiz.questions[currentPlayer.questionCounter];

        if(common.checkCorrectAnswer(question, data.answer)) {
          currentPlayer.
          return {
            'game': C.GAME_RES.NEXT_QUESTION,
            'sendTo': C.SEND_TO.USER,
            'targetId': data.id
          }
        } else {  //wrong answer
          currentPlayer.answerable = false;
          currentPlayer.timer = setTimeout(() => {  //3 second penalty on wrong answer
            currentPlayer.answerable = true;
          }, 3000);
          return {
            'game': C.GAME_RES.WRONG_ANSWER,
            'sendTo': C.SEND_TO.USER,
            'targetId': data.id
          }
        }
      } else {  //cannot answer
        
        return {
          'err': C.ERR.CANNOT_ANSWER,
          'sendTo': C.SEND_TO.USER,
          'targetId': data.id
        }
      }
    }
    //ADD MORE CASES HERE
  }
}
