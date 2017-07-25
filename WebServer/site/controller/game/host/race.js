/*
  handleGame function for the classic gamemode
*/
var playerObj = {};
console.log('Loaded: Race gamemode handler!');
async function handleGame(data) {
  switch(data) {
    case C.GAME_RES.GET_READY: {
      let header = createNode('div', 'Race!', 'header', 'race-header');
      header.style.display = 'none';

      let totalQuestions =
        createNode('div', `Total questions: ${data.totalQuestions}`, 'header', 'race-total-questions');
      totalQuestions.style.display = 'none';

      initHost(data.players);

      appendMultiple(document.body(header.totalQuestions));
      break;
    }
    case C.GAME_RES.START: {
      //show all the relevant divs
      document.getElementById('race-header').style.display = 'block';
      document.getElementById('race-total-questions').style.display = 'block';
      document.getElementById('players-prompt').style.display = 'block';
      break;
    }
    case C.GAME_RES.NEXT_QUESTION : {
      //do nothing
      break;
    }
    case C.GAME_RES.ANSWER_CHOSEN: {
      let playerSpan = document.getElementById(`player-${data.id}-progress`);
      playerSpan.innerHTML = ""; //clear span
      //re add counter
      playerProgress.appendChild(document.createTextNode(response.questionNo));
      break;
    }
    case C.GAME_RES.PLAYER_FINISH : {
      let playerLi = document.getElementById(`player-${data.id}`);
      //do something with it
      playerLi.style.border = '3px solid green';
      break;
    }
    case C.GAME_RES.GAME_END: {
      //hide the other divs
      document.getElementById('players-prompt').style.display = 'none';
      document.getElementById('race-total-questions').style.display = 'none';
      document.getElementById('race-header').style.display = 'none';
      //show the game ranking div
      document.getElementById('ranking').style.display = 'block';
      break;
    }
  }
}

/**
  Initialize function for the host side
  This creates a div to show the current question and its responses,
  and a ranking div for the game
*/
function initHost(players) {
  firstQuestion = false;

  let playersDiv = createNode('div', null, 'players', 'players-prompt');
  let playersUl = createNode('ul', 'Players:', 'players-list', 'players-list-header');
  playersDiv.appendChild(playersUi);

  //create a list element for each player
  for(let player in players) {
    if(players.hasOwnProperty(player)) {
      let playerLi = createNode(
        'li', `${players[player].name}: `, 'players-list', `player-${player}`);
      let playerProgressSpan = createNode(
        'span', 0, 'players-list', `player-${player}-progress`);
      playerLi.appendChild(playerProgressSpan);
      playersUi.appendChild(playerLi);
    }
  }

  //init ranking stuff
  let gameRankingDiv = document.createElement('div');
  gameRankingDiv.id = 'game-ranking';

  gameRankingDiv.style.display =
    currentQuestionDiv.style.display = 'none';

  appendMultiple(document.body, gameRankingDiv, playersDiv);
}
