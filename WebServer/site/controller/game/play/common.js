/*
  This file contains all the common stuff between all gamemodes,
  mostly convenience functions and the PIXI setup.

  Author: Jin Kuan
*/
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
//game area dimensions
const WIDTH   = 800,
      HEIGHT  = 600;

//for the stage, renderer and loader.
var app = new PIXI.Application({
  'width': WIDTH,
  'height': HEIGHT
});
//for swapping between scenes
var pixiScenes = {};
var allResources;
app.loader  //load all
  .add('yellow-button', '/resources/graphics/buttons/yellow-button.json')
  .add('blue-button', '/resources/graphics/buttons/blue-button.json')
  .add('green-button', '/resources/graphics/buttons/green-button.json')
  .add('red-button', '/resources/graphics/buttons/red-button.json')
  .add('button-background', '/resources/graphics/ui/button-background.png')
  .add('topbar-background', '/resources/graphics/ui/topbar-background.png')
  .add('answer-streak-icon', '/resources/images/game/answer-streak-icon.png')
  .load((loader, resources) => {
    allResources = resources;
    //initialize all the various scenes
    let p = pixiScenes;
    p.answering = new PIXI.Container();
    p.getReady = new PIXI.Container();
    p.ranking = new PIXI.Container();
    let topBar = new TopBar(resources, WIDTH, 50, name); //name initialized by res.render

    //setting up the various scenes...
    //getReady scene
    let getReadyBackground = new PIXI.Graphics()
      .beginFill(0xFFFFFF)
      .drawRect(0, 0, 300, 200)
      .endFill();
    getReadyBackground.x = (WIDTH - getReadyBackground.width) / 2;
    getReadyBackground.y = (HEIGHT - getReadyBackground.height) / 2;
    let getReadyText = new PIXI.Text('Get Ready!');
    getReadyText.anchor.set(0.5, 0.5);
    ([getReadyText.x, getReadyText.y] = [WIDTH / 2, HEIGHT / 2]);
    p.getReady.addChild(getReadyBackground, getReadyText);

    p.ranking.allPlayerRanking = new AllPlayerRanking(resources, null, {
      'width' : WIDTH,
      'height' : HEIGHT - 100 - topBar.height,
      'paddingX' : 40,
      'paddingY' : 20,
      'minHeight' : 50,
      'maxHeight' : 100
    }, false);
    //positioning
    p.ranking.allPlayerRanking.y = topBar.height;
    //adding to scene
    p.ranking.addChild(topBar.view, p.ranking.allPlayerRanking.view);

    //answering scene
    let mcqButtonHandler = new McqButtonHandler(resources, WIDTH, 4);
    let shortAnswerTextField = new ShortAnswerTextField(WIDTH, 100);
    let questionDisplay = new QuestionDisplay(WIDTH, 20, 20,
      HEIGHT - mcqButtonHandler.height - topBar.height);
    let answerResponses = new BarGraph(resources, null, {
      'width' : WIDTH,
      'height' : HEIGHT - topBar.height - mcqButtonHandler.height,
      'paddingX' : 20,
      'paddingY' : 20
    });
    //positioning and sizing
    mcqButtonHandler.y = shortAnswerTextField.y
      = HEIGHT - mcqButtonHandler.height;
    shortAnswerTextField.height = mcqButtonHandler.height;
    questionDisplay.y = answerResponses.y = answerResponses.y = topBar.height;
    //set all not visible
    mcqButtonHandler.visible = shortAnswerTextField.visible =
      answerResponses.visible = questionDisplay.visible = false;
    //so that the elements are accessible to other functions
    p.topBar = topBar;
    p.answering.mcqButtonHandler = mcqButtonHandler;
    p.answering.shortAnswerTextField = shortAnswerTextField;
    p.answering.answerResponses = answerResponses;
    p.answering.questionDisplay = questionDisplay;
    p.answering.addChild(
      questionDisplay.view, answerResponses.view,
      mcqButtonHandler.view, shortAnswerTextField.view);
    p.answering.addChild(topBar.view);

    //set all scenes not visible
    p.getReady.visible = p.answering.visible = p.ranking.visible = false;
    //add scenes to stage
    app.stage.addChild(p.getReady, p.answering, p.ranking);
  });
//Helper functions
function swapScene(scene) {
  if(pixiScenes[scene]) { //scene exists
    pixiScenes.currentScene = scene; //update flag
    for(let s in pixiScenes) {  //set all scenes not visible
      if(pixiScenes.hasOwnProperty(s)) {
        pixiScenes[s].visible = false;
      }
    }
    pixiScenes[scene].visible = true; //set the specified one to be visible
    pixiScenes.topBar.visible = true; //topBar visible
  } else {
    throw new Error(`Scene ${scene} does not exist!`);
  }
}

/*
  Displays the results for round end using the ranking Class
*/
function displayResults(roundEndResults) {
  pixiScenes.ranking.data = roundEndResults;
  swapScene('ranking');
}

/*
  Displays the question that was sent to the client
*/
var timeOver;
function loadQuestion(question) {
  clearTimeout(timeOver);

  let p = pixiScenes.answering;

  //display the prompt
  p.questionDisplay.setPrompt(question.prompt, question.time);
  p.questionDisplay.visible = true;

  let timerEnd; //callback for when timer ends
  //set both not visible (just in case)
  p.mcqButtonHandler.visible = p.shortAnswerTextField.visible = false;
  if(question.type == 0) { //mcq question
    p.mcqButtonHandler.reset();
    p.mcqButtonHandler.visible = true;
    p.mcqButtonHandler.setNoOfChoices(question.choices.length);
    p.mcqButtonHandler.choices = question.choices;
    p.mcqButtonHandler.enableAll();
    timerEnd = () => {p.mcqButtonHandler.disableAll()};
  } else {  //short answer
    p.shortAnswerTextField.reset();
    p.shortAnswerTextField.enable();
    p.shortAnswerTextField.visible = true;
    timerEnd = () => {p.shortAnswerTextField.disable()};
  }
  p.questionDisplay.text = question.prompt;
  timeOver = setTimeout(timerEnd, question.time * 1000);
}

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
  let rankingHeader = createNode('h1', 'Final rankings:', 'ranking-header');
  rankingDiv.appendChild(rankingHeader);
  //generating a display for each player
  for(let i = 0, player = response.roundEndResults[i];
      i < response.roundEndResults.length;
      i++, player = response.roundEndResults[i]) {
    //generate new ranking display
    let playerRankingDiv = createNode('div', null, 'player-ranking');

    let rank = createNode('h2', `#${i + 1}`, 'player-rank', `rank-${i + 1}`);

    //append the various data of the player
    for(let playerAttr in player) {
      if(player.hasOwnProperty(playerAttr)) {
        let attr = createNode('p',`${playerAttr}:\t${player[playerAttr]}`, `player-name`);
        playerRankingDiv.appendChild(attr);
      }
    }

    appendMultiple(rankingDiv, rank, playerRankingDiv);
  }

  //the display for people who got titles and/or achievements
  let titleHeader = createNode('h2', 'Titles/Achievements gotten', 'title', 'title-header');
  taDiv.appendChild(titleHeader);
  for(let title of response.titlesAndAchievenments) {
    let titleDisplay = createNode('div', null, 'title-display');
    let titleName = createNode('p', title.name, 'title-name');
    let titleIcon = createNode('img', null, 'title-icon');
    titleIcon.src = `/resources/images/titles/${title.icon}`;
    titleIcon.style.height = '100px';
    titleIcon.style.width = '100px';
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
