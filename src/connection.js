/* -- CodeChangers io-game-lib 2020 --
 * This file contains the source code for client server connection. */

const Colyseus = require('colyseus.js');

/* =========================
 * ==== Client Methods: ====
 * ========================= */

// Connect to the Server.
function connect() {
  const { game, endpoint } = this;
  const colyseus = new Colyseus.Client(endpoint);
  let self = this;
  game.room = colyseus.join('main', {});
  game.room.onJoin.add(() => {
    game.roomJoined = true;
  });
  game.room.listen('board/:id', function (change) {
    if (change.operation == 'add') {
      self.setSize(500, 500);
      self.createSquare(
        0,
        0,
        change.value.width,
        change.value.height,
        change.value.color
      );
    }
  });
}

// Tell you if messages are ready!
function canSend() {
  return this.game.roomJoined;
}

// Send an Action Command to the Server.
function sendAction(
  action, // string: The action!
  data // object: Things you need to send to the backend
) {
  if (data) {
    this.game.room.send({ [action]: true, ...data });
  } else {
    this.game.room.send({ [action]: true });
  }
}

const client = { connect, canSend, sendAction };

/* =========================
 * ==== Server Methods: ====
 * ========================= */

// Handle incoming Action messages.
function handleActions(
  actions, // object: Your action functions.
  data // object: The data from the message.
) {
  for (let a in actions) {
    if (data[a]) {
      actions[a]();
    }
  }
}

const server = { handleActions };

module.exports = { client, server };
