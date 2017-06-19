var data, C, allRooms, conn, sendToServer;
module.exports = function(input) {
  ({data, C, allRooms, conn, sendToServer} = input);
  currentRoom = allRooms[data.roomNo];
  currentPlayer = currentRoom.players[data.id];

  switch(data.game) {
    case C.GAME.START: {  //after team select
      currentRoom.joinable = false;
      //initialize tracking variable
      currentRoom.questionCounter = 0;
      common.setAllUnanswered(currentRoom.players);

      //store questions
      currentRoom.answers = {};

      //send first question
      let question = currentRoom.quiz.questions[currentRoom.questionCounter];
      return {
        'game': C.GAME_RES.NEXT_QUESTION,
        'question': common.removeSolution(question),
        'sendTo': C.SEND_TO.ROOM,
        'roomNo': data.roomNo
      };
    }
    case C.GAME.SUBMIT_TEAM_NO: {
      //check max/min number of teams
      if(data.teamNo < 2 || data.teamNo > 10) {
        return {
          'err': C.ERR.INVALID_TEAM_NO,
          'id': data.id
        }
      }

      //new property to track all teams
      currentRoom.teams = [];
      for(let i = 0; i < data.teamNo; i++) {
        currentRoom.teams.push(createTeam());
      }

      return {
        'game' : C.GAME_RES.CONFIRM_TEAM_NO,
        'teamNo' : data.teamNo,
        'sendTo' : C.SEND_TO.USER,
        'targetId' : data.id
      }
    }
    case C.GAME.SUBMIT_TEAM: {
      if(currentRoom.teams[data.teamNo] === undefined) {
        return {
          'err': C.ERR.TEAM_DOES_NOT_EXIST,
          'id': data.id,
          'teamNo': data.teamNo
        }
      }
      //set team on player
      currentPlayer.team = data.teamNo;

      //send submit event to all
      return {
        'game': C.GAME_RES.TEAM_CHOSEN,
        'id' : data.id,
        'teamNo': data.teamNo,
        'sendTo': C.SEND_TO.ROOM,
        'roomNo': data.roomNo
      };
    }
    case C.GAME.SUBMIT_ANSWER: { //mostly copied from classic
      if(currentRoom.answerCount === undefined) currentRoom.answerCount = 0;
      let question = currentRoom.quiz.questions[currentRoom.questionCounter];

      //if currentPlayer has not answered
      if(!currentPlayer.answered || currentPlayer.answered === undefined) {
        //store the answer
        if(currentRoom.answers[data.answer] === undefined) {
          currentRoom.answers[data.answer] = 0;
        }
        currentRoom.answers[data.answer]++;

        common.handleScoring({
          'data': data,
          'currentRoom': currentRoom,
          'currentPlayer': currentPlayer
        });

        currentPlayer.answered = true;
        currentRoom.answerCount++;

        if(currentRoom.answerCount == currentRoom.playerCount) {
          //stop the auto round end on timer end
          clearTimeout(currentRoom.timer);
          return sendRoundEnd(currentRoom, data, currentRoom.answers);
        } else {
          //send response for host
          return {
            'game': C.GAME_RES.ANSWER_CHOSEN,
            'sendTo': C.SEND_TO.USER,
            'targetId': currentRoom.host,
            'id': data.id,
            'answer': data.answer
          };
        }
      } else {  //if user has answered
        return {
          'err': C.ERR.ALREADY_ANSWERED,
          'sendTo': C.SEND_TO.USER,
          'targetId': data.id,
          'id': data.id,
          'roomNo': data.roomNo
        }
      }
      break;
    }
    case C.GAME.NEXT_ROUND: {
      //send next round (copied from classic mode)
      currentRoom.questionCounter++;
      let questions = currentRoom.quiz.questions;
      //if there are no questions left
      if(currentRoom.questionCounter >= questions.length) {
        //TODO::CAULCULATE TITLES
        console.log("GAME " +data.roomNo +" END");
        return sendGameEnd(currentRoom.players, data);
      } else { //next question available
        return sendQuestion(currentRoom, questions[currentRoom.questionCounter], data);
      }
      break;
    }
  }
};

function createTeam() {
  return {
    'players' : [],
    'totalScore' : 0
  }
}

var common = require('./common.js');
