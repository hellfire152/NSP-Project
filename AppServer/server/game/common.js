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
  let titles = []; //object that will be returned

  //calculating "Speedy!" and "sleepy..."
  let fastestPlayer, fastestTime = Number.MAX_VALUE, slowestPlayer, slowestTime = 0,
  mostCorrectPlayer, mostCorrect = 0, mostWrongPlayer, mostWrong = 0;
  //get the fastest and the slowest
  for(let player in players) {
    if(players.hasOwnProperty(player)) {
      if(players[player].title === undefined) {
        if(players[player].answerTime) {
          let ansTime = players[player].answerTime;
          if(ansTime < fastestTime) {
            fastestTime = ansTime;
            fastestPlayer = player;
          }
          if(ansTime > slowestTime) {
            slowestTime = ansTime;
            slowestPlayer = player;
          }
        }
        if(players[player].correctAnswers) {
          if(players[player].correctAnswers > mostCorrect) {
            mostCorrectPlayer = player;
          }
          if(players[player].wrongAnswers > mostWrong) {
            mostWrongPlayer = player;
          }
        }
      }
    }
  }
  //assigning fastest and slowest titles
  let fastestTitle = T.SPEEDY;
  fastestTitle.recipient = fastestPlayer;
  let slowestTitle = T.SLEEPY;
  slowestTitle.recipient = slowestPlayer;
  let correctTitle = T.ACCURATE;
  correctTitle.recipient = mostCorrectPlayer;
  let wrongTitle = T.CONFUSED;
  wrongTitle.recipient = mostWrongPlayer;

  titles.push(fastestTitle);
  titles.push(slowestTitle);
  titles.push(correctTitle);
  titles.push(wrongTitle);

  //TODO::CALCULATE MORE TITLES
  return titles;
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
    playerData.name = player; //add the player id inside
    playersArr.push(playerData);
  });
  return playersArr;
}

/*
  Returns a sorted array of players, and their results,
  sorted either by points or correct answers, decided by the second argument
*/
function roundEndResults(players, sortBy) {
  let results = playersObjectToArray(players);
  results.sort((a, b) => {  //sort by points
    return parseInt(a[sortBy]) - parseInt(b[sortBy]);
  });
  return results;
}

/*
  Returns true on a correct answer, false on wrong
*/
function checkCorrectAnswer(question, answer) {
  if((question.type == 0 && answer & question.solution)  //MCQ correct
    || (question.type == 1 && //short answer correct (case insensitive)
    answer.trim().toUpperCase() == question.solution.trim().toUpperCase())) {
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

  Returns an object, with properties:
    correct : boolean,
    score : int
*/
function handleScoring(input) {
  let {data, currentRoom, currentPlayer} = input;
  let question = currentRoom.quiz.questions[currentRoom.questionCounter];

  //calculating score
  let correct = checkCorrectAnswer(question, data.answer);
  if(correct) {
    //getting question reward value
    let reward = getReward(currentRoom.quiz, question);

    //score penalty based on time difference from the first correct answer
    if (currentRoom.timeStart === undefined) {
      currentRoom.timeStart = Date.now();
    }
    currentPlayer.answerStreak++;

    let answerTime = Date.now();  //track answering time
    if(currentPlayer.answerTime === undefined)  currentPlayer.answerTime = 0;
    currentPlayer.answerTime += answerTime - currentRoom.timeStart;

    //calculate and store score
    currentPlayer.score += calculateScore(
      reward, currentRoom.timeStart, answerTime, currentPlayer.answerStreak
    );
    //increment correctAnswer count
    currentPlayer.correctAnswers++;
    //set another tracking variable for correct in that round
    currentPlayer.roundCorrect = true;
  } else {  //wrong answer
    currentPlayer.score -= getPenalty(currentRoom.quiz, question);
    //reset answer streak
    currentPlayer.answerStreak = 0;
    //set another tracking variable for correct in that round
    currentPlayer.roundCorrect = true;
  }
  return {
    'correct' : correct,
    'score' : currentPlayer.score
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

  if(question[field] !== undefined && !(parseInt(question[field]) == 0)) {  //question specific value
    return question[field];
  } else if(quiz[field] !== undefined && !(parseInt(quiz[field] == 0))) { //quiz-wide value
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

function handleClearGameCookie(players){
    //get all player name
    let users = [];
    for(let playerName in players) {
      users.push(playerName);
    }

    return users;
}

function storeResults(dbConn, players) {
  let results = playersObjectToArray(players);
  dbConn.send({
    data : {
      type : C.DB.UPDATE.STATS,
      result : results
    }
  }, (response) => {
    console.log('Data stored');
  });
}

module.exports = {
  'calculateScore': calculateScore,
  'calculateTitles' : calculateTitles,
  'setAllUnanswered': setAllUnanswered,
  'setAllAnswered': setAllAnswered,
  'roundEndResults': roundEndResults,
  'checkCorrectAnswer': checkCorrectAnswer,
  'getReward': getReward,
  'getPenalty': getPenalty,
  'playersObjectToArray': playersObjectToArray,
  'removeSolution' : removeSolution,
  'getResponseData' : getResponseData,
  'handleScoring' : handleScoring,
  'handleClearGameCookie' : handleClearGameCookie,
  'storeResults' : storeResults
};
