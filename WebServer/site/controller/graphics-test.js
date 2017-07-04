'use strict';
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

// const WIDTH = 800;
// const HEIGHT = 600;
// //the main PIXI app
// var app = new PIXI.Application({
//   'width' : WIDTH,
//   'height' : HEIGHT,
//   'antialias' : false
// });
//
// //object to store sprite for easier reference later
// var sprites = {};
//
// var questionDisplay;
//
// app.loader
//   .add('yellow-button', '/resources/graphics/buttons/yellow-button.json')
//   .add('blue-button', '/resources/graphics/buttons/blue-button.json')
//   .add('green-button', '/resources/graphics/buttons/green-button.json')
//   .add('red-button', '/resources/graphics/buttons/red-button.json')
//   .add('car-body', '/resources/graphics/car/base.png')
//   .add('car-driving', '/resources/graphics/car/driving.json')
//   .add('engine-fireup', '/resources/graphics/car/engine/fire.json')
//   .add('engine-firing', '/resources/graphics/car/engine/firing.json')
//   .add('button-background', '/resources/graphics/ui/button-background.png')
//   .add('topbar-background', '/resources/graphics/ui/topbar-background.png')
//   .load((loader, resources) => {
//     let car = new Car(resources, WIDTH / 2);
//     car.y = 100;
//     car.x = (WIDTH - car.width) / 2;
//     let greenButton = new Button(resources['green-button'].textures, ((WIDTH - 100) / 2), () => {
//       console.log("Sdf");
//       car.start();
//     }, null);
//     let redButton = new Button(resources['red-button'].textures, ((WIDTH - 100) / 2), () => {
//       console.log("odsfaodsk")
//       car.stop();
//     }, null);
//
//     greenButton.y = redButton.y = HEIGHT * 2 / 3;
//     greenButton.x = 20 + greenButton.width / 2;
//     redButton.x = 40 + greenButton.width * 3 / 2;
//
//     car.visible = greenButton.visible = redButton.visible = true;
//
//     app.stage.addChild(car.view, greenButton.view, redButton.view);
//   });

//for the stage, renderer and loader.
const WIDTH = 800, HEIGHT = 600;
function send() {}; //To stop errors only (TEST FUNCTION)
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

    let mcqButtonHandler = new McqButtonHandler(resources, WIDTH, 4);
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
      answerResponses.visible = questionDisplay.visible = true;
    p.answering.mcqButtonHandler = mcqButtonHandler;
    p.answering.shortAnswerTextField = shortAnswerTextField;
    p.answering.barGraph = answerResponses;
    p.answering.questionDisplay = questionDisplay;
    p.answering.addChild(
      topBar.view, questionDisplay.view, mcqButtonHandler.view);

    p.getReady.visible = p.answering.visible = p.ranking.visible = false;

    app.stage.addChild(p.getReady, p.answering, p.ranking);
    p.answering.visible = true;
  });

window.onload = () => {
  document.body.appendChild(app.renderer.view);
  app.renderer.render(app.stage);
}
