/* jshint esversion: 6 */

class Script {
  constructor() {}

  getComponent(type) {
    return this.gameobject.getComponent(type);
  }

  render() {}
  update() {}
  start() {}

}

global.scripts = {};
function registerScript(myClass) {
  global.scripts[myClass.name] = myClass;
}

class Transform extends Script {
  constructor() {
    super();
    // debugger;
    this.position = new Vec2(0, 0);
  }
}

registerScript(
  class RectRenderer extends Script {
    constructor() {
      super();
      this.color = 0xFF00FF;
      this.width = 10;
      this.height = 10;
      this.renderLayer = "Default";
    }

    start() {
      this.graphics = new PIXI.Graphics();
      this.graphics.beginFill(this.color);
      this.graphics.drawRect(0, 0, this.width, this.height);
      SceneManager.stage.addChild(this.graphics);
      this.graphics.renderer = this;
    }

    update() {
      // console.log(this);
      this.graphics.x = this.transform.position.x;
      this.graphics.y = this.transform.position.y;
    }
  }
); // RectRenderer
registerScript(
  class SpriteRenderer extends Script{
    constructor() {
      super();
      this.width = 10;
      this.height = 10;
      this.graphics = {};
      this.renderLayer = "Default";
      this.color = 0xFFFFFF;
    }

    set color(value) {
      if('tint' in this.graphics)
        this.graphics.tint = value;
      else this._color = value;
    }

    start() {
      var loader = new PIXI.loaders.Loader();
      loader.add('name', this.url);
      loader.once('complete', () => {
        this.graphics = PIXI.Sprite.fromImage(this.url);
        SceneManager.stage.addChild(this.graphics);
        this.graphics.renderer = this;
        this.color = this._color;
      });
      loader.load();
    }

    update() {
      this.graphics.x = this.transform.position.x;
      this.graphics.y = this.transform.position.y;
    }
  }
); // SpriteRenderer

registerScript(
  class RigidBody extends Script {

    constructor() {
      super();
      this.dx = 0;
      this.dy = 0;
      this.drag = 1.1;
      this.maxSpeed = -1;
    }

    update() {
      this.transform.position.x += this.dx;
      this.transform.position.y += this.dy;

      this.dx /= this.drag;
      this.dy /= this.drag;
    }

    applyForce(force) {
      this.dx += force.x;
      this.dy += force.y;
    }
  }
); // RigidBody
