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

function setAllAnswered(players) {
  for(let player in players){
    if(players.hasOwnProperty(player)) {
      player.answered = true;
    }
  }
}

/*
  Returns a sorted array of players, and their results,
  sorted either by points or correct answers, decided by the second argument
*/
function roundEndResults(players, sortByPoints) {
  let results = [];
  Object.keys(players).forEach(player => {
    results.push({
      'player': player,
      'score': players[player].score,
      'correctAnswers': players[player].correctAnswers
    });
  });
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

//testing
calculateScore(100, )
module.exports = {
  'calculateScore': calculateScore,
  'setAllUnanswered': setAllUnanswered
}
