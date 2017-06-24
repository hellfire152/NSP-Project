/*
  Class for the loading buttonArr

  Author: Jin Kuan
*/
class LoadingBar extends DisplayElement {
  constructor(max, width) {
    //container to hold all the sprites created
    super();

    //total number of things to load
    this._max = max;
    //number of items completed
    this._progressNo = 0;
    //a percentage
    this._progressPercent = 0;

    //PIXI text for the loading bar
    this._progressText = new PIXI.Text('0/0 ... 0% done!');
    this._container.addChild(this._progressText);

    //TODO::Loading bar sprite

    //storing the original height and width
    this._originalWidth = this._container.width;
    this._originalHeight = this._container.height;

    //set width
    this.scaleToWidth(width);
  }

  update(progress) {
    this._progressPercent = this._progressNo / this._max;
    this.text = `${this._progressNo}/${this._max} ... ${this._progressPercent}% done!`;
  }

  increment() {
    this._progressNo++;
    this.update(this._progressNo);
  }

  scaleToWidth(width) {
    let scaleFactor = width / this._originalWidth;
    this.container.scale.x = scaleFactor;
    this.container.scale.y = scaleFactor;
  }

  set text(t) {
    this._progressText.text = t;
  }

  get text() {
    return this._progressText.text;
  }
}
