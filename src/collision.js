/* -- CodeChangers io-game-lib 2020 --
 * This file contains the source code for creating characters in an io-game. */

class CollisionBox {
  constructor(x, y, width, height) {
    this.x = !Number.isNaN(x) && x >= 0 ? x : -100;
    this.y = !Number.isNaN(y) && y >= 0 ? y : -100;
    this.width = !Number.isNaN(width) ? width : 0;
    this.height = !Number.isNaN(height) ? height : 0;
  }

  collide(other) {
    let collided = false;
    if (other instanceof CollisionBox) {
      if (
        this.x < other.x + other.width &&
        this.x + this.width > other.x &&
        this.y < other.y + other.height &&
        this.y + this.height > other.y
      ) {
        collided = true;
      }
    } else {
      console.log(
        ' * CollisionBox.collide: You can only collide with another collision box!'
      );
    }
    return collided;
  }
}

/* =========================
 * ==== Server Methods: ====
 * ========================= */

// Check for collisions between two types of objects in your game.
function handleCollision(
  typeA, // string: The first type of object.
  typeB, // string: The second type of object.
  callback // function: What to do if there is a collision.
) {
  const { game } = this;
  const setA = game.state[typeA];
  const setB = game.state[typeB];
  const shortA = Object.keys(setA).length <= Object.keys(setB).length;
  // Loop through longer set
  Object.entries(shortA ? setB : setA).forEach(function ([idA, dataA]) {
    const { x, y, width, height } = dataA;
    const boxA = new CollisionBox(x, y, width, height);
    // Loop through shorter set
    Object.entries(shortA ? setA : setB).forEach(function ([idB, dataB]) {
      if (idA !== idB) {
        const { x, y, width, height } = dataB;
        const boxB = new CollisionBox(x, y, width, height);
        if (boxA.collide(boxB)) {
          callback({ [idA]: dataA, [idB]: dataB });
        }
      }
    });
  });
}

const server = { handleCollision };

module.exports = { server };
