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
  }

  start() {
    this.transform.position.x = Math.random() * global.viewport.width;
    this.transform.position.y = Math.random() * global.viewport.height / 3;
    this.player = Gameobject.findObjectByID("Player");
    this.rb = this.getComponent("RigidBody");
  }

  update() {
    var vec = this.transform.position.subtract(this.player.transform.position).reverse().scale(1.0/600);
    this.rb.applyForce(vec);
  }
});
registerScript(class EnemySpawner extends Script {
  constructor() {
    super();
    this.spawner = null;
  }

  start() {
    this.spawner = setInterval(this.spawnEnemy, 1000);
  }

  spawnEnemy() {
    SceneManager.loadPrefab("Enemy");
  }
});

registerPrefab('Enemy', {
  "Entity": "Gameobject",
  "Scripts": [
    {
      "Entity": "RectRenderer",
      "Properties": {
        "color": 0xFF7711,
        "width": 16,
        "height": 16
      }
    },
    {
      "Entity": "EnemyController"
    },
    {
      "Entity": "RigidBody"
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
  { // the player
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



Array.prototype.transform = function(transform) {
  this.forEach(function(v, i, a) {
    v = transform(v, i, a);
  });
}

var poop = [1, 2, 3, 4, 5];
poop.transform((v) => v + 5);
