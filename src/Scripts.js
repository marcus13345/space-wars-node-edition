/* jshint esversion: 6 */

class Script {
  constructor() {
    this.timers = [];
  }

  destroy() {
    for(let i = 0; i < this.timers.length; i ++) {
      clearInterval(this.timers[i]);
    }
    if('graphics' in this) {
      // console.log(SceneManager.stage);
      while (SceneManager.stage.children.length > 0) {
        SceneManager.stage.removeChild(SceneManager.stage.children[0]);
      };
    }
  }

  interval(fun, time) {
    var _return = setInterval(()=> {
      if(!paused)
        fun.call(this);
    }, time)
    this.timers.push(_return);
    return _return;
  }

  getComponent(type) {
    return this.gameobject.getComponent(type);
  }

  render() {}
  update() {}
  start() {}
  collision() {}

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

registerScript(class RectRenderer extends Script {
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
}); // RectRenderer
registerScript(class SpriteRenderer extends Script{
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
}); // SpriteRenderer
registerScript(class RigidBody extends Script {

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
}); // RigidBody
registerScript(class BoxCollider extends Script{
  constructor() {
    super();
    // console.log(this);
    this.width = 0;
    this.height = 0;
    this.xoff = 0;
    this.yoff = 0;
  }

  start() {
    if(!('colliders' in global))
      global.colliders = [];

    global.colliders.push(this);
  }

  get x() {
    return this.gameobject.transform.position.x + this.xoff;
  }

  get y() {
    return this.gameobject.transform.position.y + this.yoff;
  }

  update() {
    for(let i = 0; i < global.colliders.length; i ++) {

      //basically copy pasta from MDN
      var rect1 = {x: global.colliders[i].x, y: global.colliders[i].y, width: global.colliders[i].width, height: global.colliders[i].height};
      var rect2 = {x: this.x, y: this.y, width: this.width, height: this.height};

      // console.log(rect1, rect2);

      if (rect1.x < rect2.x + rect2.width && rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height && rect1.height + rect1.y > rect2.y && global.colliders[i] != this) {

        //this just SEEMS like a good idea, idk
        setTimeout(() => {
          // console.log("A THING");
          this.gameobject.collision(global.colliders[i]);
          global.colliders[i].gameobject.collision(this);
        }, 0);

      }
    }
  }
});
