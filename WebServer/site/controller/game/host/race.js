/*
  handleGame function for the classic gamemode
*/
var playerObj = {};
var totalQuestions;
console.log('Loaded: Race gamemode handler!');
function handleGame(response) {
  switch(response.game) {
    case C.GAME_RES.GET_READY: {
      let header = createNode('div', 'Race!', 'header', 'race-header');
      header.style.display = 'none';

      totalQuestions = response.totalQuestions;
      appendMultiple(document.body, header);
      initHost(response.players);
      break;
    }
    case C.GAME_RES.NEXT_QUESTION : {
      document.getElementById('get-ready').style.display = 'none';
      document.getElementById('race-header').style.display = 'block';
      document.getElementById('players-prompt').style.display = 'block';
      break;
    }
    case C.GAME_RES.ANSWER_CHOSEN: {
      let playerSpan = document.getElementById(`player-${response.id}-progress`);
      playerSpan.innerHTML = ""; //clear span
      //re add counter
      playerSpan.appendChild(document.createTextNode(`${response.questionNo - 1}/${totalQuestions}`));
      break;
    }
    case C.GAME_RES.PLAYER_FINISH : {
      let playerLi = document.getElementById(`player-${response.id}`);
      //outline in green
      playerLi.style.border = '3px solid green';

      //update the question counter
      let playerSpan = document.getElementById(`player-${response.id}-progress`);
      playerSpan.innerHTML = "";
      playerSpan.appendChild(document.createTextNode(`${totalQuestions}/${totalQuestions}`));
      break;
    }
    case C.GAME_RES.GAME_END: {
      //hide the other divs
      document.getElementById('players-prompt').style.display = 'none';
      document.getElementById('race-header').style.display = 'none';

      //game end display
      gameEnd(response);
      break;
    }
    default: {
      console.log(`Response GAME value is ${response.game}, not a preset case!`);
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
  playersDiv.appendChild(playersUl);

  //create a list element for each player
  for(let player in players) {
    if(players.hasOwnProperty(player)) {
      let playerLi = createNode(
        'li', `${player}: `, 'players-list', `player-${player}`);
      let playerProgressSpan = createNode(
        'span', '0', 'players-list', `player-${player}-progress`);
      playerLi.appendChild(playerProgressSpan);
      playersUl.appendChild(playerLi);
    }
  }

  appendMultiple(document.body, playersDiv);
}
