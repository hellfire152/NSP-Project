/*
  Class for each bar on the bar graph
  This serves to abstract away the drawing and the animations

  Author: Jin Kuan
*/
class BarGraphBar extends DisplayElement {
  constructor(data) {
    super();
    let {label, value, color, width, maxHeight, maxValue, padding} = data;

    //check if any of the required arguments are undefined
    if(!(!!maxValue && !!color && !!padding && !!label && !!maxHeight && !!width))
      throw new Error("Missing arugments!");

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
    p.bar.width = width;
    p.bar.addChild(bar); //work around to graphics not having the anchor property

    //initializing text
    p.label = new PIXI.Text(label);
    p.value = new PIXI.Text(""+value);

    //positioning
    p.label.anchor.set(0.5, 0.5);
    p.value.anchor.set(0.5, 0.5);
    p.label.y = padding + height;
    p.label.x = width / 2;
    p.value.y = -p.value.height;
    p.value.x = width / 2; //center text on bar

    //adding to container
    //Shift container to accomodate different bar lengths
    this._container.y = - padding - p.bar.height - p.value.height;
    this._container.addChild(p.value, p.bar, p.label);
  }

  /*VARIOUS SETTERS*/
  set label(l) {
    this._pixiELements.label.text = l;
  }

  set value(v) {
    this._value = v;
    this._pixiELements.value.text = v;
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
