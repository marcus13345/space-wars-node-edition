class Gameobject {
  constructor() {
    this.scripts = [];
    this.Tranform = new Tranform();
    addScript(this.Tranform);
  }

  addScript(newScript) {
    this.scripts.push(newScript);
  }

  static findObjectByID(id) {
    // for()
  }
}
