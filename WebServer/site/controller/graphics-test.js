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
    //container to store the buttons
    var buttonContainer = new McqButtonHandler(resources, WIDTH - 10, 4);
    buttonContainer.y = HEIGHT - buttonContainer.height;
    buttonContainer.setText(0, 'abc');

    //testing top bar
    var topBar = new TopBar(resources, WIDTH, 'hellfire152');

    //var questionDisplay = new QuestionDisplay(width);

    app.stage.addChild(buttonContainer.sprite);
    app.stage.addChild(topBar.sprite);
  });

window.onload = () => {
  document.body.appendChild(app.renderer.view);
  app.renderer.render(app.stage);
}
