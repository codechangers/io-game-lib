module.exports = class ClientLib {
    getImports() {
        const Phaser = require('phaser');
        const Colyseus = require('colyseus.js');
        const clone = require('clone');

        const gameConfig = require('./../../config.json');

        const endpoint = (window.location.hostname === "localhost")
            ? `ws://localhost:${gameConfig.serverDevPort}` // development (local)
            : `${window.location.protocol.replace("http", "ws")}//${window.location.hostname}` // production (remote)
        return { Phaser, Colyseus, clone, endpoint };
    }
}