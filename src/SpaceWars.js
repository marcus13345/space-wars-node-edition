/* jshint esversion: 6 */

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
    "Entity": "Enemy", //regular gameobject, nothing amazing. where you would place a prefab name.
    "Name": "Enemy",
    "x": 100,
    "y": 100
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
