/* jshint esversion: 6 */

var seedrandom = require('seedrandom');
var random = seedrandom('hello.');
var $ = require('jquery');

registerScript(class PlayerController extends Script{
  constructor() {
    super();
    this.rb = {};
  }

  start() {
    this.rb = this.getComponent('RigidBody');
    this.renderer = this.getComponent('RectRenderer');
    // console.log(this.rb);
    //this.rb.applyForce([20, 0]);
  }

  update() {
    var w = Keyboard.getKeyDown('w');
    var a = Keyboard.getKeyDown('a');
    var s = Keyboard.getKeyDown('s');
    var d = Keyboard.getKeyDown('d');

    if(w && !s)
      this.rb.applyForce(Vec2.up);
    else if(s && !w)
      this.rb.applyForce(Vec2.down);

    if(d && !a)
      this.rb.applyForce(Vec2.right);
    else if(a && !d)
      this.rb.applyForce(Vec2.left);


    if(this.transform.position.x < 0) {
      this.rb.applyForce(Vec2.right.scale(1.2));
      this.outOfBounds = true;
    }else if(this.transform.position.x + this.renderer.width > global.viewport.width){
      this.rb.applyForce(Vec2.left.scale(1.2));
      this.outOfBounds = true;
    }

    if(this.transform.position.y < 0) {
      this.rb.applyForce(Vec2.down.scale(1.2));
      this.outOfBounds = true;
    }else if(this.transform.position.y + this.renderer.height > global.viewport.height){
      this.rb.applyForce(Vec2.up.scale(1.2));
      this.outOfBounds = true;
    }
  }

  collision(other) {
    scripts.GameManager.reset();
  }
});
registerScript(class EnemyController extends Script {
  constructor() {
    super();
    this.player = null;
    this.rb = null;
    this.rx = 0;
    this.ry = 0;
    this.debug = false;
    this.graphics = null;
    this.renderLayer = "Default";
    this.handicap = 1;
  }

  start() {
    this.player = Gameobject.findObjectByID("Player");
    this.randomizeRPos();
    this.rb = this.getComponent("RigidBody");
    this.interval(this.randomizeRPos, (random() * 1000) + 500);
    if(this.debug) {
      var renderer = this.getComponent('RectRenderer');
      if(renderer !== null) {
        this.graphics = new PIXI.Graphics();
        var color, colormethod = 0;
        if(colormethod == 0) {
          var colors = [
            ((renderer.color >> 0) & 0xFF0000) | ((renderer.color >> -8) & 0x00FF00) | ((renderer.color >> 8) & 0x0000FF),
            ((renderer.color >> -16) & 0xFF0000) | ((renderer.color >> 0) & 0x00FF00) | ((renderer.color >> 16) & 0x0000FF),
            ((renderer.color >> -16) & 0xFF0000) | ((renderer.color >> 8) & 0x00FF00) | ((renderer.color >> 8) & 0x0000FF),
            ((renderer.color >> -8) & 0xFF0000) | ((renderer.color >> 8) & 0x00FF00) | ((renderer.color >> 0) & 0x0000FF),
            ((renderer.color >> -8) & 0xFF0000) | ((renderer.color >> -8) & 0x00FF00) | ((renderer.color >> 16) & 0x0000FF)
          ];
          color = colors[Math.floor(random() * colors.length)];
        }else if(colormethod == 1) {
          var shifts = [0, 8, 16];
          color = ((renderer.color >> -shifts[Math.floor(random() * 3)]) & 0xFF0000) |
                  ((renderer.color >> (shifts[Math.floor(random() * 3)] - 8)) & 0x00FF00) |
                  ((renderer.color >> shifts[Math.floor(random() * 3)]) & 0x0000FF);
        }

        this.graphics.lineStyle(2, color);
        this.graphics.moveTo(0, 0);
        this.graphics.lineTo(10, 0);
        SceneManager.stage.addChild(this.graphics);
        this.graphics.renderer = this;
      }
    }
  }

  randomizeRPos() {
    // console.log("randomizing");
    this.rx = this.player.transform.position.x + Math.diomgis(random()) * 60;
    this.ry = this.player.transform.position.y + Math.diomgis(random()) * 60;
    this.handicap = random() * (9/10) + .1;
    // console.log(this);
  }

  randomizePosition() {
    this.transform.position.x = random() * global.viewport.width;
    this.transform.position.y = random() * global.viewport.height / 3;
  }

  update() {
    var vec = this.transform.position.subtract((new Vec2(this.rx, this.ry))).reverse().scale(1.0/600).scale(this.handicap);
    this.rb.applyForce(vec);

    // this.graphics.moveTo(0, 0);
    // this.graphics.lineTo(this.rx, this.ry);
    // console.log(this.rx);
    this.graphics.scale.x = this.rx/1000;
    this.graphics.scale.y = this.ry/1000;
    this.graphics.x = this.gameobject.transform.position.x;
    this.graphics.y = this.gameobject.transform.position.y;
  }
});
registerScript(class EnemySpawner extends Script {
  constructor() {
    super();
    this.spawner = null;
  }

  start() {
    this.spawner = this.interval(this.spawnEnemy, 1000);
  }

  spawnEnemy() {
    var enemy = SceneManager.loadPrefab("Enemy");
    var controller = enemy.getComponent('EnemyController');
    controller.randomizePosition();
  }
});
registerScript(class GameManager extends Script {
  constructor() {
    super();
    GameManager.self = this;
    this.player = Gameobject.findObjectByID('Player');
  }

  start() {
    if(!network._locked) {
      var enemies = Gameobject.findObjectsByClass('Enemy');
      for(let i = 0; i < enemies.length; i ++) {
        var nnid = enemies[i].getComponent('NNID');
        network.addInput(nnid.ID + '_X');
        network.addInput(nnid.ID + '_Y');
      }

      network.addInput('Player_X');
      network.addInput('Player_Y');

      network.addOutput("up", function() {
        // console.log("up");
        Keyboard.keys['W'.charCodeAt(0)] = true;
        Keyboard.keys['A'.charCodeAt(0)] = false;
        Keyboard.keys['S'.charCodeAt(0)] = false;
        Keyboard.keys['D'.charCodeAt(0)] = false;
      });
      network.addOutput("left", function() {
        // console.log("left");
        Keyboard.keys['W'.charCodeAt(0)] = false;
        Keyboard.keys['A'.charCodeAt(0)] = true;
        Keyboard.keys['S'.charCodeAt(0)] = false;
        Keyboard.keys['D'.charCodeAt(0)] = false;
      });
      network.addOutput("down", function() {
        // console.log("down");
        Keyboard.keys['W'.charCodeAt(0)] = false;
        Keyboard.keys['A'.charCodeAt(0)] = false;
        Keyboard.keys['S'.charCodeAt(0)] = true;
        Keyboard.keys['D'.charCodeAt(0)] = false;
      });
      network.addOutput("right", function() {
        // console.log("right");
        Keyboard.keys['W'.charCodeAt(0)] = false;
        Keyboard.keys['A'.charCodeAt(0)] = false;
        Keyboard.keys['S'.charCodeAt(0)] = false;
        Keyboard.keys['D'.charCodeAt(0)] = true;
      });

      // debugger;
      global.scripts.GameManager.fitnessCallback = network.genesis();
    }
    var synRoot = $('#synRoot');
    for(let i = 0; i < network._synapses.length; i ++) {
      // console.log(synRoot.find("#syn" + i).length);
      var element;
      if((element = synRoot.find("#syn" + i)).length == 0) {
        // debugger;
        element = $(document.createElement('div'));
        element.css('height', '3px');
        element.css('opacity', '.5');
        element.attr('id', "syn" + i);
        synRoot.append(element);
      }
      var sign = network._synapses[i].weight / Math.abs(network._synapses[i].weight);
      element.css('background-color', sign > 0 ? 'blue' : 'red');
      element.css('width', "" + (Math.abs(network._synapses[i].weight * 3)) + "px")
    }
    this.player = Gameobject.findObjectByID('Player');
    this.fitness = 0;
    this.startTime = new Date().getTime();
  }

  update() {
    // network.changeInput('Player_X', this.player.transform.position.x / global.viewport.width);
    // network.changeInput('Player_Y', this.player.transform.position.y / global.viewport.height);
    network.predict();

    this.fitness = (new Date().getTime() - this.startTime) / 1000;
    this.fitness = this.fitness.toFixed(2);

    $('#generation').html(network._generation);
    $('#species').html(network._species);
    $('#fitness').html(this.fitness);
  }

  static reset() {
    // console.log(global.scripts.GameManager.fitnessCallback);
    if(global.scripts.GameManager.fitnessCallback !== undefined)
      global.scripts.GameManager.fitnessCallback.apply(network, [global.scripts.GameManager.fitness]);
    random = seedrandom('systematic love');
    if(network._species == 19) {
      global.scripts.GameManager.fitnessCallback = network.generation();
    }else{
      global.scripts.GameManager.fitnessCallback = network.species();
    }
    // console.log(global.scripts.GameManager);
    SceneManager.loadScene('neuralNetwork');
  }

  get enemies() {
    Gameobject.findObjectsByClass('Enemy');
  }
});
registerScript(class NNID extends Script {
  constructor() {
    super();
  }

  start() {
  }

  update() {
    network.changeInput(this.ID + '_X', this.transform.position.x / global.viewport.width);
    network.changeInput(this.ID + '_Y', this.transform.position.y / global.viewport.height);
  }
});

registerPrefab('Enemy', {
  "Entity": "Gameobject",
  "Class": ['Enemy'],
  "Scripts": [
    {
      "Entity": "RectRenderer",
      "Properties": {
        "color": 0xFF3311,
        "width": 16,
        "height": 16
      }
    },
    {
      "Entity": "EnemyController",
      "Properties": {
        "debug": true
      }
    },
    {
      "Entity": "RigidBody",
      "Properties" :{
        "terminalVelocity": 10
      }
    }
  ]
});
registerPrefab('Player', { // the player
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
        "color": 0xC0FF33//0x0af9c7
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
    },
    {
      "Entity": "BoxCollider",
      "Properties": {
        "width": 16,
        "height": 16
      }
    }
  ]
});
registerPrefab('GameManager', {
  "Entity": "GameObject",
  "ID": "GameManager",
  "Scripts": [
    {
      "Entity": "GameManager"
    }
  ]
});

registerScene('level1', [
  { // the background
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
  {
    "Entity": "Player"
  },
  { //this is a gameobject
    "Entity": "gameobject", //regular gameobject, nothing amazing. where you would place a prefab name.
    "Name": "Enemy Spawner",
    "Scripts": [
      {
        "Entity": "EnemySpawner"
      }
    ]
  },
  {
    "Entity": "GameManager"
  }
]);
registerScene('neuralNetwork', [
  { // the background
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
  {
    "Entity": "Player"
  },
  {
    "Entity": "GameManager"
  },
  {
    "Entity": "Gameobject",
    "Class": ['Enemy'],
    "Scripts": [
      {
        "Entity": "RectRenderer",
        "Properties": {
          "color": 0xfb69a3,
          "width": 16,
          "height": 16
        }
      },
      {
        "Entity": "EnemyController",
        "Properties": {
          "debug": true
        }
      },
      {
        "Entity": "RigidBody",
        "Properties" :{
          "terminalVelocity": 10
        }
      },
      {
        "Entity": "NNID",
        "Properties" :{
          "ID": "Alpha"
        }
      },
      {
        "Entity": "BoxCollider",
        "Properties": {
          "width": 16,
          "height": 16
        }
      }
    ]
  },
  {
    "Entity": "Gameobject",
    "Class": ['Enemy'],
    "Scripts": [
      {
        "Entity": "RectRenderer",
        "Properties": {
          "color": 0x69a3fb,
          "width": 16,
          "height": 16
        }
      },
      {
        "Entity": "EnemyController",
        "Properties": {
          "debug": true
        }
      },
      {
        "Entity": "RigidBody",
        "Properties" :{
          "terminalVelocity": 10
        }
      },
      {
        "Entity": "NNID",
        "Properties" :{
          "ID": "Beta"
        }
      },
      {
        "Entity": "BoxCollider",
        "Properties": {
          "width": 16,
          "height": 16
        }
      }
    ]
  },
  {
    "Entity": "Gameobject",
    "Class": ['Enemy'],
    "Scripts": [
      {
        "Entity": "RectRenderer",
        "Properties": {
          "color": 0xc169fb,
          "width": 16,
          "height": 16
        }
      },
      {
        "Entity": "EnemyController",
        "Properties": {
          "debug": true
        }
      },
      {
        "Entity": "RigidBody",
        "Properties" :{
          "terminalVelocity": 10
        }
      },
      {
        "Entity": "NNID",
        "Properties" :{
          "ID": "Omega"
        }
      },
      {
        "Entity": "BoxCollider",
        "Properties": {
          "width": 16,
          "height": 16
        }
      }
    ]
  }
]);
registerScene('ParentingTest', [
  {
    "Entity": "GameObject",
    "x": 100,
    "y": 100,
    "ID": "",
    "Class": [],
    "Scripts": [
      {
        "Entity": "RectRenderer",
        "Properties": {
          "color": 0xFFFFFF,
          "width": 10,
          "height": 10
        }
      }
    ],
    "Children": [
      {
        "Entity": "GameObject",
        "x": 150,
        "y": 100,
        "ID": "",
        "Class": [],
        "Scripts": [
          {
            "Entity": "RectRenderer",
            "Properties": {
              "color": 0xFFFFFF,
              "width": 10,
              "height": 10
            }
          }
        ],
        "Children": [
          {
            "Entity": "GameObject",
            "x": 200,
            "y": 100,
            "ID": "",
            "Class": [],
            "Scripts": [
              {
                "Entity": "RectRenderer",
                "Properties": {
                  "color": 0xFFFFFF,
                  "width": 10,
                  "height": 10
                }
              }
            ]
          }
        ]
      }
    ]
  }
]);

defineRenderLayers({
  "Default": 1,
  "Background": 0,
  "Entities": 2
});


var network = new BiologicalNeuralNetwork(14, 5);

SceneManager.loadScene('neuralNetwork');
