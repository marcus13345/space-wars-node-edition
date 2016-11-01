

class SceneManager {

  static get scene() {
    return _scene;
  }

  static loadScene(config) {
    for(var gameobject in config) {
      console.log("asdf");
    }
  }

  static initialize() {
    this._self = new SceneManager();
  }

  constructor() {
    this._scene
  }
}

SceneManager.initialize();

SceneManager.loadScene([
  { //this is a gameobject
    "Entity": "GameObject", //regular gameobject, nothing amazing. where you would place a prefab name.
    "Name": "Player",
    "ID": "Player",
    "Class": [],
    "Scripts": [ //self explanitory
      {
        "Entity": "Transform", //a transform
        "Properties": { // with some properties
          "x": 500,
          "y": 300
        }
      },
      {
        "Entity": "RectRenderer", //this one puts a rectangle on the screen
        "Properties": { //with properties
          "width": 16,
          "height": 16,
          "color": 0x0af9c7
        }
      }
    ]
  }
]);
