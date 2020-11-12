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
  for (var i = 0; i < itemAmount; i++) {
    let item = document.createElement('div');
    if (i == 0) item.className = 'item selected';
    else item.className = 'item';
    itemBar.appendChild(item);
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
  this.items[type] = { name: type, useItem: cb, image};
}

// Give a character access to an item in the game.
function addItemToCharacter(
  character, // object: The character that will have access to the item.
  type // string: The type of item to add.
) {
  if (this.items[type])
    character.items[type] = {
      ...this.items[type],
      index: Object.keys(character.items).length,
    };
}

// Use an item's in game ability.
function useItem(
  character, // object: The character that will have access to the item.
  data // object: any data that they want to pass to their useItem function
) {
  const item = Object.values(character.items).find(
    (item) => item.index === character.selectedItem
  );
  const self = this;
  let swingItem = (degrees, duration) => {
    if (degrees === undefined) degrees = 30;
    if (duration === undefined) duration = 50;
    self.playAnimation(character, 'rotation', (degrees * Math.PI) / 180, duration);
    setTimeout(function() {
      self.playAnimation(character, 'rotation', -(degrees * Math.PI) / 180, duration);
    }, duration + 1)
  }

  let throwItem = () => {

  }

  if (item) item.useItem(character, data, swingItem);
}

function getItemPosition(
  character, // string: name of the character
) {
  let item = Object.values(character.items).find(
    (item) => item.index === character.selectedItem
  );
  return {x:character.x + Math.cos(character.rotation) * item.x, y:character.y + Math.sin(character.rotation) * item.y};
}

// Switch to an item on a characters hotbar.
function switchItem(
  character, // object: The character that will have access to the item.
  position
) {
  if (position !== undefined) character.selectedItem = position;
  else character.selectedItem += 1;
  if (character.selectedItem >= Object.keys(character.items).length) {
    character.selectedItem = 0;
  }
}

function getSelectedItem(
  character, // object: The character thaat you get the item from
) {
  return Object.values(character.items).find(
    (item) => item.index === character.selectedItem
  );
}

function getItem(
  type, // string: Name of the item that you are accessing
) {
  return this.items[type];
}

// Remove a character's access to an item.
function removeItemFromCharacter(
  character, // object: The character that will have access to the item.
  type // string: The type of item to add.
) {
  let index;
  if (typeof type === 'string') {
    index = character.items[type].index;
    delete character.items[type];
  } else {
    index = type;
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
  getItemPosition
};

module.exports = { client, server };
