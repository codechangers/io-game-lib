const Room = require('colyseus').Room;
const ServerLib = require('../../../../server-lib');
const g = new ServerLib();

module.exports = class MyRoom extends Room {
  onInit() {
    g.setup(this);
    g.setupCharacters('players');
    g.setupResources('trees');
    g.setupBoard(500, 500, '909090');
    g.createResource('trees', 50, 50);
  }

  onJoin(client) {
    g.createCharacter('players', client, { x: 200, y: 200 });
  }

  onMessage(client, data) {
    const player = g.getCharacter('players', client);
    const speed = 5;
    const actions = {
      moveUp: () => (player.y -= speed),
      moveDown: () => (player.y += speed),
      moveLeft: () => (player.x -= speed),
      moveRight: () => (player.x += speed),
      click: () => g.createResource('trees', data.x, data.y),
    };
    g.handleActions(actions, data);
  }

  onLeave(client) {
    g.deleteCharacter('players', client);
  }
};
