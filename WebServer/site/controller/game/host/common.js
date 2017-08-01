/*
  Basically play's common.js, without all the PIXI stuff.

  Author: Jin Kuan
*/
/*
  Called at the end of the game. This will initlaize 3 divs:
    1. The rankings and titles and achievements divs
    2. The rating screen (will be filled in on each side separately)
    3. The end screen (Thanks for playing!)
  And 2 buttons, next and previous to show/hide the 3 things one at a time.
*/
function gameEnd(response) {
  var currentScene;
  //remove the PIXI canvas from the window
  try {
    let appView = document.getElementsByTagName('canvas')[0];
    appView.parentNode.removeChild(appView);
  } catch (e) {console.log(e)};

  //initializing the various divs
  let rankingDiv = createNode('div', null, null, 'ranking');
  let taDiv = createNode('div', null, null, 'titles-achievements');
  let ratingDiv = createNode('div', null, null, 'rating');
  let endDiv = createNode('div', null, null, 'end');
  rankingDiv.style.display = taDiv.style.display = ratingDiv.style.display
    = endDiv.style.display = 'none';

  //show rankings
  //ranking header
  let rankingHeader = createNode('h1', 'Final rankings:', null, 'ranking-header');
  rankingDiv.appendChild(rankingHeader);
  //generating a display for each player
  for(let i = 0, player = response.roundEndResults[i];
      i < response.roundEndResults.length;
      i++, player = response.roundEndResults[i]) {
    //generate new ranking display
    let playerRankingDiv = createNode('div', null, 'player-ranking');

    let rank = createNode('h2', `#${i + 1}`, 'player-rank', `rank-${i + 1}`);

    //append the various data of the player
    playerRankingDiv.appendChild(rank);
    for(let playerAttr in player) {
      if(player.hasOwnProperty(playerAttr)) {
        let attr = createNode(
          'p', `${playerAttr}:\t${player[playerAttr]}`, 'player-attr', `player-${player[playerAttr]}`);
        appendMultiple(playerRankingDiv, attr);
      }
    }

    appendMultiple(rankingDiv, playerRankingDiv);
  }

  //the display for people who got titles and/or achievements
  let titleHeader = createNode('h2', 'Titles/Achievements gotten', 'title', 'title-header');
  taDiv.appendChild(titleHeader);
  for(let title of response.titlesAndAchievenments) {
    let titleDisplay = createNode('div', null, 'title-display');
    let titleName = createNode('p', title.name, 'title-name');
    let titleIcon = createNode('img', null, 'title-icon');
    titleIcon.src = `/resources/images/${title.icon}`;
    let earningPlayer = createNode('p', title.recipient, 'title-recipient');
    let description = createNode('p', title.description, 'title-description');
    appendMultiple(titleDisplay, titleName, titleIcon, earningPlayer, description);
    taDiv.appendChild(titleDisplay);
  }

  /*RATINGS DONE ON EACH GAME LOGIC FILE*/

  //now for the end screen
  let endScreen = createNode('h1', 'Thanks for playing!', 'end-header');
  endDiv.appendChild(endScreen);

  //buttons to toggle between the few scenes
  //ranking + titles and achievements -> rating -> end
  let nextButton = createNode('button', 'Next', null, 'next-button');
  nextButton.onclick = () => {
    rankingDiv.style.display = taDiv.style.display = ratingDiv.style.display
      = endDiv.style.display = 'none';
    if(currentScene == 'ranking') {
      ratingDiv.style.display = 'block';
      prevButton.style.display = 'block'; //show previous button
      currentScene = 'rating';
    } else if(currentScene == 'rating') {
      document.getElementById('end').style.display = 'block';
      nextButton.style.display = 'none'; //hide next button
      currentScene = 'end';
    } else throw new Error('No more scenes!');
  }

  let prevButton = createNode('button', 'Previous', null, 'prev-button');
  prevButton.style.display = 'none';
  prevButton.onclick = () => {
    rankingDiv.style.display = taDiv.style.display = ratingDiv.style.display
      = endDiv.style.display = 'none';
    if(currentScene == 'end') {
      endDiv.style.display = 'none';
      ratingDiv.style.display = 'block';
      nextButton.style.display = 'block'; //show next button
      currentScene = 'rating';
    }
    else if(currentScene == 'rating') {
      prevButton.style.display = 'none'; //hide previous button
      rankingDiv.style.display = taDiv.style.display = 'block';
      currentScene = 'ranking';
    } else {
      throw new Error('Cannot go back further!');
    }
  }

  //show ranking and titles + achievements first
  currentScene = 'ranking';
  rankingDiv.style.display = taDiv.style.display = 'block';
  appendMultiple(document.body,
    rankingDiv, taDiv, ratingDiv, endDiv, nextButton, prevButton);
}

function createNode(type, text, cssClass, id) {
  let n = document.createElement(type);
  if(id) n.id = id;
  if(cssClass) n.className += ' '+cssClass;
  if(text)
    n.appendChild(document.createTextNode(text));
  return n;
}

function appendMultiple(parent, ...children) {
  for(let child of children) {
    parent.appendChild(child);
  }
}
