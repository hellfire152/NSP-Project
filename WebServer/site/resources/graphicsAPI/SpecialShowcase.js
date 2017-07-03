/*
  Special view of player data, meant for the titles and achievements

  Author: Jin Kuan
*/
class SpecialShowcase extends DisplayElement {
  constructor(data, positionData) {
    this._panels = [];
    //generating a panel for each data set
    for(let playerData of data) {
      //white background
      let width = (WIDTH - positionData.paddingX * (data.length - 1)) / data.length;
      let background = new PIXI.Graphics()
        .beginFill(0xFFFFFF)
        .drawRect(0, 0, width, positionData.height)
        .endFill();
      //let profilePicture = new PIXI.Sprite.fromImage(playerData.profilePicture);
      let name = new PIXI.Text(playerData.name);
      let score = new PIXI.Text(`Score: ${playerData.score}`);
      //handling achievements
      let earnedText = new PIXI.Text('Earned: ');
      let achievements = [], titleElement;
      //create a new thing for each achievement
      if(playerData.achievements) {
        for(let achievement of playerData.achievements) {
          let container = new PIXI.Container();
          let title = new PIXI.Text(achievement.title);
          let icon = PIXI.Sprite.fromImage(`/resources/images/achievement/${achievement.image}`);
          let details = new PIXI.Text(achievement.details);
          //positioning
          icon.x = icon.y = 0; //icon sits to the left
          title.x = icon.width + 5; //title at right top
          details.x = icon.width + 5; //details at right bottom
          details.y = title.height + 5;
          //add to container
          container.addChild(icon, title, details);
          achievments.push(container);
        }
      }
      //handling title
      if(playerData.title) {
        let container = new PIXI.Container();
        let title = new PIXI.Text(title.title);
        let icon = PIXI.Sprite.fromImage(`/resources/images/achievement/${title.image}`);
        let details = new PIXI.Text(title.details);
        //positioning
        icon.x = icon.y = 0; //icon sits to the left
        title.x = icon.width + 5; //title at right top
        details.x = icon.width + 5; //details at right bottom
        details.y = title.height + 5;
        //add to container
        container.addChild(icon, title, details);
        titleElement = container;
      }
      //line separating the profile pic, name and score from what they earned
      let yOffset = name.height + score.height + 50 + positionData.paddingY * 5
      let lineSeparator = new PIXI.Graphics()
        .lineStyle(5, 0x000000)
        .moveTo(0, 0)
        .lineTo(width - 10);
      lineSeparator.anchor.set(0.5, 0.5);
      lineSeparator.x = WIDTH / 2;
      lineSeparator.y = yOffset; //profilePic's height is the 50
      yOffset += positionData.paddingY;
      //positioning titles and achievements
      titleElement.y = yOffset;
      earnedText.y = yOffset + positionData.paddingY;
      yOffset += positionData.paddingY;
      for(let achievementElement of achievements) {
        achievementElement.y = yOffset;
        yOffset += positionData.paddingY;
      }

      //add all to container
      this._container.addChild(background, name, score, lineSeparator,
        titleElement, earnedText);
      for(let a of achievements) {
        this._container.addChild(a);
      }
    }
    //positioning all panels
  }
}
