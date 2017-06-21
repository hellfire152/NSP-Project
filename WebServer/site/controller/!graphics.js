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
  .load((loader, resources) => {
    //container to store the buttons
    var buttonContainer = new PIXI.Container();

    //adding two buttons
    let greenButton = new Button(resources['green-button'].textures,
      WIDTH / 2 - 15, () => {
        console.log("GREEN BUTTON CLICKED");
      sprites.car.start();
    });
    sprites.greenButton = greenButton;
    buttonContainer.addChild(greenButton.sprite);

    let redButton = new Button(resources['red-button'].textures,
      WIDTH / 2 - 15, () => {
      console.log("RED BUTTON CLICKED");
      sprites.car.stop();
    });
    redButton.x = greenButton.width;
    sprites.redButton = redButton;
    buttonContainer.addChild(redButton.sprite);

    buttonContainer.height = HEIGHT / 2;
    //container showing the car
    var carContainer = new PIXI.Container();
    var car = new Car({
      'car-body' : resources['car-body'].texture,
      'car-driving' : resources['car-driving'].textures,
      'engine-fireup' : resources['engine-fireup'].textures,
      'engine-firing' : resources['engine-firing'].textures
    }, WIDTH - 300);
    sprites.car = car;
    carContainer.addChild(car.sprite);
    carContainer.x = (WIDTH - carContainer.width) / 2;
    carContainer.y = ((HEIGHT / 2) - carContainer.height) / 2;

    //positioning button container at the buttom half
    buttonContainer.y = app.renderer.height / 2;

    //test spriting
    app.stage.addChild(buttonContainer);
    app.stage.addChild(carContainer);
    app.renderer.render(app.stage);
  });

window.onload = () => {
  document.body.appendChild(app.renderer.view);
  app.renderer.render(app.stage);
}
