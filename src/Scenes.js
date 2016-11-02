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
    SceneManager._scene = SceneManager.parseScene(config, null);
    SceneManager._scene.forEach((go) => {
      go.scripts.forEach( (script) => {
        script.start();
      })
    });
  }

  static defineLayers(layers) {
    SceneManager._layers = layers;
  }

  static getLayerDepth(layer) {
    return SceneManager._layers[layer];
  }

  static parseScene(config, parent) {
    var result = [];
    config.forEach( (jsonGameobject) => {
      var gameobject = new Gameobject();
      gameobject.transform.x = jsonGameobject.x;
      gameobject.transform.y = jsonGameobject.y;
      result.push(gameobject);
      SceneManager._IDs[jsonGameobject.ID] = gameobject;
      gameobject.class = jsonGameobject.Class;
      jsonGameobject.Scripts.forEach( (jsonScript) => {
        var scriptObject = new global.scripts[jsonScript.Entity]();
        scriptObject.transform = gameobject.transform;
        scriptObject.gameobject = gameobject;
        gameobject.addScript(scriptObject);
        for(var value in jsonScript.Properties) {
          if(jsonScript.Properties.hasOwnProperty(value))
            scriptObject[value] = jsonScript.Properties[value]
        }
        scriptObject
      });
      if('Children' in jsonGameobject) {
        gameobject.children = SceneManager.parseScene(jsonGameobject.Children, gameobject);
        gameobject.children.forEach((value) => {
          result.push(value);
        });
      }
      gameobject.parent = parent;
    });
    return result;
  }

  constructor() {
    SceneManager._scene = [];
    SceneManager._stage = new PIXI.Container();
    SceneManager._IDs = {};
  }
}
SceneManager.self = new SceneManager();


// ================= Scene Loading =================

SceneManager.loadScene([
  { //this is a gameobject
    "Entity": "GameObject", //regular gameobject, nothing amazing. where you would place a prefab name.
    "Name": "Background",
    "ID": "Background",
    "Class": [],
    "x": 0,
    "y": 0,
    "Scripts": [ //self explanitory
      {
        "Entity": "SpriteRenderer", //this one puts a rectangle on the screen
        "Properties": { //with properties
          // "url": "http://wallpaperstyle.com/web/wallpapers/hot-girl/1280x720.jpg",
          "url": "http://wallpapercave.com/wp/6K44j5E.jpg",
          "color": 0x333333,
          "renderLayer": "Background"
        }
      }
    ]
  },
  { //this is a gameobject
    "Entity": "GameObject", //regular gameobject, nothing amazing. where you would place a prefab name.
    "Name": "Player",
    "ID": "Player",
    "Class": [],
    "x": 631,
    "y": 740,
    "Scripts": [ //self explanitory
      {
        "Entity": "RectRenderer", //this one puts a rectangle on the screen
        "Properties": { //with properties
          "width": 16,
          "height": 16,
          "color": 0x0af9c7
        }
      },
      {
        "Entity": 'RigidBody',
        "Properties": {
          'dy': -15
        }
      },
      {
        "Entity": 'PlayerController',
        "Properties": {

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
]);

SceneManager.defineLayers({
  "Default": 1,
  "Background": 0,
  "Entities": 2
});
