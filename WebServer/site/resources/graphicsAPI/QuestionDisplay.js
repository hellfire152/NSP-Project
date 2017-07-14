/*
  Class for the part of the ui that's handling the showing of the question prompt.

  Author: Jin KuN
*/
class QuestionDisplay extends DisplayElement {
  constructor(width, paddingX, paddingY, maxHeight) {
    super();
    this._paddingX = paddingX;
    this._paddingY = paddingY;
    this._maxHeight = maxHeight;
    this._fontStyle = {
      'align' : 'center',
      'fontSize' : 26,
      'wordWrap' : true,
      'wordWrapWidth' : width - paddingX * 2
    };

    //initializing the PIXI text object
    this._text = new PIXI.Text('', this._fontStyle);
    this._text.anchor.set(0.5, 0.5);
    //initializing timer text element
    this._timer = new PIXI.Text('', this._fontStyle);
    this._timer.anchor.set(1, 0.5);
    this._timer.x = width - paddingX;  //last element from the right
  
    this._background = new PIXI.Graphics();
    this._background  //draw a white square for a background
      .beginFill(0xffffff)
      .drawRect(0, 0, 300, 300)
      .endFill();

    this._background.width = width;
    this._container.addChild(this._background);
    this._container.addChild(this._text);
    this._container.addChild(this._timer);
    this.resize();
  }

  minimize() {
    this._fontStyle.fontSize = 16; //reduce size by half
    this.resize();
  }

  maximize(height) {
    this._fontStyle.fontSize = 26; //reset font size
    this._background.height = height;
    //expand to the limit
    (async function(questionDisplay) {
      for(;questionDisplay._text.height < height - questionDisplay._paddingY * 2;
         questionDisplay._fontStyle.fontSize++) {
        questionDisplay._text.style = questionDisplay._fontStyle;
      }
    })(this);
    //reposition
    this._text.x = this._background.width / 2;
    this._text.y = this._background.height / 2;
  }

  resize() {
    //making sure the text fits, reduce font size if needed
    for(let first = true; first || this._background.height > this._maxHeight; this._fontStyle.fontSize--) {
      if(first) first = false;
      this._text.style = this._fontStyle;

      let height = this._text.height;
      this._background.height = height + this._paddingY * 2;
    }
    //reposition
    this._text.x = this._background.width / 2;
    this._text.y = this._timer.y = this._background.height / 2;
  }

  setPrompt(t, timer) {
    this._text.text = t;
    let time = timer;
    this._timer.text = timer;
    let timerFunction = setInterval(() => {
      if(!(--time < 1)) { //countdown to 1
        this._timer.text = time;
      } else {  //timer stops at 1
        clearInterval(timerFunction);
      }
    }, 1000);
    this.resize();
  }
}
