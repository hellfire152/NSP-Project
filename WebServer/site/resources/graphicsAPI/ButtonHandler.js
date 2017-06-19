/*
  Serves mainly as a container to hold the buttons
  also adds a bunch of convenience functions

  Author: Jin Kuan
*/
const BUTTON_POSITIONS = {
  0:  //top left
  1:  //top right
  2:  //bottom left
  3: //bottom right
}

class ButtonHandler {
  constructor(buttonArr) {
    this._buttons = buttonArr;
    this._container = new PIXI.Sprite('resources/graphics/ui/button-background.png');

    //add all buttons to the container
    for(let button of buttonArr) {
      this._container.addChild(button.sprite);
    }

    //positioning
    let b = this._buttons;
    b[0].x = 5; //yellow -> top left
    b[0].y = 5;
    b[1].x = b[0].width + 10;
    b[1].y = 5;//green -> top right
    b[2].x = 5;//blue -> bottom left
    b[2].y = b[0].height + 5;
    b[3].x = b[0].width + 10;//red -> buttom right
    b[3].y = b[0].height + 5;
  }

  disableAll() {
    for(let button of this._buttons) {
      button.interactive = false;
    }
  }

  enableAll() {
    for(let button of this._buttons) {
      button.interactive = true;
    }
  }

  markChosen() {

  }

  /*
    Expands the correct answer(s), masks the rest in grey and shrinks them
  */
  showSolution(solution) {

  }

  /*
    resets the positioning and the scale of all the buttons
  */
  reset() {
    
  }

  get x() {
    return this._container.x;
  }

  set x(a) {
    this._container.x = a;
  }

  get y() {
    return this._container.y;
  }

  set y(b) {
    this._container.y = b;
  }
}
