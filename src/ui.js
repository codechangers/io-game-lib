/* -- CodeChangers io-game-lib 2020 --
 * This file contains the source code to create some helpful user interfaces. */

/* ==========================
 * ==== Ignored Methods: ====
 * ========================== */

// PLEASE IGNORE ME IN THE DOCS
function _showInputOverlay(yes) {
  const io = document.getElementById('input-overlay');
  if (yes && io.classList.contains('hide')) {
    io.classList.remove('hide');
  } else if (!yes && !io.classList.contains('hide')) {
    io.classList.add('hide');
  }
}

// PLEASE IGNORE ME IN THE DOCS
function _exampleOnStart(name) {
  console.log(name + ' is joining...');
}

// PLEASE IGNORE ME IN THE DOCS
const _render = (lines) => lines.join('\n');

// PLEASE IGNORE ME IN THE DOCS
function _renderLives({ lives }) {
  const spans = [];
  for (let i = 0; i < lives; i++) {
    spans.push('<span class="life"></span>');
  }
  return _render(spans);
}

/* =========================
 * ==== Client Methods: ====
 * ========================= */

// Show an interactive login screen when a player first joins.
function useLoginScreen(
  onStart = _exampleOnStart, // function: What to do when they click the button.
  title = 'IO Game', // string: What the header should say.
  input = 'Display Name', // string: What the input should say.
  button = 'START' // string: What the button should say.
) {
  const loginForm = document.querySelector('#input-overlay > form.login');
  loginForm.innerHTML = _render([
    `<h1>${title}</h1>`,
    `<input id="displayName" type="text" placeholder="${input}" />`,
    `<button type="submit">${button}</button>`,
  ]);
  _showInputOverlay(true);
  loginForm.classList.remove('hide');
  loginForm.onsubmit = function (e) {
    e.preventDefault();
    const name = document.getElementById('displayName').value || 'player';
    loginForm.classList.add('hide');
    _showInputOverlay(false);
    onStart(name);
  };
}

// Show the lives, names, and scores of a specific type of character on the leaderboard.
function handleLeaderboard(
  type, // string: The type of characters.
  title = 'Leaderboard' // string: What the header should say.
) {
  const { game } = this;
  document.querySelector('#game-overlay > .leaderboard').innerHTML = _render([
    `<h3>${title}</h3>`,
    ...Object.entries(game[type]).map(
      ([id, data]) => `<div class="player" id="${id}">
      ${
        typeof data.lives === 'number'
          ? _render(['<div class="lives">', _renderLives(data), '</div>'])
          : ''
      }
        <div class="text">
          ${
            typeof data.name === 'string'
              ? _render([
                  '<p class="name"' +
                    (this.myId() === id ? ' style="color: #8BE1FF;"' : '') +
                    '>',
                  data.name,
                  '</p>',
                ])
              : ''
          }
          ${
            typeof data.score === 'number'
              ? _render([
                  '<p class="score"' +
                    (this.myId() === id ? ' style="color: #8BE1FF;"' : '') +
                    '>',
                  data.score,
                  '</p>',
                ])
              : ''
          }
        </div>
      </div>`
    ),
  ]);
}

class StoreItem {
  constructor(image, name, costAttr, cost, action) {
    this.image = image;
    this.name = name;
    this.costAttr = costAttr;
    this.cost = cost;
    this.action = action;
  }
}

// Show a store interface for selling items.
function useStore(
  title = 'Store', // string: What the header should say.
  items // Array[StoreItem]: What items are for sale?
) {
  document.querySelector('#input-overlay > .store').innerHTML = _render([
    `<h1>${title}</h1>`,
    ...items.map(
      (item) => `<div class="store-item">
    <img src="${item.image}" />
    <h2>${item.name}</h2>
    <p>Cost: ${item.cost} x ${item.costAttr}</p>
    <button id="buy-${item.name}">Buy</button>
    </div>`
    ),
  ]);
  const self = this;
  items.forEach((item) => {
    document.getElementById(`buy-${item.name}`).onclick = function () {
      self.sendAction(item.action);
    };
  });
}

function toggleStore() {
  const storeDiv = document.querySelector('#input-overlay > .store');
  if (
    !storeDiv.classList.contains('locked') &&
    storeDiv.classList.contains('hide')
  ) {
    _showInputOverlay(true);
    storeDiv.classList.remove('hide');
    storeDiv.classList.add('locked');
  } else if (!storeDiv.classList.contains('locked')) {
    _showInputOverlay(false);
    storeDiv.classList.add('hide');
    storeDiv.classList.add('locked');
  }
}
function unlockStore() {
  const storeDiv = document.querySelector('#input-overlay > .store');
  if (storeDiv.classList.contains('locked')) {
    storeDiv.classList.remove('locked');
  }
}

const client = {
  StoreItem,
  useLoginScreen,
  handleLeaderboard,
  useStore,
  toggleStore,
  unlockStore,
};

module.exports = { client };
