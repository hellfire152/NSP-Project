/*
  Class for easily creating buttons for the game

  Author: Jin Kuan
*/
class Button {
  constructor(textures, width, send, answer) {
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
        send({
          'game': C.GAME.SUBMIT_ANSWER,
          'answer' : answer
        });
      }
    })());

    //setting text
    this._text = new PIXI.Text('');
    s.addChild(this._text);

    //positioning by setting both anchors in the middle
    this._text.anchor.x = this._text.anchor.y = 0.5;
    this._sprite.anchor.x = this._sprite.anchor.y = 0.5;
  }
  get sprite() {
    return this._sprite;
  }

  set sprite(sprite) {
    this._sprite = sprite;
  }
  //set onclick of the button
  onClick(fn) {
    this._sprite.on('pointertap', fn);
  }

  get width() {
    return this._sprite.width;
  }

  get height() {
    return this._sprite.height;
  }

  set x(a) {
    this._sprite.x = a;
  }

  set text(t) {
    this._text.text = t;
  }
}
