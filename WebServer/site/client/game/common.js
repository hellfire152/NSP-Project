//clears the game area (by settin innerHTML for now)
function clearGameArea() {
  document.getElementById('game').innerHTML = "";
}

function clearBody(){
  let body = document.getElementsByTagName('body')[0];
  body.innerHTML = "";
  //add game div back in
  let gameDiv = document.createElement('div');
  gameDiv.id = 'game';
  body.appendChild(gameDiv);
}

function displayResults(roundEndResults) {
  //create and append a div to hold the results
  let resultsDiv = document.createElement('div');
  resultsDiv.id = 'results';
  document.getElementById('game').appendChild(resultsDiv);

  //create and append a list to hold the results
  let resultsList = document.createElement('ol');
  resultsList.id = 'resultsList';
  resultsDiv.appendChild(resultsList);

  //add player data to the results list
  for(let playerResult of roundEndResults) {
    //create a li for each player
    let playerData = document.createElement('li');

    //format results and append
    playerData.appendChild(document.createTextNode('Id: ' +playerResult.player +'\t'
      + 'Score: ' +playerResult.score +'\t Correct Answers: ' + playerResult.correctAnswers));

    resultsList.appendChild(playerData);
  }
}
