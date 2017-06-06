/*
  Game logic for the classic gamemode.

  Author: Jin Kuan
*/
var data, C, allRooms, sendToServer, conn;
var currentRoom, currentPlayer;
module.exports = async function(input) {
  data = input.data;
  C = input.C;
  allRooms = input.allRooms;
  currentRoom = allRooms[data.roomNo];
  currentPlayer = currentRoom.players[data.id];
  sendToServer = input.sendToServer;
  conn = input.conn;

  console.log("CLASSIC-MODE HANDLER");
  console.log(currentRoom);

  switch(data.game) {
    case C.GAME.START: {
      currentRoom.joinable = false; //room not joinable anymore
      currentRoom.questionCounter = 0; //question counter for the whole room
      let question = currentRoom.quiz.questions[0]; //get first question

      //store answer resutls
      currentRoom.answers = {};

      //set timer
      currentRoom.timer = setTimeout(() => {
        common.setAllAnswered(currentRoom.players);
        sendToServer({
          sendRoundEnd(currentRoom, data, currentRoom.answers, question.solution);
        });
      }, question.time * 1000);

      return {
        'game': C.GAME_RES.BEGIN_FIRST_QUESTION,
        'question': { //send question, without the solution
          'prompt': question.prompt,
          'choices': question.choices,
          'time': question.time,
          'type': question.type
        },
        'roomNo': data.roomNo
      }
    }
    case C.GAME.NEXT_ROUND: {

      break;
    }
    case C.GAME.SUBMIT_ANSWER: {
      if(currentRoom.answerCount === undefined) currentRoom.answerCount = 0;
      let question = currentRoom.quiz.question[currentRoom.questionCounter];
      let correctAnswer = question.solution;
      let qType = question.type;

      if(currentPlayer.answered === undefined) { if //if currentPlayer has not answered
        //store the answer
        if(currentRoom.answers[data.answer] === undefined) {
          currentRoom.answers[data.answer] = 0;
        }
        currentRoom.answers[data.answer]++;

        //calculating score
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
          //score penalty based on time difference from the first answerer
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
            'hostId': currentRoom.host,
            'id': data.id,
            'answer': data.answer
          };
        }
      } else {  //if user has answered
        return {
          'err': C.ERR.ALREADY_ANSWERED,
          'id': data.id,
          'roomNo': data.roomNo
        }
      }
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
function sendRoundEnd(currentRoom, data, answers) {
  return {
    //send round signal
    'game': C.GAME_RES.ROUND_END,
    'roomNo': data.roomNo,
    'roundEndResults': common.roundEndResults(currentRoom.players, true);
    'answers': answers
  };
}

var common = require('./common.js');
