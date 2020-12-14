/* -- CodeChangers io-game-lib 2020 --
 * This file contains helpful reusable functions */

const version = '1.0.2';

const characters = require('./characters');
const connection = require('./connection');
const items = require('./items');
const draw = require('./draw');
const game = require('./game');
const resources = require('./resources');
const ui = require('./ui');
const collision = require('./collision');
const barriers = require('./barriers');
const locations = require('./locations');
const animations = require('./animations');

const clientMethods = {
  ...characters.client,
  ...connection.client,
  ...draw.client,
  ...game.client,
  ...resources.client,
  ...ui.client,
  ...locations.client,
  ...items.client,
};

const serverMethods = {
  ...characters.server,
  ...connection.server,
  ...draw.server,
  ...game.server,
  ...resources.server,
  ...collision.server,
  ...barriers.server,
  ...locations.server,
  ...items.server,
  ...animations.server,
};

function linkMethods(lib, methods) {
  for (let name in methods) {
    lib[name] = methods[name].bind(lib);
  }
}

module.exports = { clientMethods, serverMethods, linkMethods, version };
