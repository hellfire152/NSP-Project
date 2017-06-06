function calculateScore(reward, startTime, answerStreak) {
  //taking the time difference in seconds
  let timeDiff = (Date.now() - startTime) / 1000;
  //set minimum
  if(timeDiff > 60) timeDiff -
  //capping answerStreak bonus at 10
  if(answerStreak > 10) answerStreak = 10;

  //score multipliers
  let streakMultiplier = Math.pow(1.12514, answerStreak) - 0.12514 * answerStreak;
  let speedMultiplier = Math.pow(Math.E, -0.04 * timeDiff) + 0.2;

  //return score after calculation (rounded to nearest int)
  return Math.floor(reward * streakMultiplier * speedMultiplier);
}

function setAllUnanswered(players) {
  for(let player in players){
    if(players.hasOwnProperty(player)) {
      delete player.answered;
    }
  }
}

function roundEnd(players) {
  Object.keys(players).forEach(player => {
    
  });
}

//testing
calculateScore(100, )
module.exports = {
  'calculateScore': calculateScore,
  'setAllUnanswered': setAllUnanswered
}
