/* jshint esversion: 6 */

class Gameobject {
  constructor() {
    this._scripts = [];
    this._transform = new Transform();
    this.addScript(this._transform);
  }

  get transform() {
    return this._transform;
  }

  get scripts() {
    return this._scripts;
  }

  getComponent(type) {
    var match = null;
    this._scripts.forEach((value) => {
      if (type == value.__proto__.constructor.name)
        match = value;
    });
    return match;
  }

  addScript(newScript) {
    this._scripts.push(newScript);
  }

  static findObjectByID(id) {
    if(id in SceneManager.IDTable)
      return SceneManager.IDTable[id];
    else return null;
  }

  start() {
    this._scripts.forEach( (script) => {
      if('start' in script)
        script.start();
    });
  }

  update() {
    this._scripts.forEach( (script) => {
      if('update' in script)
        script.update();
    });
  }
}
