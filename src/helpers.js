/* -- CodeChangers io-game-lib 2020 --
 * This file contains helpful reusable functions */

const characters = require('./characters');
const connection = require('./connection');
const draw = require('./draw');
const game = require('./game');
const resources = require('./resources');

const clientMethods = {
  ...characters.client,
  ...connection.client,
  ...draw.client,
  ...game.client,
  ...resources.client,
};

const serverMethods = {
  ...characters.server,
  ...connection.server,
  ...draw.server,
  ...game.server,
  ...resources.server,
};

function linkMethods(lib, methods) {
  for (let name in methods) {
    lib[name] = methods[name].bind(lib);
  }
}

module.exports = { clientMethods, serverMethods, linkMethods };
