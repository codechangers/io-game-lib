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
  typeA, // string/object: The first type of object OR a single object instance.
  typeB, // string/object: The second type of object OR a single object instance.
  callback // function: What to do if there is a collision.
) {
  const { state, shapes } = this.game;
  const shapeA = typeof typeA === 'string' ? shapes[typeA] : shapes[typeA.type];
  const shapeB = typeof typeB === 'string' ? shapes[typeB] : shapes[typeB.type];
  Object.entries(
    typeof typeA === 'string' ? state[typeA] : { [typeA.id]: typeA }
  ).forEach(function ([idA, dataA]) {
    const { x, y, width, height } = dataA;
    const colA =
      shapeA === 'circle'
        ? new CollisionCircle(x, y, width)
        : new CollisionBox(x, y, width, height);
    Object.entries(
      typeof typeB === 'string' ? state[typeB] : { [typeB.id]: typeB }
    ).forEach(function ([idB, dataB]) {
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

// Move an in game object within the bounds of the game.
function move(
  object, // object: The game object you want to move.
  axis, // string: x or y axis of movement.
  distance // number: How far to move along the given axis.
) {
  const { gameWidth, gameHeight, barriers, shapes } = this.game;
  let validMove = true;
  let fallbackPos = -1;
  // Check Game Boundries
  if (gameWidth && gameHeight) {
    const gDim = axis === 'x' ? gameWidth : gameHeight;
    const oDim = axis === 'x' ? object.width : object.height;
    const offSet = axis === 'x' ? object.width / 2 : object.height / 2;
    if (object[axis] - offSet + distance < 0) {
      // Left/Top of Boundries
      validMove = false;
      fallbackPos = offSet;
    } else if (object[axis] - offSet + distance + oDim > gDim) {
      // Right/Bottom of Boundries
      validMove = false;
      fallbackPos = gDim - oDim + offSet;
    }
  }
  // Check Barriers
  if (Object.keys(barriers).includes(object.type)) {
    barriers[object.type].forEach((bType) => {
      this.handleCollision(
        { ...object, [axis]: object[axis] + distance },
        bType,
        (object, barrier) => {
          validMove = false;
          // TODO: Circle on Box and Box on Circle
          if (shapes[bType] === 'circle') {
            // Circle on Circle
            const factor = object[axis] > barrier[axis] ? 1 : -1;
            const otherAxis = axis === 'x' ? 'y' : 'x';
            fallbackPos =
              Math.sqrt(
                Math.pow(object.width / 2 + barrier.width / 2 + 0.000001, 2) -
                  Math.pow(object[otherAxis] - barrier[otherAxis], 2)
              ) *
                factor +
              barrier[axis]; // Inverse of distance formula where d = r1 + r2
          } else {
            // Box on Box
            const a =
              axis === 'x'
                ? [barrier.x - barrier.width / 2, barrier.x + barrier.width / 2]
                : [
                    barrier.y - barrier.height / 2,
                    barrier.y + barrier.height / 2,
                  ];
            const l = axis === 'x' ? object.width : object.height;
            fallbackPos = distance < 0 ? a[1] + l / 2 : a[0] - l / 2;
          }
        }
      );
    });
  }
  // Handle Collisions
  if (validMove) {
    object[axis] += distance;
  } else {
    object[axis] = fallbackPos;
  }
}

// Make a type of object unable to pass through another type of object.
function useBarrier(
  type, // string: The type of object which should not pass through barriers.
  barrierType // string: The type of object which should become a barrier.
) {
  const { barriers } = this.game;
  if (Object.keys(barriers).includes(type)) {
    barriers[type].push(barrierType);
  } else {
    barriers[type] = [barrierType];
  }
}

const server = {
  handleCollision,
  move,
  useBarrier,
};

module.exports = { server };
