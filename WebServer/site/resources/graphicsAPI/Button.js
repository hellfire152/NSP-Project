/*
  Little button class I created for any button needs.
  Load the textures before using this class!

  The textures for each button is a spritesheet, with two subimages
  'default.png' and 'click.png'

  Author: Jin Kuan
*/
class Button extends DisplayElement {
  constructor(textures, width, onclick, args) {
    super();

    //button setup
    this._textures = textures;

    //initializing the sprite
    let s = new PIXI.Sprite(this._textures["default.png"]);
    s.interactive = true;

    //setting on pointer down and up
    s.on('pointerdown', () => {
      s.texture = this._textures["click.png"];
    });
    s.on('pointerup', () => {
      s.texture = this._textures["default.png"];
    });
    s.on('pointerupoutside', () => {
      s.texture = this._textures["default.png"];
    });
    //setting onClick
    s.on('pointertap', (() => {
      return function() {
        onclick(args);
      }
    })());

    //setting text
    this._text = new PIXI.Text('');

    //positioning by setting both anchors in the middle
    this._text.anchor.x = this._text.anchor.y = 0.5;
    s.anchor.x = s.anchor.y = 0.5;

    this._sprite = s;

    //expose contianer
    this._container.addChild(s);
    this._container.addChild(this._text);

    //set width
    this.scaleToWidth(width);
  }

  //scales the button's size, stops at a set width
  scaleToWidth(width) {
    let scaleFactor = width / this.sprite.width;
    this.scale.x = scaleFactor;
    this.scale.y = scaleFactor;
  }

  //set onclick of the button
  onClick(fn) {
    this._sprite.on('pointertap', fn);
  }

  set text(t) {
    this._text.text = t;
  }

  set position(p) {
    ([this._container.x, this._container.y] = p);
  }

  get scale() {
    return this._sprite.scale;
  }

  disable() {
    this._sprite.interactive = false;
  }

  enable() {
    this._sprite.interactive = true;
  }
}
