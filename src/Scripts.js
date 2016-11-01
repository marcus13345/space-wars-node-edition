/* jshint esversion: 6 */

class Script {
  constructor() {

  }

  render() {}
  update() {}

  start() {}

}


class Transform extends Script {
  constructor() {
    super();
    this.x = 0;
    this.y = 0;
  }
}

class RectRenderer extends Script {
  constructor() {
    super();
    this.color = 0xFF00FF;
    this.width = 10;
    this.height = 10;
  }

  start() {
    this.graphics = new PIXI.Graphics();
    this.graphics.beginFill(this.color);
    this.graphics.drawRect(0, 0, this.width, this.height);
    SceneManager.stage.addChild(graphics);
  }

  update() {
    this.graphics.x = this.transform.x;
    this.graphics.y = this.transform.y;
  }
}

global.scripts = {};
global.scripts.RectRenderer = RectRenderer;
