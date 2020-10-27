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

class CollisionCircle {
  constructor(x, y, diameter) {
    this.x = !Number.isNaN(x) && x >= 0 ? x : -100;
    this.y = !Number.isNaN(y) && y >= 0 ? y : -100;
    this.radius = !Number.isNaN(diameter) ? diameter / 2 : 0;
  }

  distanceTo(other) {
    let distance = -1;
    if (other instanceof CollisionCircle) {
      const dx = this.x - other.x;
      const dy = this.y - other.y;
      distance = Math.sqrt(dx * dx + dy * dy);
    } else {
      console.log(
        ' * CollisionCircle.distanceTo: You can only check with another collision circle!'
      );
    }
    return distance;
  }

  collide(other) {
    let collided = false;
    if (other instanceof CollisionCircle) {
      if (this.distanceTo(other) < this.radius + other.radius) {
        collided = true;
      }
    } else {
      console.log(
        ' * CollisionCircle.collide: You can only collide with another collision circle!'
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
  [
    typeA, // string: The first type of object.
    shapeA, // string: 'circle' or 'box' | The shape of the first object.
  ], // array: An array with the typeA and shapeA values.
  [
    typeB, // string: The second type of object.
    shapeB, // string: 'circle' or 'box' | The shape of the second object.
  ], // array: An array with the typeB and shapeB values.
  callback // function: What to do if there is a collision.
) {
  const { game } = this;
  const setA = game.state[typeA];
  const setB = game.state[typeB];
  const shortA = Object.keys(setA).length <= Object.keys(setB).length;
  // Loop through longer set
  Object.entries(shortA ? setB : setA).forEach(function ([idA, dataA]) {
    const { x, y, width, height } = dataA;
    const colA =
      shapeA === 'circle'
        ? new CollisionCircle(x, y, width)
        : new CollisionBox(x, y, width, height);
    // Loop through shorter set
    Object.entries(shortA ? setA : setB).forEach(function ([idB, dataB]) {
      if (idA !== idB) {
        const { x, y, width, height } = dataB;
        const colB =
          shapeB === 'circle'
            ? new CollisionCircle(x, y, width)
            : new CollisionBox(x, y, width, height);
        if (colA.collide(colB)) {
          callback({ [idA]: dataA, [idB]: dataB });
        }
      }
    });
  });
}

const server = { handleCollision };

module.exports = { server };
