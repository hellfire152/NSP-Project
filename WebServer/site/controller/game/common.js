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
app.stage = false;

//for easier access to all textures
var pixiElements = {};

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
  pixiElements.ui.visible = true; //show game ui
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
    //initialize and positioning elements
    let buttonContainer = new PIXI.Container();

    //initializing the ui
    let ui = new PIXI.Container();
    ui.visible = false;

    //top bar
    let topBar = new TopBar(WIDTH, 'TEST');
    pixiElements.topBar = topBar;
    //middle
    let middle = new PIXI.Container();
    middle.y = topBar.y;

    //buttons
    let yellowButton = new Button(resources['yellow-button'].textures,
      WIDTH / 2 - 25, send, 8);
    let greenButton = new Button(resources['green-button'].textures,
      WIDTH / 2 - 25, send, 4);
    let blueButton = new Button(resources['blue-button'].textures,
      WIDTH / 2 - 25, send, 2);
    let redButton = new Button(resources['red-button'].textures,
      WIDTH / 2 - 25, send, 1);

    //setting the positioning of buttons
    yellowButton.x = 5; //yellow -> top left
    yellowButton.y = 5;
    greenButton.x = yellowButton.width + 10;
    greenButton.y = y;//green -> top right
    blueButton.x = 5;//blue -> bottom left
    blueButton.y = yellowButton.height + 5;
    redButton.x = yellowButton.width + 10;//red -> buttom right
    redButton.y = yellowButton.height + 5;

    //adding buttons to the container
    //adding background first
    buttonContainer.addChild(new PIXI.Sprite(resources['button-background'].texture));
    buttonContainer.addChild(yellowButton);
    buttonContainer.addChild(greenButton);
    buttonContainer.addChild(blueButton);
    buttonContainer.addChild(redButton);

    //positioning the buttonContainer
    buttonContainer.y = HEIGHT - buttonContainer.height;

    //adding to easy access object
    pixiElements.topBar = topBar;
    pixiElements.middle = middle;
    pixiElements.buttonContainer = buttonContainer;
    pixiElements.ui = ui;

    //adding to the ui
    ui.addChild(topBar.sprite);
    ui.addChild(middle);
    ui.addChild(buttonContainer);

    //add to the stage
    app.stage.addChild(ui);
  });

//hide waiting room and show PIXI game screen
startGame(question) {
  //hideWaitingRoom();
  document.body.appendChild(app.renderer.view);
  nextQuestion(question);
}
