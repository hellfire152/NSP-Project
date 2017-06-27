/*
  Class for each bar on the bar graph
  This serves to abstract away the drawing and the animations

  Author: Jin Kuan
*/
class BarGraphBar extends DisplayElement {
  constructor(data) {
    super();
    let {label, value, color, width, maxHeight, topValue, padding} = data;
    this._pixiELements = {};
    this._maxHeight = maxHeight;
    this._topValue = topValue;
    this._value = value;

    let p = this._pixiELements;

    //drawing the bar
    //calculating height
    let height = maxHeight * value / topValue;
    p.bar = new PIXI.Graphics()
      .beginFill(0xFFFFFF)  //white
      .drawRect(0, 0, width, height)
      .endFill();
    p.bar.tint = color //doing it this way in case the color needs to change later

    //initializing text
    p.label = new PIXI.Text(label);

    //positioning
    p.bar.anchor.set(0.5, 1);
    p.label.anchor.set(0.5, 0);
    p.bar.y = -padding;
    p.label.y = padding;

    //adding to container
    this._container.addChild(p.bar, p.label);
  }

  /*VARIOUS SETTERS*/
  set label(l) {
    this._pixiELements.label.text = l;
  }

  set value(v) {
    this._value = v;
    //recalculate height
    this._pixiELements.bar.height = this._maxHeight * v / this._topValue;
  }

  set topValue(v) {
    this._topValue = v;
    //recalculate height
    this._pixiELements.bar.height = this._maxHeight * v / this._topValue;
  }

  set color(c) {
    this._pixiELements.bar.tint = c;
  }

  set maxHeight(h) {
    this._maxHeight = h;
    //recalculate height
    this._pixiELements.bar.height = h * this._value / this._topValue;
  }

  set padding(pd) {
    let this._pixiELements = p;
    //reposition
    p.bar.y = -pd;
    p.label.y = pd;
  }
}
