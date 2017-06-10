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
      currentRoom.completedPlayers = 0;

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
          currentPlayer.answerable = true;  //just in case
          currentPlayer.questionCounter++;

          //finished the last question
          if(currentPlayer.questionCounter >= currentRoom.quiz.questions.length) {
            currentRoom.completedPlayers++;
            if(currentRoom.completedPlayers >= currentRoom.playerCount) {
              return {  //if all players completed
                'game': C.GAME_RES.GAME_END,
                'sendTo': C.SEND_TO.ROOM,
                'roomNo': data.roomNo
              }
            } else {  //send player finish event
              sendToServer({
                'game': C.GAME_RES.PLAYER_FINISH,
                'sendTo': C.SEND_TO.ROOM_EXCEPT_SENDER,
                'sourceId': data.id,
                'roomNo': data.roomNo,
                'id': data.id
              });
            }

            return {//send finish message to player
              'game': C.GAME_RES.ROUND_END,
              'sendTo': C.SEND_TO.USER,
              'targetId': data.id
            }
          } else {  //player hasn't finished
            //send correct answer event to everybody else
            sendToServer({
              'game': C.GAME_RES.ANSWER_CHOSEN,
              'sendTo': C.SEND_TO.ROOM_EXCEPT_SENDER,
              'roomNo': data.roomNo,
              'id': data.id,
              'sourceId': data.id,
              'roomNo': data.roomNo
            });

            return {  //send next question to player
              'game': C.GAME_RES.NEXT_QUESTION,
              'sendTo': C.SEND_TO.USER,
              'targetId': data.id,
              'question': common.removeSolution(
                currentRoom.quiz.questions[currentPlayer.questionCounter])
            };
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
