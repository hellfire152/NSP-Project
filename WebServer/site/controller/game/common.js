/*
  This file contains all the common stuff between all gamemodes,
  mostly convenience functions and the PIXI setup.

  Author: Jin Kuan
*/
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
  .add('car-body', '/resources/graphics/car/base.png')
  .add('car-driving', '/resources/graphics/car/driving.json')
  .add('engine-fireup', '/resources/graphics/car/engine/fire.json')
  .add('engine-firing', '/resources/graphics/car/engine/firing.json')
  .add('button-background', '/resources/graphics/ui/button-background.png')
  .add('topbar-background', '/resources/graphics/ui/topbar-background.png')
  .load((loader, resources) => {
    allResources = resources;
    //initialize all the various scenes
    let p = pixiScenes;
    p.answering = new PIXI.Container();
    p.getReady = new PIXI.Container();
    p.ranking = new PIXI.Container();

    //setting up the various scenes...
    p.getReady.addChild(new PIXI.Text('Get Ready!'));

    let mcqButtonHandler = new McqButtonHandler(resources, WIDTH / 3, 4);
    let shortAnswerTextField = new ShortAnswerTextField(WIDTH / 2, 100);
    let topBar = new TopBar(resources, WIDTH, 50, name); //name initialized by socket.io
    let questionDisplay = new QuestionDisplay(WIDTH, 20, 20,
      HEIGHT - mcqButtonHandler.height - topBar.height);
    let answerResponses = new BarGraph(resources, null, {
      'width' : WIDTH,
      'height' : HEIGHT - topBar.height - mcqButtonHandler.height,
      'paddingX' : 20,
      'paddingY' : 20
    });
    //set all not visible
    mcqButtonHandler.visible = shortAnswerTextField.visible =
      answerResponses.visible = questionDisplay.visible = false;
    p.answering.mcqButtonHandler = mcqButtonHandler;
    p.answering.shortAnswerTextField = shortAnswerTextField;
    p.answering.barGraph = answerResponses;
    p.answering.questionDisplay = questionDisplay;
    p.answering.addChild(
      topBar.view, questionDisplay.view, mcqButtonHandler.view);

    p.getReady.visible = p.answering.visible = p.ranking.visible = false;

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
  } else {
    throw new Error(`Scene ${scene} does not exist!`);
  }
}

function showTitlesAndAchievements(titlesAndAchievenments) {
  let p = pixiScenes;
  p.titlesAndAchievenments = new PIXI.Container();
  p.titlesAndAchievenments.addChild(new SpecialShowcase(titlesAndAchievenments, {
    'width' : WIDTH,
    'height' : HEIGHT,
    'paddingX' : 5,
    'paddingY' : 5
  }));
}

function initEndScene() {
  let p = pixiScenes;
  p.end = new PIXI.Container();
  //shows one text with 'end' only
  let endText = new PIXI.Text('End');
  //positioning
  endText.anchor.set(0.5,0.5);
  endText.x = WIDTH / 2;
  endText.y = HEIGHT / 2;
  p.end.addChild(endText);
}

function initRatingScene() {
  let p = pixiScenes;
  p.rating = new PIXI.Container();
  let like = new PIXI.Sprite(allResources['like'].texture);
  let dislike = new PIXI.Sprite(allResources['dislike'].texture);
  like.interactive = dislike.interactive = true;
  like.on('pointertap', () => {
    send({
      'game' : C.GAME.RATING,
      'rating' : 0
    });
  });
  dislike.on('pointertap', () => {
    send({
      'game' : C.GAME.RATING,
      'rating' : 1
    });
  });
  //positioning
  like.anchor.set(0.5,0.5);
  dislike.anchor.set(0.5,0.5);
  like.x = WIDTH / 2 - 100;
  dislike.x = WIDTH / 2 - 100;
  like.y = dislike.y = HEIGHT / 2;

  //add to Container
  p.rating.addChild(like, dislike);
}

function displayResults(roundEndResults) {
  p.ranking.data = roundEndResults;
  swapScene('ranking');
}
