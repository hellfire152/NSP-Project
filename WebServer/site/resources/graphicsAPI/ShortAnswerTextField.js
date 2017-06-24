/*
  Convenience class for the short answer text field,
  required for the short answer type questions

  Author: Jin Kuan
*/
class ShortAnswerTextField extends DisplayElement{
  constructor(width, height) {
    super();
    //textbox
    this._container = new PIXI.Graphics();
    this._container
      .beginFill(0xFFFFFF)  //white
      .lineStyle(5, 0x353535, 0)  //with grey outline 5px wide
      .drawRect(0, 0, width, height) //rectangle of specified width and height
      .endFill();

    this._text = new PIXI.Text('', {
      'wordWrap' : true,
      'wordWrapWidth' : width - 10
    });
    this._text.anchor.set(0.5,0.5);
    this._text.x = this._container.width / 2;
    this._text.y = this._container.
    this._container.addChild(this._text);

    document.onkeydown = ((textField) => {
      return (e) => {
        if(e.which == 17 || e.which == 18); //ctrl or alt keys (do nothing)
        else if(e.which == 13) ShortAnswerTextField.submit(send, textField.text); //enter key
        else if(e.which == 8)textField.backspace(); //backspace key
        else {
          let char = String.fromCharCode(e.which);
          if (e.shiftKey) char.toUpperCase(); //shift key pressed
          textField.append(char);
        }
      }
    })(this);
  }

  append(char) {
    this._text.text += char;
  }

  backspace() {
    //remove the last character
    this._text.text = this._text.text.slice(0, -1);
  }

  get text() {
    return this._text.text;
  }

  set text(t) {
    this._text.text = t;
  }

  static submit(send, text) {
    send({
      'game': C.GAME.SUBMIT_ANSWER,
      'answer': text
    });
  }
}
