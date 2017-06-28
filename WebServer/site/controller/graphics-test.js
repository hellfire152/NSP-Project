PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

const WIDTH = 800;
const HEIGHT = 600;
//the main PIXI app
var app = new PIXI.Application({
  'width' : WIDTH,
  'height' : HEIGHT,
  'antialias' : false
});

//object to store sprite for easier reference later
var sprites = {};

var questionDisplay;

app.loader
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
    var playerRanking = new PlayerRanking(resources, {
      'name' : 'hellfire152',
      'score': 123,
      'rank' : 1,
      'correctAnswers' : 1,
      'answerStreak' : 12,
      'profilePic' : null
    }, {
      'paddingX' : 3,
      'paddingY' : 3,
    }, true);

    var barGraph = new BarGraph(resources, {
      'labels' : ['a', 'b', 'c'],
      'values' : [1, 2, 3]
    }, {
      'paddingX' : 3,
      'paddingY' : 3,
      'width' : WIDTH - 100,
      'height' : 400
    });
    barGraph.y = playerRanking.height + 100;
    app.stage.addChild(playerRanking.sprite, barGraph.sprite);
  });

window.onload = () => {
  document.body.appendChild(app.renderer.view);
  app.renderer.render(app.stage);
}
