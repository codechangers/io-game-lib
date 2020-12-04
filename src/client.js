/* -- CodeChangers io-game-lib 2020 --
 * This file contains the io game client library class definition. */

const Colyseus = require('colyseus.js');
const { clientMethods, linkMethods, version } = require('./helpers');

/* eslint-disable */
const gameConfig = require('../config.json');
const endpoint =
  window.location.hostname === 'localhost'
    ? `ws://localhost:${gameConfig.serverDevPort}` // development (local)
    : `${window.location.protocol.replace('http', 'ws')}//${
        window.location.hostname
      }`; // production (remote)
/* eslint-enable */

// This is the Library of Client side functionallity.
module.exports = class ClientLib {
  constructor() {
    this.version = version;
    this.game = null;
    this.keys = null;
    this.connectEvents = {};
    this.colyseus = new Colyseus.Client(endpoint);
  }

  // Show the current library version.
  showVersion() {
    const versionStr = `┃  IO Game Library v${this.version}    ┃`;
    let siteLink = '┃  https://codecontest.org';
    siteLink += ' '.repeat(versionStr.length - siteLink.length - 1);
    siteLink += '┃';
    const flat = '━'.repeat(versionStr.length - 2);
    const top = `┏${flat}┓`;
    const bottom = `┗${flat}┛`;
    console.log(`\n${top}\n${versionStr}\n${siteLink}\n${bottom}\n `); // eslint-disable-line
  }

  // Bind the Game and setup initial state.
  setup(
    game // game.js/Game: Your Game!
  ) {
    this.showVersion();
    this.game = game;
    game.room = null;
    game.roomJoined = false;
    game.cursors = null;
    game.width = 0;
    game.height = 0;
    game.scales = {};
    game.front_layer = game.add.group();
    // ADDS AN EVENT TO ALLOW FOR CLICKING
    document.addEventListener('click', function (e) {
      if (
        !e.path.includes(document.getElementById('input-overlay')) &&
        game.click
      ) {
        const moveX = e.clientX - window.innerWidth / 2;
        const moveY = e.clientY - window.innerHeight / 2;
        game.click(
          game.cameras.main.scrollX + window.innerWidth / 2 + moveX,
          game.cameras.main.scrollY + window.innerHeight / 2 + moveY
        );
      }
    });
    // ADDS AN EVENT TO ALLOW FOR MOUSEMOVE
    document.addEventListener('mousemove', function (e) {
      if (game.mousemove) {
        const moveX = e.clientX - window.innerWidth / 2;
        const moveY = e.clientY - window.innerHeight / 2;
        game.mousemove(
          game.cameras.main.scrollX + window.innerWidth / 2 + moveX,
          game.cameras.main.scrollY + window.innerHeight / 2 + moveY
        );
      }
    });
    linkMethods(this, clientMethods);
  }
};
