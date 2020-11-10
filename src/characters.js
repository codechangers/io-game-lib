/* -- CodeChangers io-game-lib 2020 --
 * This file contains the source code for creating characters in an io-game. */

/* =========================
 * ==== Client Methods: ====
 * ========================= */

// Create a new set of Characters.
function addCharacters(
  type, // string: The type of characters.
  scale = 1 // number: The scale of the sprite, ie. 0.5 for half size.
) {
  this.game[type] = {};
  this.game.scales[type] = scale;
  this.sendSpriteSize(type, scale);
}

// Listen to Characters on the server.
function getCharacters(
  type, // string: The type of characters.
  onAdd = function () {}, // function: This will get run when a character is added.
  onRemove = function () {}, // function: This will get run when a character is removed.
  onUpdate = function () {} // function: This will get run when a character is updated.
) {
  const { game } = this;
  if (game.roomJoined) {
    game.room.listen(`${type}/:id`, function (change) {
      if (change.operation == 'add') {
        const { id, x, y } = change.value;
        let sprite = game.add.container(x, y);
        let character = game.front_layer.create(0, 0, type);
        sprite.add([character]);
        sprite.setScale(game.scales[type] || 1);
        game[type][id] = {
          sprite,
          ...change.value,
          attached: {},
        };
        onAdd(game[type][id], change.value);
      } else if (change.operation == 'remove') {
        const { id } = change.path;
        game[type][id].sprite.destroy();
        for (item in game[type][id].attached) {
          game[type][id].attached[item].sprite.destroy();
        }
        delete game[type][id];
        onRemove(id);
      }
    });
    game.room.listen(`${type}/:id/:attribute`, function (change) {
      if (change.operation == 'add' && change.value.type) {
        let x = game[type][change.value.id].sprite.x;
        let y = game[type][change.value.id].sprite.y;
        if (change.value.type == 'text') {
          let text = game.add
            .text(
              x + change.value.x,
              y + change.value.y,
              ` ${change.value.text} `,
              { color: 'white', backgroundColor: 'rgba(0,0,0,0.7)' }
            )
            .setScale(change.value.scale);
          game[type][change.value.id].attached[change.value.name] = {
            ...change.value,
            sprite: text,
          };
        }
        if (change.value.type == 'item') {
          let item = game.front_layer
            .create(change.value.x, change.value.y, change.value.image)
            .setScale(change.value.scale);
          game[type][change.value.id].sprite.add(item);
          game[type][change.value.id].attached[change.value.name] = {
            ...change.value,
            sprite: item,
          };
        }
        if (change.value.type == 'bar') {
          var rect = new Phaser.Geom.Rectangle(
            0,
            0,
            change.value.width,
            change.value.height
          );
          var graphics = game.add.graphics({
            fillStyle: { color: `0x999999` },
          });
          rect = graphics.fillRectShape(rect);
          game[type][change.value.id].attached[
            `${change.value.name}Background`
          ] = { ...change.value, sprite: rect };
          var newRect = new Phaser.Geom.Rectangle(
            0,
            0,
            change.value.width,
            change.value.height
          );
          var graphics = game.add.graphics({
            fillStyle: { color: `0x999900` },
          });
          newRect = graphics.fillRectShape(newRect);
          rect.x = x + change.value.x;
          newRect.x = x + change.value.x;
          rect.y = y + change.value.y;
          newRect.y = y + change.value.y;
          newRect.setScale(100 / change.value, 1);
          game[type][change.value.id].attached[change.value.name] = {
            ...change.value,
            sprite: newRect,
          };
        }
      }
      if (change.operation == 'remove') {
        game[type][change.path.id].attached[
          change.path.attribute
        ].sprite.destroy();
        if (
          game[type][change.path.id].attached[change.path.attribute].type ==
          'bar'
        ) {
          game[type][change.path.id].attached[
            `${change.path.attribute}Background`
          ].sprite.destroy();
        }
        delete game[type][change.path.id].attached[change.path.attribute];
      }
      if (change.operation == 'replace') {
        const { id, attribute } = change.path;
        if (attribute == 'x' || attribute == 'y') {
          for (let item in game[type][id].attached) {
            if (game[type][id].attached[item].type !== 'item')
              game[type][id].attached[item].sprite[attribute] =
                change.value + game[type][id].attached[item][attribute];
          }
          game[type][id].sprite[attribute] = change.value;
        } else if (attribute == 'angle') {
          game[type][id].sprite[attribute] = change.value;
        } else if (attribute == 'angle') {
          game[type][id].sprite[attribute] = change.value;
        } else {
          game[type][id][attribute] = change.value;
        }
        onUpdate(id, attribute, change.value);
      }
    });
    game.room.listen(`${type}/:id/:attribute/:id`, function (change) {
      console.log(change);
      if (change.path.id === 'filled') {
        console.log(
          game[type][change.rawPath[1]].attached[change.rawPath[2]].sprite
        );
        game[type][change.rawPath[1]].attached[
          change.rawPath[2]
        ].sprite.setScale(change.value / 100, 1);
      }
      if (change.path.id === 'text') {
        game[type][change.rawPath[1]].attached[
          change.rawPath[2]
        ].sprite.setText(change.value);
      }
    });
  } else {
    this.addConnectEvent('getCharacters', [type, onAdd, onRemove, onUpdate]);
  }
}

const client = { addCharacters, getCharacters };

/* =========================
 * ==== Server Methods: ====
 * ========================= */

// Setup a set of Characters.
function setupCharacters(
  type, // string: The type of characters.
  shape = 'box' // string: box or circle | The shape of the character image.
) {
  this.game.state[type] = {};
  this.game.shapes[type] = shape;
}

// Create a Character instance.
function createACharacter(
  type, // string: The type of characters.
  id, // string: A unique character id.
  data // object: The characters data.
) {
  this.game.state[type][id] = {
    ...this.getSize(type),
    ...data,
    id,
    type,
  };
}

// Get a Character instance.
function getACharacter(
  type, // string: The type of characters.
  id // string: A unique character id.
) {
  return this.game.state[type][id];
}

// Delete a Character instance.
function deleteACharacter(
  type, // string: The type of characters.
  id // string: A unique character id.
) {
  delete this.game.state[type][id];
}

// Get an incremental Id for a character.
function nextCharacterId(
  type // string: The type of characters.
) {
  return `${type}${Object.keys(this.game.state[type]).length + 1}`;
}

// Attach something to the character or other things.
function attachTo(
  type, // string: The type of character/resource
  id, // string: A unique character id that you want to attach it to
  data /* object: {
    name | string: name of the thing you want to attach
    x | int: x position relative to character
    y | int: y position relative to character
    scale | int : number between 0 and 1 to represent size
    type | string : either 'item', 'bar', or 'text'
    image | string : name of image if it is an ITEM 
    text | string : text if it is a TEXT
    filled | int : amount of bar filled if it is a BAR
  }
  */
) {
  this.game.state[type][id][data.name] = { ...data, id };
}

function unAttach(
  player, // string: A unique character id that you want to attach it to
  name // string: name of the item you want to unattach
) {
  delete player[name];
}

function follow(type1, type2, range = 0, speed = 1) {
  if (Object.keys(this.game.state[type2]).length >= 1) {
    Object.keys(this.game.state[type2]).forEach((otherId) => {
      if (Object.keys(this.game.state[type1]).length >= 1) {
        let x = this.game.state[type2][otherId].x;
        let y = this.game.state[type2][otherId].y;
        let closestPlayer = null;
        let closestDistance = 0;
        Object.keys(this.game.state[type1]).forEach((playerId) => {
          if (closestPlayer == null) {
            closestPlayer = playerId;
            closestDistance = Math.sqrt(
              (x - this.game.state[type1][playerId].x) ** 2 +
                (y - this.game.state[type1][playerId].y) ** 2
            );
          } else {
            let distanceX = x - this.game.state[type1][playerId].x;
            let distanceY = y - this.game.state[type1][playerId].y;
            let distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);
            if (distance <= closestDistance) {
              closestPlayer = playerId;
              closestDistance = distance;
            }
          }
        });
        if (closestDistance < range || closestDistance == 0) {
          return;
        } else {
          let distanceX = x - this.game.state[type1][closestPlayer].x;
          let distanceY = y - this.game.state[type1][closestPlayer].y;
          let dx;
          let dy;
          let degrees = 0;
          if (distanceX >= 0) {
            dx = Math.cos(Math.atan(distanceY / distanceX));
            dy = Math.sin(Math.atan(distanceY / distanceX));
            degrees = Math.atan(distanceY / distanceX) * (180 / Math.PI) - 90;
          } else {
            dx = -Math.cos(Math.atan(distanceY / distanceX));
            dy = -Math.sin(Math.atan(distanceY / distanceX));
            degrees = -Math.atan(distanceY / -distanceX) * (180 / Math.PI) + 90;
          }
          this.game.state[type2][otherId].x -= dx * speed;
          this.game.state[type2][otherId].y -= dy * speed;
        }
      }
    });
  }
}

const server = {
  setupCharacters,
  createACharacter,
  getACharacter,
  deleteACharacter,
  nextCharacterId,
  attachTo,
  unAttach,
  follow,
};

module.exports = { client, server };
