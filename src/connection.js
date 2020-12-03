/* -- CodeChangers io-game-lib 2020 --
 * This file contains the source code for client server connection. */

/* =========================
 * ==== Client Methods: ====
 * ========================= */

// Connect to the Server.
function connect(
  data = {} // object: What data should we send to the server when a player connects?
) {
  const { game, colyseus, connectEvents } = this;
  let self = this;
  game.room = colyseus.join('main', data);
  // Run functions that need a connection
  game.room.onJoin.add(() => {
    game.roomJoined = true;
    for (let func in connectEvents) {
      for (let run in connectEvents[func]) {
        this[func](...connectEvents[func][run]);
      }
    }
  });
  game.room.listen('board/:id', function (change) {
    if (change.operation === 'add') {
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

// Setup a function call that will happen once the server is connected.
function addConnectEvent(
  funcName, // string: Name of the library function to run.
  params // array: The parameters that should be passed to the function.
) {
  const { connectEvents } = this;
  if (!connectEvents[funcName]) {
    connectEvents[funcName] = [];
  }
  connectEvents[funcName].push(params);
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

// Get your player's id!
function myId() {
  return this.game.room.sessionId;
}

const client = { connect, addConnectEvent, canSend, sendAction, myId };

/* =========================
 * ==== Server Methods: ====
 * ========================= */

// Handle incoming Action messages.
function handleActions(
  actions, // object: Your action functions.
  data // object: The data from the message.
) {
  const allActions = { ...this.defaultActions, ...actions };
  for (let a in allActions) {
    if (data[a]) {
      allActions[a](data);
    }
  }
}

const server = { handleActions };

module.exports = { client, server };
