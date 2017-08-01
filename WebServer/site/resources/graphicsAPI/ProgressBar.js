/*
  The progress bar used in race mode.

  Author: Jin Kuan
*/
class ProgressBar extends DisplayElement {
  constructor(data) {
    super();
    //extract data
    let {width, height, maxNo, startNo, color} = data;

    //draw background
    this._background = new PIXI.Graphics()
      .beginFill(0xFFFFFF)
      .drawRect(0, 0, width, height)
      .endFill();

    //red progress bar
    this._progressBar = new PIXI.Graphics()
      .beginFill(color)
      .drawRect(0, 0, width, height)
      .endFill();

    //mask for the progress background
    this._progressMask = new PIXI.Graphics()
      .beginFill(0xFFFFFF)
      .drawRect(0, 0, 1, height)
      .endFill();

    this._progressBar.mask = this._progressMask;

    //calculating the increase in length every increment
    this._incrementLength = width / maxNo;

    if(startNo)
      this._progressMask.width = startNo * width / maxNo;

    //add to parent Container
    this._container.addChild(this._background, this._progressBar);
  }

  increment() {
    this._progressMask.width += this._incrementLength;
  }

  set y(a) {
    super.y = a;
    this._progressMask.y = a;
  }
}
