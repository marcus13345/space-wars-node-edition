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

  static loadPrefab(prefab, parent) {
    var parsedObject = SceneManager.parseScene([{
      "Entity": prefab
    }]);
    var gameobject = parsedObject.local[0];

    if(parent !== undefined) {
      gameobject.parent = parent;
    }else {
      gameobject.parent = null;
    }

    parsedObject.global.forEach((value) => {
      if(parent !== undefined)
        parent.children.push(value);
      else
        SceneManager._scene.push(value);
    });

    gameobject.start();
  }

  static loadScene(config) {
    //if this is a strign reference to a scene we already loaded, load that.
    if(typeof(config) === 'string')
      config = global.scenes[config];
    SceneManager._scene = SceneManager.parseScene(config, null).global;
    SceneManager._scene.forEach((go) => {
      go.scripts.forEach( (script) => {
        script.start();
      });
    });
  }

  static defineLayers(layers) {
    SceneManager._layers = layers;
  }

  static getLayerDepth(layer) {
    return SceneManager._layers[layer];
  }

  static parseScene(config, parent) {
    var result = {global: [], local: []};

    config.forEach( (jsonGameobject) => {
      var gameobject, nextLevel;
      if(jsonGameobject.Entity.toUpperCase() != "GAMEOBJECT") {
        nextLevel = this.parseScene([global.prefabs[jsonGameobject.Entity]]);
        gameobject = nextLevel.local[0];
      } else {
        gameobject = new Gameobject();
        SceneManager._IDs[jsonGameobject.ID] = gameobject;
        gameobject.class = jsonGameobject.Class;

        if('Scripts' in jsonGameobject)
          //for each script in config
          jsonGameobject.Scripts.forEach( (jsonScript) => {
            //make the script object
            var scriptObject = new global.scripts[jsonScript.Entity]();

            //inject some data
            scriptObject.transform = gameobject.transform;
            scriptObject.gameobject = gameobject;

            //add script to the object
            gameobject.addScript(scriptObject);

            // go over the properties in the config
            for(var value in jsonScript.Properties) {
              if(jsonScript.Properties.hasOwnProperty(value))
                // and set them on the script
                scriptObject[value] = jsonScript.Properties[value];
            }
            //scriptObject
          });
        gameobject.parent = parent;
      }

      if('x' in jsonGameobject)
        gameobject.transform.x = jsonGameobject.x;
      else
        gameobject.transform.x = 0;

      if('y' in jsonGameobject)
        gameobject.transform.y = jsonGameobject.y;
      else
        gameobject.transform.y = 0;

      //add the current gameobject to both our local and global scoped arrays
      result.local.push(gameobject);
      result.global.push(gameobject);

      if('Children' in jsonGameobject) {
        nextLevel = SceneManager.parseScene(jsonGameobject.Children, gameobject);
        gameobject.children = nextLevel.local;
        nextLevel.global.forEach((value) => {
          result.global.push(value);
        });
      }
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

global.scenes = {};
function registerScene(name, scene) {
  global.scenes[name] = scene;
}

function defineRenderLayers(layers) {
  SceneManager.defineLayers(layers);
}
