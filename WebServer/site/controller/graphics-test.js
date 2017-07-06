/*
  This file is for me to test my various graphics classes

  Author: Jin Kuan
*/
'use strict';
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

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
let aprTestData = [
  {
    'name': 'hellfire152',
    'score': 1000,
    'correctAnswers': 3,
    'answerStreak': 2,
    'roundCorrect': true
  },
  {
    'name': 'hellfire152',
    'score': 1000,
    'correctAnswers': 3,
    'answerStreak': 2,
    'roundCorrect': true
  },
  {
    'name': 'hellfire152',
    'score': 1000,
    'correctAnswers': 3,
    'answerStreak': 2,
    'roundCorrect': true
  },
  {
    'name': 'hellfire152',
    'score': 1000,
    'correctAnswers': 3,
    'answerStreak': 2,
    'roundCorrect': true
  }
]
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
  .add('answer-streak-icon', '/resources/images/answer-streak-icon.png')
  .load((loader, resources) => {
    allResources = resources;

    let apr = new AllPlayerRanking(resources, aprTestData, {
      'width' : WIDTH,
      'height' : HEIGHT - 100,
      'paddingX' : 50,
      'paddingY' : 30
    },true);

    app.stage.addChild(apr.view);
  });

window.onload = () => {
  document.body.appendChild(app.renderer.view);
  app.renderer.render(app.stage);
}
