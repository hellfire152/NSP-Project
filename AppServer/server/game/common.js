/**
  This module contains functions that are common between at least two gaemodes
  The main purpose of this modules is to reduce code length, increase code readability,
  and with more reusing of code debugging becomes easier as well

  Author: Jin Kuan
*/

/*
 Calculates the score for a correct answer
 The score is boosted by the speed difference from the first correct answer,
 and the answer streak of the player
*/
function calculateScore(reward, startTime, answerStreak) {
  //taking the time difference in seconds
  let timeDiff = (Date.now() - startTime) / 1000;
  //set minimum
  if(timeDiff > 60) timeDiff = 60;
  //capping answerStreak bonus at 10
  if(answerStreak > 10) answerStreak = 10;

  //score multipliers
  let streakMultiplier = Math.pow(1.12514, answerStreak) - 0.12514 * answerStreak;
  let speedMultiplier = Math.pow(Math.E, -0.04 * timeDiff) + 0.2;

  //return score after calculation (rounded to int)
  return Math.floor(reward * streakMultiplier * speedMultiplier);
}

/*

*/
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
    let playerData = Object.assign(playerData, player); //copy player data
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
  if(question.type == 0 && answer & question.solution)  //MCQ correct
    || (question.type == 1 && //short answer correct (case insensitive)
    data.answer.toUpperCase() == correctAnswer.toUpperCase())) {
      return true;
  } else {
    return false;
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

  if(question[reward] !== undefined) {  //question specific value
    return question[field];
  } else if(quiz[field] !== undefined) { //quiz-wide value
    return quiz[reward];
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
  'playersObjectToArray': playersObjectToArray
};
