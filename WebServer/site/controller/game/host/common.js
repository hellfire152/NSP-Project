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

  //hidden table for Excel
  let table = createNode('table', null, 'excel', 'excel-table');
  //table header row
  let tableHeader = createNode('tr', null, 'table-header-row', 'table-header');
  tableHeader.appendChild(createNode('th', 'Username', 'table-header', 'table-username'));
  tableHeader.appendChild(createNode('th', 'Correct Answers', 'table-header', 'table-correct'));
  tableHeader.appendChild(createNode('th', 'Wrong Answers', 'table-header', 'table-wrong'));
  tableHeader.appendChild(createNode('th', 'Score', 'table-header', 'table-score'));
  table.appendChild(tableHeader);
  document.body.appendChild(table);

  //generating a display for each player
  for(let i = 0, player = response.roundEndResults[i];
      i < response.roundEndResults.length;
      i++, player = response.roundEndResults[i]) {
    //generate new ranking display
    let playerRankingDiv = createNode('div', null, 'player-ranking');

    let rank = createNode('h2', `#${i + 1}`, 'player-rank', `rank-${i + 1}`);

    //append the various data of the player
    playerRankingDiv.appendChild(rank);
    let name = createNode('p', player.name, 'player-name player-attr', null);
    let correct = createNode('p', `${player.correctAnswers}/${player.wrongAnswers}`, 'player-correct player-attr', null);
    let score = createNode('p', player.score, 'player-score player-attr', null);

    //for Excel
    let tableRow = createNode('tr', null, 'table-row', null);
    let tableUsername = createNode('td', player.name, 'table-username table-element', null);
    let tableCorrect = createNode('td', player.correctAnswers, 'table-correct table-element', null);
    let tableWrong = createNode('td', player.wrongAnswers, 'table-username table-element', null);
    let tableScore = createNode('td', player.score, 'table-username table-element', null);
    appendMultiple(tableRow, tableUsername, tableCorrect, tableWrong, tableScore);
    table.appendChild(tableRow);
    appendMultiple(rankingDiv, name, score, correct);
  }

  //the display for people who got titles and/or achievements
  let titleHeader = createNode('h2', 'Titles/Achievements gotten', 'title', 'title-header');
  taDiv.appendChild(titleHeader);
  for(let title of response.titlesAndAchievenments) {
    let titleDisplay = createNode('div', null, 'title-display');
    let titleName = createNode('p', title.title, 'title-name');
    //title image
    let titleIcon = createNode('img', null, 'title-icon');
    titleIcon.src = `/resources/images/titles/${title.icon}`;
    titleIcon.style.height = '100px';
    titleIcon.style.width = '100px';
    let earningPlayer = createNode('p', title.recipient, 'title-recipient');
    let description = createNode('p', title.details, 'title-description');
    appendMultiple(titleDisplay, titleIcon, titleName, earningPlayer, description);
    taDiv.appendChild(titleDisplay);
  }

  /*RATINGS DONE ON EACH GAME LOGIC FILE*/

  //now for the end screen
  let endScreen = createNode('h1', 'Thanks for playing!', 'end-header');
  let endLink = createNode('a', 'Back to home', 'end', 'end-link');
  endLink.href = '/';
  endScreen.appendChild(endLink);
  endDiv.appendChild(endScreen);

  //buttons to toggle between the few scenes
  //ranking + titles and achievements -> rating -> end
  let nextButton = createNode('button', 'Next', null, 'next-button');
  nextButton.onclick = () => {
    rankingDiv.style.display = taDiv.style.display = ratingDiv.style.display
      = endDiv.style.display = 'none';
    if(currentScene == 'ranking') {
      prevButton.style.display = 'block'; //show previous button
      document.getElementById('end').style.display = 'block';
      nextButton.style.display = 'none';
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
      nextButton.style.display = 'block'; //show next button
      rankingDiv.style.display = taDiv.style.display = 'block';
      prevButton.style.display = 'none';
      currentScene = 'ranking';
    } else {
      throw new Error('Cannot go back further!');
    }
  }


  //export to excel sheet button
  let excelButton = createNode('button', 'Export to Excel', 'excel-button', 'excel-button');
  excelButton.onclick = () => {
    tablesToExcel(['excel-table'], ['results'], 'exquizit-results.xls', 'Excel');
  };

  //show ranking and titles + achievements first
  currentScene = 'ranking';
  rankingDiv.style.display = taDiv.style.display = 'block';
  appendMultiple(document.body,
    rankingDiv, taDiv, ratingDiv, endDiv, nextButton, prevButton, excelButton);
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
