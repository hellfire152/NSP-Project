/*
  Serves as a factory and a container to hold the MCQ buttons
  also adds a bunch of convenience functions

  Author: Jin Kuan
*/
class McqButtonHandler {
  constructor(resources, buttonWidth, noOfChoices) {
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
    //saving the original scale for later animation resets
    this._originalScale = [this._buttons[0].scale.x, this._buttons[0].scale.y];

    //create a container to hold the buttons
    this._container = new PIXI.Sprite('resources/graphics/ui/button-background.png');

    //add all buttons to the container
    for(let button of buttonArr) {
      this._container.addChild(button.sprite);
    }

    //positioning
    //calculating positions
    let xOffset = b[0].width / 2,
      yOffset = b[0].height / 2,
      bWidth = b[0].width,
      bHeight = b[0].height;

    this.POSITIONS = {
      'TOP_LEFT': [xOffset + padding, yOffset + padding],
      'TOP_RIGHT': [xOffset + bWidth + padding * 2, yOffset + padding],
      'BOTTOM_LEFT': [xOffset + padding, yOffset + bHeight + padding],
      'BOTTOM_RIGHT': [xOffset + bWidth + padding * 2, yOffset + bHeight + padding],
      'BOTTOM_MIDDLE': [bWidth + padding, yOffset + bHeight + padding],
      'MIDDLE_LEFT': [xOffset + padding, bHeight + padding],
      'MIDDLE_RIGHT': [xOffset + bWidth + padding, bHeight + padding]
    }
    this.setNoOfChoices(noOfChoices);
  }

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
    for(let button in this._buttons) {
      ([button.scale.x, button.scale.y] = this._originalScale);
      button.filters = null;
    }
    //positioning
    this.setNoOfChoices(this._noOfChoices);
  }

  get sprite() {
    return this._container;
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
