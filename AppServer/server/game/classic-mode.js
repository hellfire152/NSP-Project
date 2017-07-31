/*
  Game logic for the classic gamemode.

  Author: Jin Kuan
*/
var common = require('./common.js');
var C, sendToServer, conn;
module.exports = async function(input) {
  let {data, allRooms} = input;
  ({C, conn, sendToServer} = input);
  let currentRoom = allRooms[data.roomNo];
  let currentPlayer = currentRoom.players[data.id];

  console.log("CLASSIC-MODE HANDLER");
  console.log(currentRoom);

  switch(data.game) {
    case C.GAME.START: {
      if(data.id = currentRoom.host) {
        currentRoom.joinable = false; //room not joinable anymore
        currentRoom.questionCounter = 0; //question counter for the whole room
        let question = currentRoom.quiz.questions[0]; //get first question

        //store answer resutls
        currentRoom.answers = {};

        //send next question 5 seconds after get ready
        setTimeout(() => {
          let q = sendQuestion(currentRoom, question, data);
          sendToServer(conn, q);
        }, 5000);

        //send the get ready signal...
        return {
          'game' : C.GAME_RES.GET_READY,
          'roomNo' : data.roomNo,
          'sendTo' : C.SEND_TO.ROOM
        }
      } else {
        return {
          'game' : C.ERR.NOT_THE_HOST,
          'roomNo': data.roomNo,
          'targetId' : data.id,
          'id' : data.id
        }
      }
    }
    case C.GAME.NEXT_ROUND: {
      if(currentRoom.summarySent) { //first next press, send summary screen
        currentRoom.summarySent = false;
        if(currentRoom.questionCounter !== undefined) {
          currentRoom.questionCounter++;
          let questions = currentRoom.quiz.questions;
          //if there are no questions left
          if(currentRoom.questionCounter >= questions.length) {
            //TODO::CAULCULATE TITLES
            console.log("GAME " +data.roomNo +" END");
            //send

            return sendGameEnd(currentRoom.players, data, allRooms);
          } else { //next question available
            return sendQuestion(currentRoom, questions[currentRoom.questionCounter], data);
          }
        } else {
          return {
            'err' : C.ERR.GAME_HAS_NOT_STARTED,
            'roomNo' : data.roomNo,
            'targetId' : data.id,
            'sendTo' : C.SEND_TO.USER
          }
        }
      } else { //next next press, send the next question (start new round)
        currentRoom.summarySent = true;
        return {
          'game' : C.GAME_RES.ROUND_END,
          'roundEndResults' : common.roundEndResults(currentRoom.players, 'score'),
          'sendTo' : C.SEND_TO.ROOM,
          'roomNo' : data.roomNo
        }
      }
    }
    case C.GAME.SUBMIT_ANSWER: {
      if(currentRoom.answerCount === undefined) currentRoom.answerCount = 0;
      let question = currentRoom.quiz.questions[currentRoom.questionCounter];
      let correctAnswer = question.solution;
      let qType = question.type;

      //if currentPlayer has not answered
      if(!currentPlayer.answered || currentPlayer.answered === undefined) {
        //store the answer
        if(currentRoom.answers[data.answer] === undefined) {
          currentRoom.answers[data.answer] = 0;
        }
        currentRoom.answers[data.answer]++;

        common.handleScoring({
          'data' : data,
          'currentRoom' : currentRoom,
          'currentPlayer' : currentPlayer
        });

        //tracking variables
        currentPlayer.answered = true;
        currentRoom.answerCount++;

        //once all players answer...
        if(currentRoom.answerCount >= currentRoom.playerCount) {
          //stop the auto round end
          clearTimeout(currentRoom.timer);
          console.log(
            `ROOM ${data.roomNo} ALL ANSWERED FOR QUESTION ${currentRoom.questionCounter}`);
          common.setAllAnswered(currentRoom.players);
          return common.getResponseData(currentRoom, data);
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
    'roundEndResults': common.roundEndResults(currentRoom.players, 'score'),
    'answers': answers,
    'solution': solution
  };
}

function sendQuestion(currentRoom, question, data) {
  currentRoom.answerCount = 0;
  common.setAllUnanswered(currentRoom.players)
  //set timer
  currentRoom.timer = setTimeout(() => {
    console.log(`ROOM ${data.roomNo} RAN OUT OF TIME`);
    for(let player in currentRoom.players) {
      if(currentRoom.players.hasOwnProperty(player)) {
        if(!player.answered) { //player has NOT answered
          player.score -= common.getPenalty(currentRoom, question);
          player.answered = true;
        }
      }
    }
    sendToServer(conn,
      common.getResponseData(currentRoom, data)
    );
  }, question.time * 1000);

  return {
    'game': C.GAME_RES.NEXT_QUESTION,
    'sendTo': C.SEND_TO.ROOM,
    'question': common.removeSolution(question),
    'roomNo': data.roomNo
  }
}

function sendGameEnd(players, data, allRooms) {
  common.setAllAnswered(players);

  let gameEndResults = {};
  gameEndResults.roundEndResults = common.roundEndResults(players, 'score');
  gameEndResults.game = C.GAME_RES.GAME_END;
  gameEndResults.sendTo = C.SEND_TO.ROOM;
  gameEndResults.roomNo = data.roomNo;

  gameEndResults.titlesAndAchievenments
    = common.calculateTitles(allRooms[data.roomNo]);

  //send clear game cookie signal
  setTimeout(() => {
    let users = common.handleClearGameCookie(allRooms[data.roomNo].players);
    sendToServer(conn, {
      'special' : C.SPECIAL.CLEAR_ALL_GAME_COOKIE,
      'users' : users
    });
  }, 1000);
  
  return gameEndResults;
}
