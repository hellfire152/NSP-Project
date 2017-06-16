/*
  Class for easily creating buttons for the game

  Author: Jin Kuan
*/
class Button {
  constructor(textures, width, onClick) {
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
    s.on('pointertap', onClick);
    this.sprite = s;
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

  set x(a) {
    this._sprite.x = a;
  }
}
