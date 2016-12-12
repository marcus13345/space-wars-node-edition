/* jshint esversion: 6 */



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
    this.interval(this.randomizeRPos, (Math.random() * 1000) + 500);
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
          color = colors[Math.floor(Math.random() * colors.length)];
        }else if(colormethod == 1) {
          var shifts = [0, 8, 16];
          color = ((renderer.color >> -shifts[Math.floor(Math.random() * 3)]) & 0xFF0000) |
                  ((renderer.color >> (shifts[Math.floor(Math.random() * 3)] - 8)) & 0x00FF00) |
                  ((renderer.color >> shifts[Math.floor(Math.random() * 3)]) & 0x0000FF);
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
    this.rx = this.player.transform.position.x + Math.diomgis(Math.random()) * 60;
    this.ry = this.player.transform.position.y + Math.diomgis(Math.random()) * 60;
    this.handicap = Math.random() * (9/10) + .1;
    // console.log(this);
  }

  randomizePosition() {
    this.transform.position.x = Math.random() * global.viewport.width;
    this.transform.position.y = Math.random() * global.viewport.height / 3;
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

registerPrefab('Enemy', {
  "Entity": "Gameobject",
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

SceneManager.loadScene('level1');
