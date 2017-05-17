var renderer = PIXI.autoDetectRenderer();

//aliases
var loader = PIXI.loader;

//canvas fills screen
renderer.view.style.position = "absolute";
renderer.view.style.display = "block";
renderer.autoResize = true;
renderer.resize(window.innerWidth, window.innerHeight);

document.getElementById("game").appendChild(renderer.view);

var stage = new PIXI.Container();

renderer.render(stage);
