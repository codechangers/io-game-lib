const Room = require('colyseus').Room;
const ServerLib = require('./server-lib');
const g = new ServerLib();

module.exports = class MyRoom extends Room {
  onInit() {
    g.setup(this);
    g.setupCharacters('players');
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
    };
    g.handleActions(actions, data);
  }

  onLeave(client) {
    g.deleteACharacter('players', client);
  }
};
