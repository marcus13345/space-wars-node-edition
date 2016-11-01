/* jshint esversion: 6 */

class SceneManager {

  static get scene() {
    return SceneManager._scene;
  }

  static get stage() {
    return SceneManager._stage;
  }

  static set self(value) {
    SceneManager._self = value;
  }

  static get IDTable() {
    return SceneManager._IDs;
  }

  static loadScene(config) {
    SceneManager.scene = SceneManager.parseScene(config);
  }

  static parseScene(config) {
    config.forEach( (jsonGameobject) => {
      console.log(jsonGameobject);
      var gameobject = new Gameobject();
      gameobject.transform.x = jsonGameobject.x;
      gameobject.transform.y = jsonGameobject.y;
      SceneManager._scene.push(gameobject);
      SceneManager._IDs[jsonGameobject.ID] = gameobject;
      gameobject.class = jsonGameobject.Class;
      jsonGameobject.Scripts.forEach( (jsonScript) => {
        var scriptObject = new global.scripts[jsonScript.Entity]();
        scriptObject.transform = gameobject.transform;
        gameobject.addScript(scriptObject);
      });
    });
  }

  constructor() {
    SceneManager._scene = [];
    SceneManager._stage = new PIXI.Container();
    SceneManager._IDs = {};
  }
}

SceneManager.self = new SceneManager();

SceneManager.loadScene([
  { //this is a gameobject
    "Entity": "GameObject", //regular gameobject, nothing amazing. where you would place a prefab name.
    "Name": "Player",
    "ID": "Player",
    "Class": [],
    "x": 500,
    "y": 300,
    "Scripts": [ //self explanitory
      {
        "Entity": "RectRenderer", //this one puts a rectangle on the screen
        "Properties": { //with properties
          "width": 16,
          "height": 16,
          "color": 0x0af9c7
        }
      }
    ],
    "Children": [
      { //this is a gameobject
        "Entity": "GameObject", //regular gameobject, nothing amazing. where you would place a prefab name.
        "Name": "Enemy",
        "ID": "",
        "Class": ["Enemy"],
        "x": 600,
        "y": 300,
        "Scripts": [ //self explanitory
          {
            "Entity": "RectRenderer", //this one puts a rectangle on the screen
            "Properties": { //with properties
              "width": 16,
              "height": 16,
              "color": 0x45e1fc
            }
          }
        ]
      },

      { //this is a gameobject
        "Entity": "GameObject", //regular gameobject, nothing amazing. where you would place a prefab name.
        "Name": "Enemy",
        "ID": "",
        "Class": ["Enemy"],
        "x": 700,
        "y": 300,
        "Scripts": [ //self explanitory
          {
            "Entity": "RectRenderer", //this one puts a rectangle on the screen
            "Properties": { //with properties
              "width": 16,
              "height": 16,
              "color": 0x45e1fc
            }
          }
        ]
      }

    ]
  }
]);
