/* -- CodeChangers io-game-lib 2020 --
 * This file contains the source code for creating items in an io-game. */

/* =========================
 * ==== Client Methods: ====
 * ========================= */

// Setup the Item Bar UI.
function useItemBar(
  itemAmount = 0 // number: The number of items slots on the item bar.
) {
  let itemBar = document.getElementById('item-bar');
  itemBar.style.display = 'flex';
  itemBar.style.opacity = '50%';
  for (let i = 0; i < itemAmount; i++) {
    let item = document.createElement('div');
    if (i === 0) item.className = 'item selected';
    else item.className = 'item';
    itemBar.appendChild(item);
    let uses = document.createElement('div');
    uses.className = 'used';
    item.appendChild(uses);
  }
}

// Temporarily hide the Item Bar UI.
function hideItemBar() {
  document.getElementById('item-bar').style.display = 'none';
}

// Temporarily show the Item Bar UI.
function showItemBar() {
  let itemBar = document.getElementById('item-bar');
  itemBar.style.display = 'flex';
  itemBar.style.opacity = '50%';
}

const client = { useItemBar, hideItemBar, showItemBar };

/* =========================
 * ==== Server Methods: ====
 * ========================= */

// Create an Item that will be available in your game.
function createNewItem(
  type, // string: The type of item to create.
  image, // string: The relative path to the image of this item.
  cb // function: The code that runs when an item is used.
) {
  this.game.state[type] = {};
  this.game.shapes[type] = 'circle';
  this.items[type] = { name: type, useItem: cb, image };
  this.setupCharacters(type, { rotation: 0 });
}

// Give a character access to an item in the game.
function addItemToCharacter(
  character, // object: The character that will have access to the item.
  type, // string: The type of item to add.
  uses // int: amount of times you can use this.
) {
  if (this.items[type]) {
    character.items[type] = {
      ...this.items[type],
      index: Object.keys(character.items).length,
      uses,
    };
  }
}

// Use an item's in game ability.
function useItem(
  character, // object: The character that will have access to the item.
  data // object: any data that they want to pass to their useItem function
) {
  const item = Object.values(character.items).find(
    (itm) => itm.index === character.selectedItem
  );
  if (item.uses > 0 || item.uses === undefined) {
    const self = this;
    if (item.uses !== undefined) item.uses -= 1;
    let actions = {
      swingItem: (degrees, duration) => {
        if (degrees === undefined) degrees = 30;
        if (duration === undefined) duration = 50;
        item.swinging = true;
        self.playAnimation(
          character,
          'rotation',
          (degrees * Math.PI) / 180,
          duration
        );
        setTimeout(function () {
          self.playAnimation(
            character,
            'rotation',
            -(degrees * Math.PI) / 180,
            duration
          );
          setTimeout(() => (item.swinging = false), duration * 2 + 2);
        }, duration + 1);
      },

      throwItem: (x, y, range, speed) => {
        if (speed === undefined) speed = 1;
        if (range === undefined) range = 1000;
        let position = self.getItemPosition(character);
        let id = self.nextCharacterId(item.name);
        if (!this.counts[item.name]) self.setupCharacters(item.name);
        self.createACharacter(item.name, id, { x: position.x, y: position.y });
        let newCharacter = self.getACharacter(item.name, id);
        let dx =
          Math.cos(Math.atan((y - newCharacter.y) / (x - newCharacter.x))) *
          range;
        let dy =
          Math.sin(Math.atan((y - newCharacter.y) / (x - newCharacter.x))) *
          range;
        if (x - newCharacter.x < 0) {
          dx = -dx;
          dy = -dy;
        }
        let duration = 1000 / (speed / 10);
        self.playAnimation(newCharacter, 'x', dx, duration);
        self.playAnimation(newCharacter, 'y', dy, duration);
        // self.playAnimation(newCharacter, 'rotation', Math.PI / 3 * 100, duration);
        setTimeout(function () {
          self.deleteACharacter(item.name, id);
        }, duration + 1);
      },

      placeItem: (x, y) => {
        let id = self.nextCharacterId(item.name);
        if (x !== undefined && y !== undefined) {
          self.createACharacter(item.name, id, { x, y, scale: item.scale });
        } else {
          let position = self.getItemPosition(character);
          self.createACharacter(item.name, id, {
            x: position.x,
            y: position.y,
            rotation: character.rotation,
            scale: item.scale,
          });
        }
      },
    };

    if (item) item.useItem(character, data, actions);
  }
}

// Get the position of an item relative to the game.
function getItemPosition(
  character // string: name of the character
) {
  let item = Object.values(character.items).find(
    (itm) => itm.index === character.selectedItem
  );
  let theta = character.rotation;
  const { x, y } = item;
  let newX = x * Math.cos(theta) - y * Math.sin(theta);
  let newY = x * Math.sin(theta) + y * Math.cos(theta);
  return {
    x: character.x + newX,
    y: character.y + newY,
  };
}

// Switch to an item on a characters hotbar.
function switchItem(
  character, // object: The character that will have access to the item.
  position // number: The index of the item on the hotbar.
) {
  if (position !== undefined) character.selectedItem = position;
  else character.selectedItem += 1;
  if (character.selectedItem >= Object.keys(character.items).length) {
    character.selectedItem = 0;
  }
}

// Get a character's currently selected item.
function getSelectedItem(
  character // object: The character thaat you get the item from
) {
  return Object.values(character.items).find(
    (item) => item.index === character.selectedItem
  );
}

// Get a created in-game item instance.
function getItem(
  type // string: Name of the item that you are accessing
) {
  return this.items[type];
}

// Remove a character's access to an item.
function removeItemFromCharacter(
  character, // object: The character that will have access to the item.
  type // string: The type of item to add.
) {
  if (typeof type === 'string') {
    delete character.items[type];
  } else {
    newType = Object.keys(character.items).find(
      (item) => character.items[item].index === type
    );
    delete character.items[newType];
  }
  for (item in character.items) {
    if (character.items[item].index > type) {
      character.items[item].index -= 1;
    }
  }
}

const server = {
  createNewItem,
  addItemToCharacter,
  useItem,
  switchItem,
  removeItemFromCharacter,
  getSelectedItem,
  getItem,
  getItemPosition,
};

module.exports = { client, server };
