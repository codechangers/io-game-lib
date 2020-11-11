/* -- CodeChangers io-game-lib 2020 --
 * This file contains the source code for creating resources in an io-game. */

/* =========================
 * ==== Client Methods: ====
 * ========================= */

// Create a new set of Resources.
function addResources(
  type // string: The type of resources.
) {
  this.game[type] = {};
}

// Listen to Resources on the server.
function getResources(
  type, // string: The type of resources.
  onAdd = function () {}, // function: This will get run when a resource is added.
  onRemove = function () {}, // function: This will get run when a resource is removed.
  onUpdate = function () {} // function: This will get run when a resource is updated.
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
      game[type][id].sprite[attribute] = change.value;
      onUpdate(id, attribute, change.value);
    }
  });
}

const client = { addResources, getResources };

/* =========================
 * ==== Server Methods: ====
 * ========================= */

// Setup a set of Resources.
function setupResources(
  type // string: The type of resources.
) {
  this.game.state[type] = {};
  this.counts[type] = 0;
}

// Creates many resources raondomly on their board.
function createResources(
  type, // string: The type of resources.
  amount // int: The amount of resources you want to create randomly on the board.
) {
  for (var i = 0; i < amount; i++) {
    let newX = Math.random() * this.boardWidth;
    let newY = Math.random() * this.boardHeight;
    this.createAResource(type, newX, newY);
  }
}

// Creates one resource in a specified location on the board.
function createAResource(
  type, // string: The type of resource
  x, // int: The x position of their resource on their board.
  y // int: The y position of their resource on their board.
) {
  this.counts[type] += 1;
  this.game.state[type][this.counts[type]] = {
    id: this.counts[type],
    x,
    y,
    type: 'resource',
    height: 103,
    width: 61,
  };
}

// Delete a Resource instance.
function deleteAResource(
  type, // string: The type of resource.
  id // int: The id of the resource.
) {
  delete this.game.state[type][id];
}

const server = {
  setupResources,
  createResources,
  createAResource,
  deleteAResource,
};

module.exports = { client, server };
