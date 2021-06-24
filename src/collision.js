/* -- CodeChangers io-game-lib 2020 --
 * This file contains the source code for detecting collisions in an io-game. */

/**
 * A basic class for handling rectangular shape collisions.
 * @class CollisionBox
 * @param {number} x - The x position of the box.
 * @param {number} y - The y position of the box.
 * @param {number} width - The width of the box.
 * @param {number} height - The height of the box.
 */
class CollisionBox {
  constructor(x, y, width, height) {
    this.width = !Number.isNaN(width) ? width : 0;
    this.height = !Number.isNaN(height) ? height : 0;
    this.x = !Number.isNaN(x) && x >= 0 ? x - this.width / 2 : -100;
    this.y = !Number.isNaN(y) && y >= 0 ? y - this.height / 2 : -100;
  }

  collide(other) {
    let distance = -1;
    let collided = false;
    if (other instanceof CollisionBox) {
      collided =
        this.x < other.x + other.width &&
        this.x + this.width > other.x &&
        this.y < other.y + other.height &&
        this.y + this.height > other.y;
    } else if (other instanceof CollisionCircle) {
      const check = other.collide(this);
      collided = check.collided;
      distance = check.distance;
    } else {
      console.log(
        ' * CollisionBox.collide: You can only collide with another collision object!'
      );
    }
    return { collided, distance };
  }
}

/**
 * A basic class for handling circular shape collisions.
 * @class CollisionCircle
 * @param {number} x - The x position of the circle.
 * @param {number} y - The y position of the circle.
 * @param {number} diameter - The diameter of the circle.
 */
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
    let distance = -1;
    let collided = false;
    if (other instanceof CollisionCircle) {
      distance = this.distanceTo(other);
      collided = distance < this.radius + other.radius;
    } else if (other instanceof CollisionBox) {
      distance = this.distanceTo(other);
      const { leftDist, rightDist, topDist, bottomDist, centerDist } = distance;
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
    return { collided, distance };
  }
}

/* =========================
 * ==== Server Methods: ====
 * ========================= */

/**
 * Check for collision between two types of objects in your game.
 * @tags server, collisions, handle
 * @param {(string|object)} typeA - The first type of object OR a single object instance.
 * @param {(string|object)} typeB - The second type of object OR a single object instance.
 * @param {function} callback - What to do if there is a collision.
 * @returns {void}
 */
function handleCollision(typeA, typeB, callback) {
  const { state, shapes } = this.game;
  const shapeA = typeof typeA === 'string' ? shapes[typeA] : shapes[typeA.type];
  const shapeB = typeof typeB === 'string' ? shapes[typeB] : shapes[typeB.type];
  function getCol(data, shape) {
    const { x, y, width, height } = data;
    const col =
      shape === 'circle'
        ? new CollisionCircle(x, y, width)
        : new CollisionBox(x, y, width, height);
    return col;
  }
  Object.entries(
    typeof typeA === 'string' ? state[typeA] : { [typeA.id]: typeA }
  ).forEach(function ([idA, dataA]) {
    const colA = getCol(dataA, shapeA);
    Object.entries(
      typeof typeB === 'string' ? state[typeB] : { [typeB.id]: typeB }
    ).forEach(function ([idB, dataB]) {
      if (idA !== idB) {
        const colB = getCol(dataB, shapeB);
        const check = colA.collide(colB);
        if (check.collided) {
          callback(dataA, dataB, check.distance);
        }
      }
    });
  });
}

/**
 * Check for a collision between a character held item and another character/resource.
 * @tags server, collision, handle, item
 * @param {string} characterType - The type of the character who is holding the item.
 * @param {string} itemName - The name of the item being held.
 * @param {string} objectType - The type of character/resource to check collisions against.
 * @param {function} callback - What to do if there is a collision.
 * @returns {void}
 */
function handleItemCollision(characterType, itemName, objectType, callback) {
  const self = this;
  const { game } = this;
  Object.values(game.state[characterType]).forEach((character) => {
    const item = self.getSelectedItem(character);
    if (item.name === itemName) {
      const itemSize = game.sizes[item.name];
      if (itemSize && item.swinging) {
        const { width, height } = itemSize;
        const { x, y } = self.getItemPosition(character);
        self.handleCollision({ width, height, x, y }, objectType, callback);
      }
    }
  });
}

const server = { handleCollision, handleItemCollision };

module.exports = { server };
