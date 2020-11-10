/* -- CodeChangers io-game-lib 2020 --
 * This file contains the source code for creating characters in an io-game. */

/* =========================
 * ==== Client Methods: ====
 * ========================= */

function useItemBar(
  itemAmount = 0,
) {
  let itemBar = document.getElementById('item-bar');
  itemBar.style.display = 'flex';
  itemBar.style.opacity = '50%';
  for (var i = 0; i < itemAmount; i++) {
    let item = document.createElement('div');
    if (i == 0) item.className = "item selected";
    else item.className = "item";
    itemBar.appendChild(item);
  }
}

function hideItemBar()
{
  document.getElementById('item-bar').style.display = 'none';
}

function showItemBar()
{
  let itemBar = document.getElementById('item-bar');
  itemBar.style.display = 'flex';
  itemBar.style.opacity = '50%';
}

const client = { useItemBar, hideItemBar, showItemBar };

/* =========================
 * ==== Server Methods: ====
 * ========================= */

function createNewItem(
  type,
  image,
  cb
) {
  this.items[type] = {name: type, useItem:cb, image};
}

function addItemToCharacter(
  player,
  type
) {
  if (this.items[type]) player.items[type] = {...this.items[type], index: Object.keys(player.items).length};
}

function useItem(
  player
) {
  player.items.find(item => item.name === player.selectedItem).useItem(player);
}

function switchItem(
  player,
  position
) {
  if (position) player.selectedItem = position;
  else player.selectedItem += 1;
  if (player.selectedItem >= player.items.length) {console.log("There is no item here!"); player.selectedItem = 0;};
}

function removeItemFromCharacter(
  player,
  type
) {
  let index;
  if (typeof type === 'string') {
    index = player.items[type].index;
    delete player.items[type];
  } else {
    index = type;
    newType = Object.keys(player.items).find(item => player.items[item].index === type);
    delete player.items[newType];
  }
  for (item in player.items) {
    if (player.items[item].index > type) {
      player.items[item].index -= 1;
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