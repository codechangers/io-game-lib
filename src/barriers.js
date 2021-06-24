/* -- CodeChangers io-game-lib 2020 --
 * This file contains the source code for creating barriers in an io-game. */

/* ==========================
 * ==== Ignored Methods: ====
 * ========================== */

// PLEASE IGNORE ME IN THE DOCS
function _boxRebound(object, barrier, axis, distance) {
  const a =
    axis === 'x'
      ? [barrier.x - barrier.width / 2, barrier.x + barrier.width / 2]
      : [barrier.y - barrier.height / 2, barrier.y + barrier.height / 2];
  const l = axis === 'x' ? object.width : object.height;
  return distance < 0 ? a[1] + l / 2 : a[0] - l / 2;
}

// PLEASE IGNORE ME IN THE DOCS
function _circleRebound(object, barrier, axis) {
  const factor = object[axis] > barrier[axis] ? 1 : -1;
  const otherAxis = axis === 'x' ? 'y' : 'x';
  return (
    Math.sqrt(
      Math.pow(object.width / 2 + barrier.width / 2 + 0.000002, 2) -
        Math.pow(object[otherAxis] - barrier[otherAxis], 2)
    ) *
      factor +
    barrier[axis]
  ); // Inverse of distance formula where d = r1 + r2
}

// PLEASE IGNORE ME IN THE DOCS
function _cornerRebound(circle, box, axis, colDist) {
  const r = circle.width / 2;
  let cols = [];
  for (let key in colDist) {
    if (colDist[key] < r) cols.push(key);
  }
  const reverse = {
    left: false,
    top: false,
    right: true,
    bottom: true,
  };
  function check(xDir, yDir) {
    const x = box.x + (box.width / 2) * (reverse[xDir] ? 1 : -1);
    const Ys = reverse[yDir] ? [y, circle.y] : [circle.y, y];
    if (
      cols.includes(`${xDir}Dist`) &&
      cols.includes(`${yDir}Dist`) &&
      Xs[0] < Xs[1] &&
      Ys[0] < Ys[1]
    ) {
      newPos = _circleRebound(circle, { x, y, width: 0 }, axis);
      const POSs = reverse[axis === 'x' ? xDir : yDir]
        ? [circle[axis], newPos]
        : [newPos, circle[axis]];
      return POSs[0] < POSs[1] ? newPos : circle[axis];
    }
  }
  return (
    check('left', 'top') ||
    check('left', 'bottom') ||
    check('right', 'top') ||
    check('right', 'bottom') ||
    -1
  );
}

/* =========================
 * ==== Server Methods: ====
 * ========================= */

/**
 * Make a type of object unable to pass through another type of object.
 * @tags server, barriers, use
 * @param {string} type - The type of object which should not pass through barriers.
 * @param {string} barrierType - The type of object which should become a barrier.
 * @returns {void}
 */
function useBarrier(type, barrierType) {
  const { barriers } = this.game;
  if (Object.keys(barriers).includes(type)) {
    barriers[type].push(barrierType);
  } else {
    barriers[type] = [barrierType];
  }
}

/**
 * Check if a move runs into a barrier.
 * @tags server, barriers, check
 * @param {object} object - The game object you want to move.
 * @param {string} axis - x or y axis of movement.
 * @param {number} distance - How far to move along the given axis.
 * @returns {object} Was the move valid and where to go if it wasn't.
 */
function checkBarriers(object, axis, distance) {
  const { barriers, shapes } = this.game;
  let validMove = true;
  let fallbackPos = -1;
  if (Object.keys(barriers).includes(object.type)) {
    barriers[object.type].forEach((bType) => {
      this.handleCollision(
        { ...object, [axis]: object[axis] + distance },
        bType,
        (obj, barrier, colDist) => {
          validMove = false;
          if (shapes[bType] === 'circle' && shapes[obj.type] === 'circle') {
            // Circle on Circle
            fallbackPos = _circleRebound(obj, barrier, axis);
          } else if (shapes[bType] === 'circle') {
            // Box on Circle
            const cornerPos = _cornerRebound(barrier, obj, axis, colDist);
            // TODO: Handle Blip
            fallbackPos =
              cornerPos !== -1
                ? obj[axis] + barrier[axis] - cornerPos
                : _boxRebound(obj, barrier, axis, distance);
          } else if (shapes[obj.type] === 'circle') {
            // Circle on Box
            const cornerPos = _cornerRebound(obj, barrier, axis, colDist);
            fallbackPos =
              cornerPos !== -1
                ? cornerPos
                : _boxRebound(obj, barrier, axis, distance);
          } else {
            // Box on Box
            fallbackPos = _boxRebound(obj, barrier, axis, distance);
          }
        }
      );
    });
  }
  return { validMove, fallbackPos };
}

const server = { useBarrier, checkBarriers };

module.exports = { server };
