/*
  Little button class I created for any button needs.
  Load the textures before using this class!

  The textures for each button is a spritesheet, with two subimages
  'default.png' and 'click.png'

  Author: Jin Kuan
*/
class Button {
  constructor(textures, width, onclick, args) {
    //button setup
    let s = this._sprite;
    this._textures = textures;

    s = new PIXI.Sprite(this._textures["default.png"]);
    s.width = width;
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
    s.addChild(this._text);

    //positioning by setting both anchors in the middle
    this._text.anchor.x = this._text.anchor.y = 0.5;
    this._sprite.anchor.x = this._sprite.anchor.y = 0.5;
  }

  //set onclick of the button
  onClick(fn) {
    this._sprite.on('pointertap', fn);
  }

  get sprite() {
    return this._sprite;
  }

  set sprite(s) {
    this._sprite = s;
  }

  get width() {
    return this._sprite.width;
  }

  get height() {
    return this._sprite.height;
  }

  set text(t) {
    this._text.text = t;
  }

  set position(p) {
    ([this._sprite.x, this._sprite.y] = p);
  }

  set filters(f) {
    this._sprite.filters = f;
  }

  get scale() {
    return this._sprite.scale;
  }
}
