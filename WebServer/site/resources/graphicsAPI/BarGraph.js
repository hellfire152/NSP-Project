/*
  Class for drawing a bar graph
  This shows up for the response data (maybe on the rankings too?)

  data consists of 2 arrays, labels and values.
  Author: Jin Kuan
*/
//colors constant for the bar graph bars
//first four colors are yellow, green, red, blue, following the MCQ buttons
const COLORS = [0xfffa00, 0x10ff00, 0x0031ad, 0xff0000, 0x07ff97, 0xff9307, 0xb200ff, 0xff60a8];
class BarGraph extends DisplayElement {
  constructor(resources, data, positionData) {
    super();
    //bar graph background
    this._background = new PIXI.Graphics()
      .beginFill(0xFFFFFF)
      .drawRect(0,0,100,100)
      .endFill();
    this._background.width = positionData.width;
    this._background.height = positionData.height;
    this._container.addChild(this._background);

    this._maxHeight = positionData.height;
    this._width = positionData.width;
    this._paddingX = positionData.paddingX;
    this._paddingY = positionData.paddingY;

    this._bars = [];

    //set data if data was defined
    if(data) {
      this.data = data;
    }
  }

  //updates the value for the bar at the specified index
  update(index, value) {
    this._bars[index].value = value;
  }

  set data(d) {
    for (let i = 0; i < this._container.children.length; i++) {
      this._container.removeChild(this._container.children[i]); //remove all children
    }
    this._container.addChild(this._background); //add back the background
    //add one bar for each label and value
    let barWidth = (this._width - this._paddingX * (d.labels.length - 1)) / d.labels.length;
    //search for the highestValue in the value
    let highestValue = 0;
    for(let value of d.values) {
      if(value > highestValue)
        highestValue = value;
    }
    for(let i = 0, colorIndex = 0; i < d.labels.length; i++, colorIndex++) {
      console.log(
        `GENERATING BAR WITH label ${d.labels[i]} and value ${d.values[i]} and color ${COLORS[colorIndex]}`);
      let bar = new BarGraphBar({
        'label' : d.labels[i],
        'value' : d.values[i],
        'color' : COLORS[colorIndex],
        'width' : barWidth,
        'maxHeight' : this._maxHeight - this._paddingY * 3 - 15,
        'maxValue' : highestValue,
        'padding' : this._paddingY
      });
      //shift back all the bars
      bar.y += this._maxHeight + this._paddingX;
      bar.x = i * bar.width + this._paddingX;
      this._bars.push(bar);
      //add to container
      this._container.addChild(bar.view);
    }
  }
}
