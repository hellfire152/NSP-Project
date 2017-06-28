/*
  Class for drawing a bar graph
  This shows up for the response data (maybe on the rankings too?)

  Author: Jin Kuan
*/
//var colors = [0x]
class BarGraph extends DisplayElement {
  constructor(resources, data) {
    super();
    //bar graph background
    this._background = new PIXI.Graphics()
      .beginFill(0xFFFFFF)
      .drawRect(0,0,100,100)
      .endFill();
    this._background.width = data.width;
    this._background.height = data.height;
    this._container.addChild(this._background);
    
    this._bars = [];
    //create a new bar for each column
    barWidth = (data.Width - data.paddingX * (data.labels.length - 1)) / data.labels.length;
    for(let i = 0, colorIndex = 0; i < data.labels.length; i++) {
      let bar = new BarGraphBar({
        'label' : data.labels[i],
        'value' : data.values[i],
        'color' : colors[colorIndex],
        'width' : barWidth,
        'maxHeight' : data.height,
        'padding' : 20
      });
      bar.x = i * data.paddingX;
      this._bars.push(bar);
      //add to container
      this._container.addChild(bar);
    }
  }

  //updates the value for the bar at the specified index
  update(index, value) {
    this._bars[index].value = value;
  }

}
