function setup() {

  //Create the `cat` sprite from the texture
  var img = new PIXI.Sprite(
    PIXI.loader.resources["resources/images/my-desktop.jpg"].texture
  );

  img.on('pointerdown', function(){
    img.visible = ! img.visible;
    renderer.render(stage);
  });
  //Add the cat to the stage
  stage.addChild(img);

  //Render the stage
  renderer.render(stage);
}
var renderer = PIXI.autoDetectRenderer();

//aliases
var loader = PIXI.loader;
loader
  .add("resources/images/my-desktop.jpg")
  .load(setup);
//canvas fills screen
renderer.view.style.position = "absolute";
renderer.view.style.display = "block";
renderer.autoResize = true;
renderer.resize(window.innerWidth, window.innerHeight);

document.getElementById("game").appendChild(renderer.view);

var stage = new PIXI.Container();

stage.addChild(img);
renderer.render(stage);
