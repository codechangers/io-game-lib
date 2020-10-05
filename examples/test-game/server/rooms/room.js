const Room = require('colyseus').Room;
const ServerLib = require('./server-lib');
const server = new ServerLib();

module.exports = class MyRoom extends Room {

    onInit () {
        this.setState({
            players: {}
        })
    }

    onJoin (client, options) {
        var self = this;
        this.state.players[client.sessionId] = {
            x: 200,
            y: 200,
            id: client.sessionId
        };
    }

    onMessage (client, data) {
        let player = this.state.players[client.sessionId];
        var speed = 5;
        switch (data.action) {
            case 'moveUp':
                player.y -= speed;
                break;
            case 'moveDown':
                player.y += speed;
                break;
            case 'moveLeft':
                player.x -= speed;
                break;
            case 'moveRight':
                player.x += speed;
                break;
            default:
                break;
        }
    }

    onLeave (client) {
        delete this.state.players[ client.sessionId ];
    }

}