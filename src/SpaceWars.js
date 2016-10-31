
const ipcRenderer = require('electron').ipcRenderer;
console.log(ipcRenderer.sendSync('synchronous-message', 'reload'))

window.onkeypressed = (e) => {
  if (String.fromCharCode(e.keyCode) == 'r') {
    ipcRenderer.send('asynchronous-message', 'ping')
  }
}

window.onload = () => {
  console.log("asdf");
}

window.onload = () => {
  width = window.innerWidth;
  height = window.innerHeight;
  var renderer = new PIXI.WebGLRenderer(width, height);

  renderer.autoResize = true;
  document.body.appendChild(renderer.view);

  var stage = new PIXI.Container();


  var graphics = new PIXI.Graphics();

  graphics.beginFill(0xFFFF00);

  // draw a rectangle
  graphics.drawRect(0, 0, 32, 32);

  stage.addChild(graphics);

  graphics.x = 100;
  graphics.y = 200;

  renderer.render(stage);

  console.log(window);

};
