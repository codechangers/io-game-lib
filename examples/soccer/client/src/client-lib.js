const Colyseus = require('colyseus.js');
const gameConfig = require('./../../config.json');
const endpoint =
  window.location.hostname === 'localhost'
    ? `ws://localhost:${gameConfig.serverDevPort}` // development (local)
    : `${window.location.protocol.replace('http', 'ws')}//${
        window.location.hostname
      }`; // production (remote)
const colyseus = new Colyseus.Client(endpoint);

module.exports = class ClientLib {
    constructor() {
        this.game = null;
        this.keys = null;
    }

    // Bind the Game and setup initial state.
    setup(
        game,   // game.js/Game: Your Game!
    ) {
        this.game = game;
        game.room = null;
        game.roomJoined = false;
        game.cursors = null;
    }

    // Load an Image into the Game.
    loadImage(
        name,   // string: The name of the image.
        path,   // string: Path to the file inside the asset folder.
    ) {
        return this.game.load.image(name, `asset/${path}`);
    }

    // Connect to the Server.
    connect() {
        const { game } = this;
        game.room = colyseus.join('main', {});
        game.room.onJoin.add(() => {
          game.roomJoined = true;
        });
    }

    // Create a new set of Characters.
    addCharacters(
        type,   // string: The type of characters.
    ) {
        this.game[type] = {};
    }

    // Listen to Characters on the server.
    getCharacters(
        type,       // string: The type of characters.
        onAdd       // function: This will get run when a character is added.
            = function() {},
        onRemove    // function: This will get run when a character is removed.
            = function() {},
        onUpdate    // function: This will get run when a character is updated.
            = function() {}
    ) {
        const { game } = this;
        game.room.listen(`${type}/:id`, function (change) {
            if (change.operation == 'add') {
                const { id, x, y } = change.value;
                game[type][id] = {
                    sprite: game.add.sprite(x, y, type),
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
                if (attribute == 'x' || attribute == 'y') {
                    game[type][id].sprite[attribute] = change.value;
                }
                onUpdate(id, attribute, change.value);
            }
        });
    }

    // Listen for keyboard input!
    setupKeys(
        keys,   // object: A bunch of Phaser keycodes!
    ) {
        this.keys = this.game.input.keyboard.addKeys(keys);
    }

    // Get Current Key Inputs.
    getKeysDown() {
        const keysDown = {};
        for (let key in this.keys) {
            keysDown[key] = this.keys[key].isDown;
        }
        return keysDown;
    }

    // Tell you if messages are ready!
    canSend() {
        return this.game.roomJoined;
    }

    // Send an Action Command to the Server.
    sendAction(
        action  // string: The action!
    ) {
        this.game.room.send({ action });
    }
}