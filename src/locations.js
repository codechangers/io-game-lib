/* -- CodeChangers io-game-lib 2020 --
 * This file contains the source for the locations feature. */

/* =========================
 * ==== Client Methods: ====
 * ========================= */

// Initialize the locations client feature.
function addLocations(type) {
  this.game[type] = {};
}

// Subscribe to locations created on the server.
function getLocations(
  type, // string: The type of locations.
  onAdd = function () {}, // function: This will get run when a location is added.
  onRemove = function () {}, // function: This will get run when a location is removed.
  onUpdate = function () {} // function: This will get run when a location is updated.
) {
  const { game } = this;
  const self = this;
  if (game.roomJoined) {
    game.room.listen(`${type}/:id`, function (change) {
      if (change.operation == 'add') {
        const { id, x, y, width, height, color } = change.value;
        const graphics = self.createSquare(width, height, x, y, color);
        game[type][id] = {
          graphics,
          ...change.value,
        };
        onAdd(game[type][id], change.value);
      } else if (change.operation == 'remove') {
        const { id } = change.path;
        game[type][id].graphics.destroy();
        delete game[type][id];
        onRemove(id);
      }
    });
    game.room.listen(`${type}/:id/:attribute`, function (change) {
      if (change.operation == 'replace') {
        const { id, attribute } = change.path;
        const location = game[type][id];
        if (
          attribute == 'x' ||
          attribute == 'y' ||
          attribute == 'width' ||
          attribute == 'height' ||
          attribute == 'color'
        ) {
          loction[attribute] = change.value;
          self.updateSquare(
            location.width,
            location.height,
            location.x,
            location.y,
            location.color,
            location.graphics
          );
        } else {
          location[attribute] = change.value;
        }
        onUpdate(id, attribute, change.value);
      }
    });
  } else {
    this.addConnectEvent('getLocations', [type, onAdd, onRemove, onUpdate]);
  }
}

const client = { addLocations, getLocations };

/* =========================
 * ==== Server Methods: ====
 * ========================= */

// Initialize the locations server feature.
function setupLocations(type) {
  this.game.state[type] = {};
}

// Create a location with a defined size which follows a custom set of rules.
function createALocation(type, id, dims, color, rules) {
  this.game.state[type][id] = {
    ...dims,
    color,
    rules,
  };
}

// Apply the rules of all locations to the game.
function handleLocations(locationType, characterType) {
  const self = this;
  Object.values(this.game.state[locationType]).forEach((data) => {
    const { width, height, x, y } = data;
    self.handleCollision(
      characterType,
      { ...data, x: x + width / 2, y: y + height / 2 },
      function (character, location) {
        location.rules(character);
      }
    );
  });
}

// Get an incremental Id for a location.
function nextLocationId(
  type // string: The type of locations.
) {
  return `${type}${Object.keys(this.game.state[type]).length + 1}`;
}

const server = {
  setupLocations,
  createALocation,
  handleLocations,
  nextLocationId,
};

module.exports = { client, server };
