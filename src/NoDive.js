/* jshint esversion: 6 */

const ipcRenderer = require('electron').ipcRenderer;

var paused = false;
var speed = 1;

Math.sigmoid = function(t) {
  return 1/(1+Math.pow(Math.E, -t));
};

Math.diomgis = function(t) {
  return -Math.log(((1/t)-1));
}

window.addEventListener('keydown', function(e) {
  if (e.key == 'r' || e.key == 'R')
    ipcRenderer.send('asynchronous-message', 'ping');
  if (e.key == 'p' || e.key == 'P')
    paused = !paused
  if (e.key == '1')
    speed = 1;
  if (e.key == '2')
    speed = 2;
  if (e.key == '3')
    speed = 3;
});

var graphics;
var renderer;

window.onload = () => {
  width = window.innerWidth;
  height = window.innerHeight;
  global.viewport = {};
  global.viewport.width = width;
  global.viewport.height = height;
  renderer = new PIXI.WebGLRenderer(width, height);

  renderer.autoResize = true;
  document.body.appendChild(renderer.view);

  window.addEventListener('keydown', function(e) {
    Keyboard.keys[e.keyCode] = true;
  });

  window.addEventListener('keyup', function(e) {
    Keyboard.keys[e.keyCode] = false;
  });

  gameloop();

};

function gameloop() {
  if(speed == 1)
    requestAnimationFrame(gameloop);

  if(!paused) {
    if(speed != 3) {
      SceneManager.stage.children.sort((a, b) => {
        var c = SceneManager.getLayerDepth(a.renderer.renderLayer),
        d = SceneManager.getLayerDepth(b.renderer.renderLayer);

        if(c == d) return 0;
        else if(c > d) return 1;
        else return -1;
      });
    }

    SceneManager.scene.forEach((value) => {
      if('update' in value)
      value.update();
    });

    if(speed != 3)
      renderer.render(SceneManager.stage);
  }


  if(speed != 1)
    setTimeout(gameloop, 0);
}

var Keyboard = {
  keys: [],
  getKeyCodeDown: function(code) {
    return this.keys[code];
  },
  getKeyDown: function(character) {
    return this.getKeyCodeDown(character.toUpperCase().charCodeAt(0));
  }
}
for(var i = 0; i < 256; i ++) Keyboard.keys.push(false);

class Vec2 {
  constructor(x, y) {
    this.val = [x, y];
  }

  subtract(vec) {
    return new Vec2(this.x - vec.x, this.y - vec.y);
  }

  add(vec) {
    return new Vec2(this.x + vec.x, this.y + vec.y);
  }

  scale(factor) {
    // console.log(factor, this.x, this.y);
    return new Vec2(this.x * factor, this.y * factor);
  }

  get x() {
    // console.log(new Error().stack);
    return this.val[0];
  }

  get y() {
    // console.log(new Error().stack);
    return this.val[1];
  }

  set x(value) {
    // console.log(new Error().stack);
    this.val[0] = value;
  }

  set y(value) {
    // console.log(new Error().stack);
    this.val[1] = value;
  }

  static get up() {
    return new Vec2(0, -1);
  }

  static get down() {
    return new Vec2(0, 1);
  }

  static get left() {
    return new Vec2(-1, 0);
  }

  static get right() {
    return new Vec2(1, 0);
  }

  reverse() {
    return new Vec2(-this.x, -this.y);
  }

  static distance(u, v) {
    return Math.sqrt(Math.pow(u.x-v.x, 2) + Math.pow(u.y-v.y, 2));
  }
}
