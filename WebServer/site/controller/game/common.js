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
  'width': width,
  'height': height
});
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
  .add('topbar-background', '/resources/graphics/ui/topbar-background.png'))
  .load(loader, resources) {

  }

//for swapping between scenes
var pixiScenes = {};

//loading screen, just text at the moment
var loading = new LoadingBar(9, WIDTH - 100);

//adding the loading bar to the stage
app.stage.addChild(loading.sprite);
app.loader.onLoad.add(() => {
  loading.increment();
});
//on load completion
app.loader.onComplete.add(() => {
  loading.sprite.visible = false; //hide loading screen
  loading = null; //leaving it to the garbage collector to deal with
  app.stage.addChild(new PIXI.Text('Get Ready!')); //show getReady screen, prepare for start signal...
});

//loading the stuff
app.loader
  .add('button-background', 'resources/graphics/ui/button-background.png')
  .add('yellow-button', 'resources/graphics/buttons/yellow-button.json')
  .add('blue-button', 'resources/graphics/buttons/blue-button.json')
  .add('green-button', 'resources/graphics/buttons/green-button.json')
  .add('red-button', 'resources/graphics/buttons/red-button.json')
  .add('car-body', 'resources/graphics/car/base.png')
  .add('car-driving', 'resources/graphics/car/driving.json')
  .add('engine-fireup', 'resources/graphics/car/engine/fire.json')
  .add('engine-firing', 'resources/graphics/car/engine/firing.json')
  .load((loader, resources) => {
    //initialize all the various scenes
    let p = pixiScenes;
    p.answering = new PIXI.Container();
    p.getReady = new PIXI.Container();
    p.ranking = new PIXI.Container();

    //setting up the various scenes...
    //getReady scene
    p.getReady.addChild(new PIXI.Text('Get Ready!'));

    //answering scene
    let mcqButtonHandler = new McqButtonHandler(resources, WIDTH, 4);
    let shortAnswerTextField = new shortAnswerTextField(WIDTH, HEIGHT);
    let topBar = new TopBar(resources, WIDTH, 50, name); //name initialized by socket.io
    let questionDisplay = new QuestionDisplay(WIDTH, 20, 20,
      HEIGHT - mcqButtonHandler.height - topBar.height);
    let responseData = new BarGraph(resources, null, {
      'width' : WIDTH,
      'height' : HEIGHT - topBar.height - mcqButtonHandler.height,
      'paddingX' : 20,
      'paddingY' : 20
    });
    //positioning
    questionDisplay.y = topBar.height;
    mcqButtonHandler.anchor.set(0, 1);
    shortAnswerTextField.anchor.set(0, 1);
    mcqButtonHandler.y = shortAnswerTextField.y = HEIGHT;
    mcqButtonHandler.visible = shortAnswerTextField.visible = false; //do not show yet
    //adding to scene
    p.answering.mcqButtonHandler = mcqButtonHandler;
    p.answering.topBar = topBar;
    p.answering.responseData = responseData;
    p.answering.addChild(topBar, questionDisplay, mcqButtonHandler);
  });

function displayResults(roundEndResults) {
  
}
