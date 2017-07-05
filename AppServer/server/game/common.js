/**
  This module contains functions that are common between at least two gaemodes
  The main purpose of this modules is to reduce code length, increase code readability,
  and with more reusing of code debugging becomes easier as well

  Author: Jin Kuan
*/
const T = require('./titles.json');
const C = require('../../../custom-API/constants.json');
/*
 Calculates the score for a correct answer
 The score is boosted by the speed difference from the first correct answer,
 and the answer streak of the player
*/
function calculateScore(reward, startTime, answerTime, answerStreak) {
  //taking the time difference in seconds
  let timeDiff = (answerTime - startTime) / 1000;
  //timeDiff caps at 60
  if(timeDiff > 60) timeDiff = 60;
  //capping answerStreak bonus at 10
  if(answerStreak > 10) answerStreak = 10;

  //score multipliers
  let streakMultiplier = Math.pow(1.12514, answerStreak) - 0.12514 * answerStreak;
  let speedMultiplier = Math.pow(Math.E, -0.04 * timeDiff) + 0.2;

  //return score after calculation (rounded to int)
  return Math.floor(reward * streakMultiplier * speedMultiplier);
}

function calculateTitles(currentRoom) {
  let players = currentRoom.players;
  let questionsNo = currentRoom.quiz.questions.length;

  //calculating "Speedy!" and "sleepy..."
  let fastestPlayer, fastestTime = Number.MAX_VALUE, slowestPlayer, slowestTime = 0;
  //get the fastest and the slowest
  for(let player of players) {
    if(player.title === undefined) {
      if(player.answerTime) {
        let ansTime = player.answerTime / questionsNo;
        if(ansTime < fastestTime) {
          fastestTime = ansTime;
          fastestPlayer = player;
        }
        if(ansTime > slowestTime) {
          slowestTime = ansTime;
          slowestPlayer = player;
        }
      }
    }
  }
  fastestPlayer.title = T.SPEEDY;
  slowestPlayer.title = T.SLEEPY;

  //TODO::CALCULATE MORE TITLES
}

function removeSolution(question) {
  return {
    'prompt': question.prompt,
    'choices': question.choices,
    'time': question.time,
    'type': question.type
  };
}

function setAllUnanswered(players) {
  for(let player in players){
    if(players.hasOwnProperty(player)) {
      players[player].answered = false;
    }
  }
}

function setAllAnswered(players) {
  for(let player in players){
    if(players.hasOwnProperty(player)) {
      players[player].answered = true;
    }
  }
}

/*
  Takes in an object of players, and all their respective stats,
  and turns it into an array
*/
function playersObjectToArray(players) {
  let playersArr = [];
  Object.keys(players).forEach(player => {  //iterate over all players
    let playerData = Object.assign({}, players[player]); //copy player data
    playerData.player = player; //add the player id inside
    playersArr.push(playerData);
  });
}

/*
  Returns a sorted array of players, and their results,
  sorted either by points or correct answers, decided by the second argument
*/
function roundEndResults(players, sortByPoints) {
  let results = playersObjectToArray(players);
  if(sortByPoints) {
    results.sort((a, b) => {  //sort by points
      return parseInt(a.score) - parseInt(b.score);
    });
  } else {
    results.sort((a, b) => {  //sort by correct answers
      return parseInt(a.correctAnswers) - parseInt(b.correctAnswers);
    });
  }
  return results;
}

function checkCorrectAnswer(question, answer) {
  if((question.type == 0 && answer & question.solution)  //MCQ correct
    || (question.type == 1 && //short answer correct (case insensitive)
    data.answer.toUpperCase() == correctAnswer.toUpperCase())) {
      return true;
  } else {
    return false;
  }
}

/*
  Returns an object representing the response data of that round
  Also clears the response data of the current round
*/
function getResponseData(currentRoom, data) {
  let question = currentRoom.quiz.questions[currentRoom.questionCounter];
  //formatting data for the bar graph
  let responseData = {};
  responseData.labels = [];
  responseData.values = [];
  if(question.type == 0) {  //MCQ type
    let solution = 8;
    for(let label of question.choices) {
      responseData.labels.push(label);
      if(currentRoom.answers[solution]) {
        responseData.values.push(currentRoom.answers[solution]);
      } else {
        responseData.values.push(0);
      }
      solution /= 2;
    }
  } else {  //short answer type
    for(let label in currentRoom.answers) {
      if(currentRoom.answers.hasOwnProperty(label)) {
        responseData.labels.push(label);
        responseData.values.push(currentRoom.answers[label]);
      }
    }
  }
  //sending score
  let scoreData = {};
  for(let player in currentRoom.players) {
    if(currentRoom.players.hasOwnProperty(player)) {
      scoreData[player] = {
        'score' : currentRoom.players[player].score,
        'correctAnswers' : currentRoom.players[player].correctAnswers
      }
    }
  }

  //clear response data
  currentRoom.answers = {};
  
  return {
    'game' : C.GAME_RES.RESPONSE_DATA,
    'question' : question,
    'solution' : question.solution,
    'sendTo' : C.SEND_TO.ROOM,
    'responseData' : responseData,
    'scoreData' : scoreData,
    'roomNo' : data.roomNo
  }
}
/*
  Handles checking the answer, and calculating the score appropriately
*/
function handleScoring(input) {
  let {data, currentRoom, currentPlayer} = input;
  let question = currentRoom.quiz.questions[currentRoom.questionCounter];

  //calculating score
  if(checkCorrectAnswer(question, data.answer)) {
    //getting question reward value
    let reward = getReward(currentRoom.quiz, question);

    //score penalty based on time difference from the first correct answer
    if (currentRoom.timeStart === undefined) {
      currentRoom.timeStart = Date.now();
    }
    currentPlayer.answerStreak++;

    let answerTime = Date.now();  //track answering time
    if(currentPlayer.answerTime === undefined)  currentPlayer.answerTime = 0;
    currentPlayer.answerTime += answerTime;

    //calculate and store score
    currentPlayer.score += calculateScore(
      reward, currentRoom.timeStart, answerTime, currentPlayer.answerStreak
    );
    //increment correctAnswer count
    currentPlayer.correctAnswers++;
  } else {  //wrong answer
    currentPlayer.score -= getPenalty(currentRoom.quiz, question);
    //reser answer streak
    currentPlayer.answerStreak = 0;
  }
}

/*
  Private function for getting the reward/penalty out
  This function should not be used outside of this module, if there is a need to
  get the reward or penalty, use getReward and getPenalty instead
*/
function __getRewardOrPenalty(quiz, question, reward) {
  if(question === null || question === undefined) {
    throw new Error('GETREWARD: No question supplied!');
  }
  let field = reward ? 'reward' : 'penalty';

  if(question[field] !== undefined) {  //question specific value
    return question[field];
  } else if(quiz[field] !== undefined) { //quiz-wide value
    return quiz[field];
  } else {  //default reward : penalty values
    return reward ? 100 : 0;
  }
}

function getReward(currentRoom, question) {
  return __getRewardOrPenalty(currentRoom, question, true);
}

function getPenalty(currentRoom, question) {
  return __getRewardOrPenalty(currentRoom, question, false);
}

module.exports = {
  'calculateScore': calculateScore,
  'setAllUnanswered': setAllUnanswered,
  'setAllAnswered': setAllAnswered,
  'roundEndResults': roundEndResults,
  'checkCorrectAnswer': checkCorrectAnswer,
  'getReward': getReward,
  'getPenalty': getPenalty,
  'playersObjectToArray': playersObjectToArray,
  'removeSolution' : removeSolution,
  'getResponseData' : getResponseData,
  'handleScoring' : handleScoring
};
