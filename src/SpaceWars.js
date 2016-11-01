
const ipcRenderer = require('electron').ipcRenderer;

window.addEventListener('keydown', function(e) {
  if (e.key == 'r')
    ipcRenderer.send('asynchronous-message', 'ping');
});

var graphics;
var stage;
var renderer;
window.onload = () => {
  width = window.innerWidth;
  height = window.innerHeight;
  renderer = new PIXI.WebGLRenderer(width, height);

  renderer.autoResize = true;
  document.body.appendChild(renderer.view);
  stage = new PIXI.Container();
  graphics = new PIXI.Graphics();

  graphics.beginFill(0xC0FFEE);

  // draw a rectangle
  graphics.drawRect(0, 0, 32, 32);


  stage.addChild(graphics);

  graphics.x = 100;
  graphics.y = 200;

  gameloop();

};

function gameloop() {
  requestAnimationFrame(gameloop);

  graphics.x += 5;
  renderer.render(stage);
}
