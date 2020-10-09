const Room = require('colyseus').Room;
const ServerLib = require('../../../../src/server');
const g = new ServerLib();

module.exports = class MyRoom extends Room {
  onInit() {
    g.setup(this);
    g.setupCharacters('players');
    g.setupResources('trees');
    g.setupBoard(500, 500, '909090');
    g.createAResource('trees', 50, 50);
  }

  onJoin(client) {
    g.createACharacter('players', client, { x: 200, y: 200 });
  }

  onMessage(client, data) {
    const player = g.getACharacter('players', client);
    const speed = 5;
    const actions = {
      moveUp: () => (player.y -= speed),
      moveDown: () => (player.y += speed),
      moveLeft: () => (player.x -= speed),
      moveRight: () => (player.x += speed),
      click: () => g.createAResource('trees', data.x, data.y),
    };
    g.handleActions(actions, data);
  }

  onLeave(client) {
    g.deleteACharacter('players', client);
  }
};
