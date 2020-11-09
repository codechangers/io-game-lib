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
        const sprite = game.add.sprite(x, y, type);
        sprite.setScale(game.scales[type] || 1);
        game[type][id] = {
          sprite,
          ...change.value,
        };
        onAdd(game[type][id], change.value);
      } else if (change.operation == 'remove') {
        const { id } = change.path;
        game[type][id].sprite.destroy();
        delete game[type][id];
        onRemove(id);
      }
    });
    game.room.listen(`${type}/:id/:attribute`, function (change) {
      if (change.operation == 'replace') {
        const { id, attribute } = change.path;
        if (attribute == 'x' || attribute == 'y') {
          game[type][id].sprite[attribute] = change.value;
        } else {
          game[type][id][attribute] = change.value;
        }
        onUpdate(id, attribute, change.value);
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

const server = {
  setupCharacters,
  createACharacter,
  getACharacter,
  deleteACharacter,
  nextCharacterId,
};

module.exports = { client, server };
