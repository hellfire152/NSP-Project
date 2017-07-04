/*
  Serves as a factory and a container to hold the MCQ buttons
  also adds a bunch of convenience functions

  NOTE::BEFORE YOU USE THIS class
  Load 'yellow-button', 'red-button', 'green-button', 'blue-button', 'button-background'
  into the pixi loader's resources beforehand, and pass them into the constructor

  Author: Jin Kuan
*/
class McqButtonHandler extends DisplayElement {
  constructor(resources, width, noOfChoices) {
    super();
    let buttonWidth = width / 2 - 15;

    //ticker for animations
    this._ticker = new PIXI.ticker.Ticker();
    this._ticker.stop();
    this._ticker.autoStart = false;

    //use textures to create buttons
    this._buttons = [];
    //buttons
    this._buttons.push(new Button(resources['yellow-button'].textures,
      buttonWidth, send, {
        'game': C.GAME.SUBMIT_ANSWER,
        'answer' : 8
      }));
    this._buttons.push(new Button(resources['green-button'].textures,
      buttonWidth, send, {
        'game': C.GAME.SUBMIT_ANSWER,
        'answer' : 4
      }));
    this._buttons.push(new Button(resources['blue-button'].textures,
      buttonWidth, send, {
        'game': C.GAME.SUBMIT_ANSWER,
        'answer' : 2
      }));
    this._buttons.push(new Button(resources['red-button'].textures,
      buttonWidth, send, {
        'game': C.GAME.SUBMIT_ANSWER,
        'answer' : 1
      }));

    //create a container to hold the buttons
    this._background = new PIXI.Sprite(resources['button-background'].texture);
    this._background.width = width;
    this._container.addChild(this._background);

    //add all buttons to the container
    for(let button of this._buttons) {
      this._background.addChild(button.view);
    }
    //saving the original scale for later animation resets
    this._originalScale = [this._buttons[0].scale.x, this._buttons[0].scale.y];

    //positioning
    //calculating positions
    let b = this._buttons,
      bWidth = b[0].width,
      bHeight = b[0].height,
      paddingX = 10,
      paddingY = 15;
    const LEFT = bWidth / 2 + paddingX,
      RIGHT = bWidth * 1.5 + paddingX * 2,
      MIDDLE_X = paddingX * 1.5 + bWidth,
      TOP = bHeight / 2 + paddingY,
      BOTTOM = bHeight * 1.5 + paddingY * 2,
      MIDDLE_Y = paddingY * 1.5 + bHeight;

    this.POSITIONS = {
      'TOP_LEFT': [LEFT, TOP],
      'TOP_RIGHT': [RIGHT, TOP],
      'BOTTOM_LEFT': [LEFT, BOTTOM],
      'BOTTOM_RIGHT': [RIGHT, BOTTOM],
      'BOTTOM_MIDDLE': [MIDDLE_X, BOTTOM],
      'MIDDLE_LEFT': [LEFT, MIDDLE_Y],
      'MIDDLE_RIGHT': [RIGHT, MIDDLE_Y]
    }
    this.setNoOfChoices(noOfChoices);
  }

  //handles scaling of the container

  /*changes the number of buttons displayed
    the number of buttons of displayed affect the positioning of the buttons
  */
  setNoOfChoices(noOfChoices) {
    this._noOfChoices = noOfChoices;
    let b = this._buttons;
    let P = this.POSITIONS;
    switch(noOfChoices) {
      case 4: {
        //set all visible first
        for(let button of b)
          button.visible = true;

        b[0].position = P.TOP_LEFT;
        b[1].position = P.TOP_RIGHT;
        b[2].position = P.BOTTOM_LEFT;
        b[3].position = P.BOTTOM_RIGHT;
        break;
      }
      case 3: {
        //set first 3 visible
        for(let i = 0; i < b.length; i++)
          if(i < 3)
            b[i].visible = true;
          else
            b[i].visible = false;

        b[0].position = P.TOP_LEFT;
        b[1].position = P.TOP_RIGHT;
        b[2].position = P.BOTTOM_MIDDLE;
        break;
      }
      case 2: {
        for(let i = 0; i < b.length; i++) {
          if(i < 2) {
            b[i].visible = true;
          } else {
            b[i].visible = false;
          }
        }

        b[0].position = P.MIDDLE_LEFT;
        b[1].position = P.MIDDLE_RIGHT;
        break;
      }
      case 1: {
        break;
      }
    }
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

  //darken all excerpt the chosen one
  darkenAllExcept(index) {
    this.disableAll();

    //filter to darken
    let darkenFilter = new PIXI.filters.ColorMatrixFilter();
    darkenFilter.brightness = 0.3;

    //assigning the filter
    for(let i = 0; i < this._buttons.length; i++) {
      if(i != index) {
        this._buttons[i].filters = [darkenFilter];
      }
    }
  }

  /*
    Outlines the correct answers in green, the wrong answers are darkened and
    outlined in red
  */
  showSolution(solution) {
    this.disableAll();

    //initializing filters
    let darkenFilter = new PIXI.filters.ColorMatrixFilter();
    darkenFilter.brightness = 0.6;
    let outlineGreenFilter = new PIXI.filters.OutlineFilter(3, 0x00ff04);
    let outlineRedFilter = new PIXI.filters.OutlineFilter(3, 0xff0000);

    //applying filters
    for(let i = 0, solutionCheck = 8; i < this._buttons.length; i++, solutionCheck / 2) {
      if(solution & solutionCheck) {  //correct
        this._buttons[i].filters = [outlineGreenFilter];
      } else {  //wrong
        this._buttons[i].filters = [darkenFilter, outlineRedFilter];
      }
    }
  }

  /*
    resets the positioning and the scale of all the buttons
  */
  reset() {
    //scale and filter
    for(let button of this._buttons) {
      ([button.view.scale.x, button.view.scale.y] = this._originalScale);
      button.filters = null;
    }
    //positioning
    this.setNoOfChoices(this._noOfChoices);
  }

  setText(buttonIndex, text) {
    this._buttons[buttonIndex].text = text;
  }

  set choices(choicesArr) {
    for(let i = 0; i < choicesArr.length; i++) {
      this._buttons[i].text = choicesArr[i];
    }
  }
}
