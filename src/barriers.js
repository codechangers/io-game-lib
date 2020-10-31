/* -- CodeChangers io-game-lib 2020 --
 * This file contains the source code for creating characters in an io-game. */

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
  return { validMove, fallbackPos };
}

const server = { useBarrier, checkBarriers };

module.exports = { server };
