/*
  Parent class of all the custom display elements in graphicsAPI
  This class creates a container, and has a bunch of convenience functions,
  intended to make other display functions like positioning shorter

  Author: Jin Kuan
*/
class DisplayElement {
  constructor() {
    this._container = new PIXI.Container();
  }

  set x(a) {
    this._container.x = a;
  }

  set y(b) {
    this._container.y = b;
  }

  get view() {
    return this._container;
  }

  get width() {
    return this._container.width;
  }

  set width(w) {
    this._container.width = w;
  }

  get height() {
    return this._container.height;
  }

  set height(h) {
    this._container.height = h;
  }

  set filters(f) {
    this._container.filters = f;
  }

  set visible(v) {
    this._container.visible = v;
  }
}
