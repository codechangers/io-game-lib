/* -- CodeChangers io-game-lib 2020 --
 * This file contains the source code for creating characters in an io-game. */

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
function _cornerRebound(object, barrier, axis, colDist) {
  const r = object.width / 2;
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
    const x = barrier.x + (barrier.width / 2) * (reverse[xDir] ? 1 : -1);
    const y = barrier.y + (barrier.height / 2) * (reverse[yDir] ? 1 : -1);
    const Xs = reverse[xDir] ? [x, object.x] : [object.x, x];
    const Ys = reverse[yDir] ? [y, object.y] : [object.y, y];
    if (
      cols.includes(`${xDir}Dist`) &&
      cols.includes(`${yDir}Dist`) &&
      Xs[0] < Xs[1] &&
      Ys[0] < Ys[1]
    ) {
      newPos = _circleRebound(object, { x, y, width: 0 }, axis);
      const POSs = reverse[axis === 'x' ? xDir : yDir]
        ? [object[axis], newPos]
        : [newPos, object[axis]];
      return POSs[0] < POSs[1] ? newPos : object[axis];
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

// Check if a move runs into a barrier.
function checkBarriers(
  object, // object: The game object you want to move.
  axis, // string: x or y axis of movement.
  distance // number: How far to move along the given axis.
) {
  const { barriers, shapes } = this.game;
  let validMove = true;
  let fallbackPos = -1;
  if (Object.keys(barriers).includes(object.type)) {
    barriers[object.type].forEach((bType) => {
      this.handleCollision(
        { ...object, [axis]: object[axis] + distance },
        bType,
        (object, barrier, colDist) => {
          validMove = false;
          if (shapes[bType] === 'circle') {
            // Circle on Circle
            fallbackPos = _circleRebound(object, barrier, axis);
          } else if (shapes[object.type] === 'circle') {
            // Circle on Box
            const cornerPos = _cornerRebound(object, barrier, axis, colDist);
            fallbackPos =
              cornerPos !== -1
                ? cornerPos
                : _boxRebound(object, barrier, axis, distance);
          } else {
            // Box on Box
            fallbackPos = _boxRebound(object, barrier, axis, distance);
          }
        }
      );
    });
  }
  return { validMove, fallbackPos };
}

const server = { useBarrier, checkBarriers };

module.exports = { server };
