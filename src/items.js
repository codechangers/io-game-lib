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
  this.items[type] = { name: type, useItem: cb, image };
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
  character // object: The character that will have access to the item.
) {
  character.items
    .find((item) => item.name === character.selectedItem)
    .useItem(character);
}

// Switch to an item on a characters hotbar.
function switchItem(
  character, // object: The character that will have access to the item.
  position
) {
  if (position) character.selectedItem = position;
  else character.selectedItem += 1;
  if (character.selectedItem >= character.items.length) {
    console.log('There is no item here!');
    character.selectedItem = 0;
  }
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
};

module.exports = { client, server };
