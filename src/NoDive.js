/* jshint esversion: 6 */

const ipcRenderer = require('electron').ipcRenderer;

window.addEventListener('keydown', function(e) {
  if (e.key == 'r')
    ipcRenderer.send('asynchronous-message', 'ping');
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
  requestAnimationFrame(gameloop);

  SceneManager.stage.children.sort((a, b) => {
    var c = SceneManager.getLayerDepth(a.renderer.renderLayer),
        d = SceneManager.getLayerDepth(b.renderer.renderLayer);

    if(c == d) return 0;
    else if(c > d) return 1;
    else return -1;
  });
  SceneManager.scene.forEach((value) => {
    if('update' in value)
      value.update();
  });

  renderer.render(SceneManager.stage);
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
    var poop = "#c0ff33";
  }
  // #c0ff33
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
}
