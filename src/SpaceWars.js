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
