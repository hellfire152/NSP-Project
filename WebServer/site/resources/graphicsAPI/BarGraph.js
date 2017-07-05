/*
  Class for drawing a bar graph
  This shows up for the response data (maybe on the rankings too?)

  data consists of 2 arrays, labels and values.
  Author: Jin Kuan
*/
//colors constant for the bar graph bars
const COLORS = [0x0061ff, 0x6a00ff, 0xff3593, 0xff0000, 0xff6600, 0xfff200, 0x59ff00, 0x00ff90];
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
      this._container.removeChild(this._container.children[i]); //remove all bars
    }
    //add one bar for each label and value
    let barWidth = (this._width - this._paddingX * (d.labels.length - 1)) / d.labels.length;
    for(let i = 0, colorIndex = 0; i < d.labels.length; i++) {
      let bar = new BarGraphBar({
        'label' : d.labels[i],
        'value' : d.values[i],
        'color' : COLORS[colorIndex],
        'width' : barWidth,
        'maxHeight' : this._maxHeight,
        'padding' : this._paddingY
      });
      bar.x = i * this._paddingX;
      this._bars.push(bar);
      //add to container
      this._container.addChild(bar.view);
    }
  }
}
