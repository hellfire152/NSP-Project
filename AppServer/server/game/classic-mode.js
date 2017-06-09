/*
  Game logic for the classic gamemode.

  Author: Jin Kuan
*/
var data, C, allRooms, sendToServer, conn;
var currentRoom, currentPlayer;
module.exports = async function(input) {
  ({data, C, allRooms, conn, sendToServer} = input);
  currentRoom = allRooms[data.roomNo];
  currentPlayer = currentRoom.players[data.id];

  console.log("CLASSIC-MODE HANDLER");
  console.log(currentRoom);

  switch(data.game) {
    case C.GAME.START: {
      currentRoom.joinable = false; //room not joinable anymore
      currentRoom.questionCounter = 0; //question counter for the whole room
      let question = currentRoom.quiz.questions[0]; //get first question

      //store answer resutls
      currentRoom.answers = {};

      return sendQuestion(currentRoom, question, data);
    }
    case C.GAME.NEXT_ROUND: {
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
    }
    case C.GAME.SUBMIT_ANSWER: {
      if(currentRoom.answerCount === undefined) currentRoom.answerCount = 0;
      let question = currentRoom.quiz.questions[currentRoom.questionCounter];
      let correctAnswer = question.solution;
      let qType = question.type;

      //if currentPlayer has not answered
      console.log(currentPlayer.answered);
      if(!currentPlayer.answered || currentPlayer.answered === undefined) {
        //store the answer
        if(currentRoom.answers[data.answer] === undefined) {
          currentRoom.answers[data.answer] = 0;
        }
        currentRoom.answers[data.answer]++;

        //calculating score
        console.log(data.answer & correctAnswer);
        if(data.answer & correctAnswer) { //if correctAnswer
          //getting question reward value
          let reward;
          //if question specific reward set
          if(question.reward !== undefined) {
            reward = question.reward;
          } else if(currentRoom.quiz.reward !== undefined) { //quiz-wide reward
            reward = currentRoom.quiz.reward;
          } else {  //default reward value
            reward = 100;
          }
          //score penalty based on time difference from the first correct answerer
          if (currentRoom.timeStart === undefined) {
            currentRoom.timeStart = Date.now();
          }
          currentPlayer.answerStreak++;
          //calculate and store score
          currentRoom.players[data.id].score += common.calculateScore(
            reward, currentRoom.timeStart, currentPlayer.answerStreak
          );
          //increment correctAnswer count
          currentRoom.players[data.id].correctAnswers++;
        } else {  //wrong answer
          if(question.penalty !== undefined) { //if question-specific penalty is defined
            currentRoom.players[data.id].score -= question.penalty;
          } else if(currentRoom.quiz.penalty !== undefined){ //if quiz-wide penalty is defined
            currentRoom.players[data.id].score -= currentRoom.quiz.penalty
          } //no penalty otherwise
        }

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
    default: {
      console.log("CLASSIC MODE: Game event of " +data.game +" is not defined!");
    }
  }
};

/*
  Function for ending the round.
  Delegated to an outside function as this can be triggered in multiple ways
*/
function sendRoundEnd(currentRoom, data, answers, solution) {
  delete currentRoom.timeStart;
  clearTimeout(currentRoom.timer);
  common.setAllAnswered(currentRoom.players);
  return {
    //send round signal
    'game': C.GAME_RES.ROUND_END,
    'sendTo': C.SEND_TO.ROOM,
    'roomNo': data.roomNo,
    'roundEndResults': common.roundEndResults(currentRoom.players, true),
    'answers': answers,
    'solution': solution
  };
}

function sendQuestion(currentRoom, question, data) {
  currentRoom.answerCount = 0;
  common.setAllUnanswered(currentRoom.players);
  //set timer
  currentRoom.timer = setTimeout(() => {
    common.setAllAnswered(currentRoom.players);
    sendToServer(conn,
      sendRoundEnd(currentRoom, data, currentRoom.answers, question.solution)
    );
  }, question.time * 1000);

  return {
    'game': C.GAME_RES.NEXT_QUESTION,
    'sendTo': C.SEND_TO.ROOM,
    'question': { //send question, without the solution
      'prompt': question.prompt,
      'choices': question.choices,
      'time': question.time,
      'type': question.type
    },
    'roomNo': data.roomNo
  }
}

function sendGameEnd(players, data) {
  console.log(players);
  common.setAllAnswered(players);

  let gameEndResults = {};
  gameEndResults.roundEndResults = common.roundEndResults(players, true);
  gameEndResults.game = C.GAME_RES.GAME_END;
  gameEndResults.sendTo = C.SEND_TO.ROOM;
  gameEndResults.roomNo = data.roomNo;

  return gameEndResults;
}
var common = require('./common.js');
