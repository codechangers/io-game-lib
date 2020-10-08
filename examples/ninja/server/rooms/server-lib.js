module.exports = class ServerLib {
  constructor() {
    this.game = null;
  }

  // Bind the Game and setup initial state.
  setup(
    game // game.js/Game: Your Game!
  ) {
    this.game = game;
  }

  // Setup a set of Characters.
  setupCharacters(
    type // string: The type of characters.
  ) {
    this.game.setState({ [type]: {} });
  }

  // Create a Character instance.
  createCharacter(
    type, // string: The type of characters.
    client, // object: The colyseus client connection.
    data // object: The characters data.
  ) {
    this.game.state[type][client.sessionId] = {
      ...data,
      id: client.sessionId,
    };
  }

  // Get a Character instance.
  getCharacter(
    type, // string: The type of characters.
    client // object: The colyseus client connection.
  ) {
    return this.game.state[type][client.sessionId];
  }

  // Delete a Character instance.
  deleteCharacter(
    type, // string: The type of characters.
    client // object: The colyseus client connection.
  ) {
    delete this.game.state[type][client.sessionId];
  }

  // Handle incoming Action messages.
  handleActions(
    actions, // object: Your action functions.
    data // object: The data from the message.
  ) {
    for (let a in actions) {
      if (data.action === a) {
        actions[a]();
      }
    }
  }
};
