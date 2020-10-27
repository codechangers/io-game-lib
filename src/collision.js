/* -- CodeChangers io-game-lib 2020 --
 * This file contains the source code for creating characters in an io-game. */

// A basic class for handling rectangular shape collisions.
class CollisionBox {
  constructor(x, y, width, height) {
    this.width = !Number.isNaN(width) ? width : 0;
    this.height = !Number.isNaN(height) ? height : 0;
    this.x = !Number.isNaN(x) && x >= 0 ? x - this.width / 2 : -100;
    this.y = !Number.isNaN(y) && y >= 0 ? y - this.height / 2 : -100;
  }

  collide(other) {
    let collided = false;
    if (other instanceof CollisionBox) {
      collided =
        this.x < other.x + other.width &&
        this.x + this.width > other.x &&
        this.y < other.y + other.height &&
        this.y + this.height > other.y;
    } else if (other instanceof CollisionCircle) {
      collided = other.collide(this);
    } else {
      console.log(
        ' * CollisionBox.collide: You can only collide with another collision object!'
      );
    }
    return collided;
  }
}

// A basic class for handling circular shape collisions.
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
    } else if (other instanceof CollisionBox) {
      const leftDist =
        Math.abs(
          other.height * this.x +
            other.x * other.y -
            other.x * (other.y + other.height)
        ) / Math.sqrt(other.height ** 2);
      const rightDist =
        Math.abs(
          other.height * this.x +
            (other.x + other.width) * other.y -
            (other.x + other.width) * (other.y + other.height)
        ) / Math.sqrt(other.height ** 2);
      const topDist =
        Math.abs(
          -other.width * this.y +
            (other.x + other.width) * other.y -
            other.x * other.y
        ) / Math.sqrt(other.width ** 2);
      const bottomDist =
        Math.abs(
          -other.width * this.y +
            (other.x + other.width) * (other.y + other.height) -
            other.x * (other.y + other.height)
        ) / Math.sqrt(other.width ** 2);
      const dx = this.x - (other.x + other.width / 2);
      const dy = this.y - (other.y + other.height / 2);
      const centerDist = Math.sqrt(dx * dx + dy * dy);
      distance = { leftDist, rightDist, topDist, bottomDist, centerDist };
    } else {
      console.log(
        ' * CollisionCircle.distanceTo: You can only check with another collision object!'
      );
    }
    return distance;
  }

  collide(other) {
    let collided = false;
    if (other instanceof CollisionCircle) {
      collided = this.distanceTo(other) < this.radius + other.radius;
    } else if (other instanceof CollisionBox) {
      const {
        leftDist,
        rightDist,
        topDist,
        bottomDist,
        centerDist,
      } = this.distanceTo(other);
      const xCol =
        leftDist < this.radius ||
        rightDist < this.radius ||
        (this.x > other.x && this.x < other.x + other.width);
      const yCol =
        topDist < this.radius ||
        bottomDist < this.radius ||
        (this.y > other.y && this.y < other.y + other.height);
      const otherRad = Math.sqrt(
        (other.width / 2) ** 2 + (other.height / 2) ** 2
      );
      collided = xCol && yCol && centerDist < this.radius + otherRad;
    } else {
      console.log(
        ' * CollisionCircle.collide: You can only collide with another collision object!'
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
  const { state } = this.game;
  Object.entries(state[typeA]).forEach(function ([idA, dataA]) {
    const { x, y, width, height } = dataA;
    const colA =
      shapeA === 'circle'
        ? new CollisionCircle(x, y, width)
        : new CollisionBox(x, y, width, height);
    Object.entries(state[typeB]).forEach(function ([idB, dataB]) {
      if (idA !== idB) {
        const { x, y, width, height } = dataB;
        const colB =
          shapeB === 'circle'
            ? new CollisionCircle(x, y, width)
            : new CollisionBox(x, y, width, height);
        if (colA.collide(colB)) {
          callback(dataA, dataB);
        }
      }
    });
  });
}

// Check for collisions between two types of circular objects in your game.
function handleCirclesCollision(
  typeA, // string: The first type of object.
  typeB, // string: The second type of object.
  callback // function: What to do if there is a collision.
) {
  return this.handleCollision([typeA, 'circle'], [typeB, 'circle'], callback);
}

// Check for collisions between two types of box objects in your game.
function handleBoxesCollision(
  typeA, // string: The first type of object.
  typeB, // string: The second type of object.
  callback // function: What to do if there is a collision.
) {
  return this.handleCollision([typeA, 'box'], [typeB, 'box'], callback);
}

// Check for collisions between a type of circular objects and a type of box objects in your game.
function handleCircleOnBoxCollision(
  typeA, // string: The first type of object.
  typeB, // string: The second type of object.
  callback // function: What to do if there is a collision.
) {
  return this.handleCollision([typeA, 'circle'], [typeB, 'box'], callback);
}

// Check for collisions between a type of box objects and a type of circular objects in your game.
function handleBoxOnCircleCollision(
  typeA, // string: The first type of object.
  typeB, // string: The second type of object.
  callback // function: What to do if there is a collision.
) {
  return this.handleCollision([typeA, 'box'], [typeB, 'circle'], callback);
}

const server = {
  handleCollision,
  handleBoxesCollision,
  handleBoxOnCircleCollision,
  handleCircleOnBoxCollision,
  handleCirclesCollision,
};

module.exports = { server };
