var buttonTextures = {};
let buttonColours = ['yellow', 'green', 'red', 'blue'];
for(let colour of buttonColours) {
    PIXI.loader.add(colour + '-button', 'client/resources/graphics/buttons/' + colour + '-button.json')
}
PIXI.loader.load((loader, resources) => {
  buttonTextures['yellow-button'] = resources['yellow-button'].textures;
  buttonTextures['red-button'] = resources['red-button'].textures;
  buttonTextures['green-button'] = resources['green-button'].textures;
  buttonTextures['blue-button'] = resources['blue-button'].textures;
});


class Button {
  this.__textures = null;
  this.sprite = null;
  constructor(width, height, buttonColour) {
    this.__textures = buttonTextures[buttonColour + '-button'];
    this.sprite = new PIXI.Sprite(this.__textures['default.png']);

    //mirror sprite because I drew it the wrong way
    this.sprite.scale.x = -1

    //change texture on pointer down/up
    this.sprite.on('pointerdown', () => {
      this.sprite.texture = __textures["click.png"];
    });
    this.sprite.on('pointerup', () => {
      this.sprite.texture = __textures["default.png"];
    });
  }

  onClick(fn) {
    this.sprite.on('pointerdown', fn);
  }

  get sprite() {
    return this.sprite;
  }
}

class Car {
  
}
