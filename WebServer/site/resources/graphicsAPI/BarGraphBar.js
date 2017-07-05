/*
  Class for each bar on the bar graph
  This serves to abstract away the drawing and the animations

  Author: Jin Kuan
*/
class BarGraphBar extends DisplayElement {
  constructor(data) {
    super();
    let {label, value, color, width, maxHeight, maxValue, padding} = data;
    this._pixiELements = {};
    this._maxHeight = maxHeight;
    this._maxValue = maxValue;
    this._value = value;

    let p = this._pixiELements;

    //drawing the bar
    //calculating height
    let height = maxHeight * value / maxValue;

    let bar = new PIXI.Graphics()
      .beginFill(0xFFFFFF)  //white
      .drawRect(0, 0, width, height)
      .endFill();
    bar.tint = color //doing it this way in case the color needs to change later
    p.bar = new PIXI.Container();
    p.bar.addChild(bar); //work around to graphics not having the anchor property

    //initializing text
    p.label = new PIXI.Text(label);
    p.value = new PIXI.Text(value);

    //positioning
    p.label.anchor.set(0.5, 0);
    p.value.anchor.set(0.5, 1);
    p.label.y = padding + bar.height;
    p.value.y = -p.bar.height - padding;
    p.value.x = bar.width / 2; //center text on bar

    //adding to container
    this._container.addChild(p.value, p.bar, p.label);
  }

  /*VARIOUS SETTERS*/
  set label(l) {
    this._pixiELements.label.text = l;
  }

  set value(v) {
    this._value = v;
    //recalculate height
    this._pixiELements.bar.height = this._maxHeight * v / this._maxValue;
  }

  set maxValue(v) {
    this._maxValue = v;
    //recalculate height
    this._pixiELements.bar.height = this._maxHeight * v / this._maxValue;
  }

  set color(c) {
    this._pixiELements.bar.tint = c;
  }

  set maxHeight(h) {
    this._maxHeight = h;
    //recalculate height
    this._pixiELements.bar.height = h * this._value / this._maxValue;
  }

  set padding(pd) {
    let p = this._pixiELements;
    //reposition
    p.bar.y = -pd;
    p.label.y = pd;
  }
}
