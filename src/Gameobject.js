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

  addScript(newScript) {
    this._scripts.push(newScript);
  }

  static findObjectByID(id) {
    if(id in SceneManager.IDTable)
      return SceneManager.IDTable[id];
    else return null;
  }

  update() {
    this._scripts.forEach( (script) => {
      script.update();
    });
  }
}
