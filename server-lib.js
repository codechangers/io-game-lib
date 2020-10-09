let counts = {};
let boardWidth = 500;
let boardHeight = 500;

module.exports = class ServerLib {
  constructor() {
    this.game = null;
  }

  // Bind the Game and setup initial state.
  setup(
    game // game.js/Game: Your Game!
  ) {
    this.game = game;
    this.game.setState({ board: {} });
  }

  // Creates their board for them with boundaries
  setupBoard(
    width, // int: The width of their board.
    height, // int: The height of their board.
    color // string: Hex value of the color of their board.
  ) {
    boardWidth = width;
    boardHeight = height;
    this.game.state.board.board = { width, height, color };
  }

  // Setup a set of Characters.
  setupCharacters(
    type // string: The type of characters.
  ) {
    this.game.state[type] = {};
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

  // Setup a set of Resources.
  setupResources(
    type // string: The type of resources.
  ) {
    this.game.state[type] = {};
    counts[type] = 0;
  }

  // Creates many resources raondomly on their board.
  createResources(
    type, // string: the type of resources.
    amount // int: the amount of resources you want to create randomly on the board.
  ) {
    for (var i = 0; i < amount; i++) {
      let newX = Math.random() * boardWidth;
      let newY = Math.random() * boardHeight;
      counts[type] += 1;
      this.game.state[type][counts[type]] = {
        id: counts[type],
        x: newX,
        y: newY,
        type: 'resource',
        height: 103,
        width: 61,
      };
    }
  }

  // Creates one resource in a specified location on the board.
  createResource(
    type, // string: the type of resource
    x, // int: the x position of their resource on their board.
    y // int: the y position of their resource on their board.
  ) {
    counts[type] += 1;
    this.game.state[type][counts[type]] = {
      id: counts[type],
      x,
      y,
      type: 'resource',
      height: 103,
      width: 61,
    };
  }

  // Delete a Resource instance.
  deleteResource(
    type, // string: the type of resource.
    id // int: the id of the resource.
  ) {
    delete this.game.state[type][id];
  }

  // Handle incoming Action messages.
  handleActions(
    actions, // object: Your action functions.
    data // object: The data from the message.
  ) {
    for (let a in actions) {
      if (data[a]) {
        actions[a]();
      }
    }
  }
};
