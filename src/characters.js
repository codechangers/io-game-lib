/* -- CodeChangers io-game-lib 2020 --
 * This file contains the source code for creating characters in an io-game. */

/* =========================
 * ==== Client Methods: ====
 * ========================= */

// Create a new set of Characters.
function addCharacters(
  type // string: The type of characters.
) {
  this.game[type] = {};
}

// Listen to Characters on the server.
function getCharacters(
  type, // string: The type of characters.
  onAdd = function () {}, // function: This will get run when a character is added.
  onRemove = function () {}, // function: This will get run when a character is removed.
  onUpdate = function () {} // function: This will get run when a character is updated.
) {
  const { game } = this;
  game.room.listen(`${type}/:id`, function (change) {
    if (change.operation == 'add') {
      const { id, x, y } = change.value;
      game[type][id] = {
        sprite: game.add.sprite(x, y, type),
        id,
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
      }
      onUpdate(id, attribute, change.value);
    }
  });
}

const client = { addCharacters, getCharacters };

/* =========================
 * ==== Server Methods: ====
 * ========================= */

// Setup a set of Characters.
function setupCharacters(
  type // string: The type of characters.
) {
  this.game.state[type] = {};
}

// Create a Character instance.
function createACharacter(
  type, // string: The type of characters.
  client, // object: The colyseus client connection.
  data // object: The characters data.
) {
  this.game.state[type][client.sessionId] = {
    ...data,
    id: client.sessionId,
  };
}

// Get a Character instance.
function getACharacter(
  type, // string: The type of characters.
  client // object: The colyseus client connection.
) {
  return this.game.state[type][client.sessionId];
}

// Delete a Character instance.
function deleteACharacter(
  type, // string: The type of characters.
  client // object: The colyseus client connection.
) {
  delete this.game.state[type][client.sessionId];
}

const server = {
  setupCharacters,
  createACharacter,
  getACharacter,
  deleteACharacter,
};

module.exports = { client, server };
