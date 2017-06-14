//allows me to create sprites easier
var u = new SpriteUtilities(PIXI);

//the main PIXI app
var app = new PIXI.Application({
  'width': window.innerWidth,
  'height': window.innerHeight
});

//sprites object to store everything
var sprites = {};
//container to store the buttons
var buttonContainer = new PIXI.Container();
buttonContainer.width = app.renderer.width;
buttonContainer.height = app.renderer.height / 2;

//container showing the car
var carContainer = new PIXI.Container();
carContainer.width = app.renderer.width;
carContainer.height = app.renderer.height / 2;

//positioning button container at the buttom half
buttonContainer.y = buttonContainer.parent.height / 2;

//alias for the loader's resources
var resources = app.loader.resources;

app.loader.onComplete.add(loadComplete);

//adding buttons to the load list
let buttonColours = ["red", "yellow", "blue", "green"];
for(let colour of buttonColours) {
  app.loader.add(colour + '-button', '../resources/graphics/buttons/' + colour + '-button.json');
}

app.loader
  .add('car-base', '../resources/graphics/car/base.png')
  .add('car-driving', '../resources/graphics/car/driving.json')
  .add('engine-fireup', '../resources/grpahics/car/engine/fire.json')
  .add('engine-firing', '../resources/graphics/car/engine/firing.json')
  .load(resources => {
    //create and add sprites to the sprites object
    //loading two buttons
     //first button


    id = resources['red-button']; //second button
    let redButton = t.button([
      id["default.png"],
      id["default.png"],
      id["click.png"],
    ], 10, buttonContainer.height / 2);
    redButton.width = redContainer.width / 2 - 15;
    redButton.anchor.set(0.5, 0.5);
    redButton.tap = stopEngine;
    sprites['red-button'] = redButton;

    //car textures
    //static sprite for the car
    sprites['car'] = new PIXI.Sprite(resources['car-base'].texture);
    sprites['car'].running = false;

    //adding stuff into the containers
    buttonContainer.addChild(yellowButton);
    buttonContainer.addChild(redButton);

    carContainer.addChild(sprites['car']);
  });


function loadComplete() {
  //append the PIXI canvas to the window
  document.body.appendChild(app.renderer.view);


}

function startEngine() {
  let car = sprites['car'];
  if (!sprites['car'].running) {
    let fireup = resources['engine-fireup']
    car.texture = fireup;
    fireup.play();
  }
}

function stopEngine() {
  let car = sprites['car'];
  if (sprites['car'].running) {

  }
}
