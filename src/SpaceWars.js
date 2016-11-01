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

  gameloop();

};

function gameloop() {
  requestAnimationFrame(gameloop);

  for(var i in SceneManager.scene) {
    // console.log(go);
    var v = SceneManager.scene[i];
    v.update();
  }

  renderer.render(SceneManager.stage);
}

class Poop {

}
