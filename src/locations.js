/* -- CodeChangers io-game-lib 2020 --
 * This file contains the source for the locations feature. */

/* =========================
 * ==== Client Methods: ====
 * ========================= */

// Initialize the locations client feature.
function addLocations(
  type, // string: The type of locations.
  scale = 1 // number: The scale of the sprite, ie. 0.5 for half size.
) {
  this.game[type] = {};
  this.game.scales[type] = scale;
  this.sendSpriteSize(type, scale);
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
        if (game.textures.exists(type)) {
          const sprite = game.add.sprite(x, y, type);
          sprite.setScale(game.scales[type] || 1);
          game[type][id] = {
            sprite,
            ...change.value,
          };
        } else {
          const graphics = self.createSquare(width, height, x, y, color);
          game[type][id] = {
            graphics,
            ...change.value,
          };
        }
        onAdd(game[type][id], change.value);
      } else if (change.operation == 'remove') {
        const { id } = change.path;
        const { graphics, sprite } = game[type][id];
        if (graphics) graphics.destroy();
        if (sprite) sprite.destroy();
        delete game[type][id];
        onRemove(id);
      }
    });
    game.room.listen(`${type}/:id/:attribute`, function (change) {
      if (change.operation == 'replace') {
        const { id, attribute } = change.path;
        const location = game[type][id];
        if (
          location.graphics &&
          (attribute == 'x' ||
            attribute == 'y' ||
            attribute == 'width' ||
            attribute == 'height' ||
            attribute == 'color')
        ) {
          location[attribute] = change.value;
          self.updateSquare(
            location.width,
            location.height,
            location.x,
            location.y,
            location.color,
            location.graphics
          );
        } else if (location.sprite && (attribute == 'x' || attribute == 'y')) {
          location.sprite[attribute] = change.value;
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
function setupLocations(
  type // string: The type of locations.
) {
  this.game.state[type] = {};
}

// Create a location with a defined size which follows a custom set of rules.
function createALocation(
  type, // string: The type of locations.
  id, // string: A unique location id.
  dims, // object: Dimension values x, y, width, and height.
  color, // string: The color of the location.
  rules // function: What happens when someone is in this location.
) {
  this.game.state[type][id] = {
    ...dims,
    color,
    rules,
  };
}

// Apply the rules of all locations to the game.
function handleLocations(
  locationType, // string: The type of location.
  characterType // string: The type of character.
) {
  const self = this;
  Object.values(this.game.state[locationType]).forEach((data) => {
    const { width, height, x, y } = data;
    if (this.game.sizes[locationType]) {
      // Handle Sprites
      self.handleCollision(characterType, data, function (character, location) {
        location.rules(character);
      });
    } else {
      // Handle Squares
      self.handleCollision(
        characterType,
        { ...data, x: x + width / 2, y: y + height / 2 },
        function (character, location) {
          location.rules(character);
        }
      );
    }
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
