/* -- CodeChangers io-game-lib 2020 --
 * This file contains the source code for creating animations in an io-game. */

/* =========================
 * ==== Server Methods: ====
 * ========================= */

/**
 * Set an animation to be played on a character/resource.
 * @tags server, animations, play
 * @param {object} obj - The character/resource instance.
 * @param {string} attribute - The attribute that will be animated.
 * @param {number} value - The value the attribute should be changed by.
 * @param {number} duration - (milliseconds) how long the animation should run.
 * @returns {void}
 */
function playAnimation(obj, attribute, value, duration) {
  if (!obj.animations[attribute]) {
    obj.animations = {
      ...obj.animations,
      [attribute]: {
        startTime: Date.now(),
        attribute,
        dValue: value,
        duration,
      },
    };
  }
}

// Play animations that have been setup for a character/resource.
function handleAnimations(
  type // string: The type of characters/resources.
) {
  const { game } = this;
  Object.values(game.state[type]).forEach((obj) => {
    for (let attr in obj.animations) {
      const animation = obj.animations[attr];
      if (animation) {
        if (!animation.currentValue) animation.currentValue = 0;
        const { startTime, duration, dValue, attribute } = animation;
        const currentTime = Date.now();
        const dt = currentTime - startTime;
        const completed = dt / duration;
        obj[attribute] += dValue * completed - animation.currentValue;
        animation.currentValue = dValue * completed;
        if (currentTime >= startTime + duration) {
          delete obj.animations[attribute];
        }
      }
    }
  });
}

const server = { playAnimation, handleAnimations };

module.exports = { server };
