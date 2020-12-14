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
  console.log(`${name} is joining...`); // eslint-disable-line
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

/* ============================
 * ==== Class Definitions: ====
 * ============================ */

// A data type for items that are for sale in the store.
class StoreItem {
  constructor(
    image, // string: The relative path to an image.
    name, // string: The name of the item.
    costAttr, // string: What customers pay with.
    cost, // string: How much customers pay.
    action // string: The server action for buying the item.
  ) {
    this.image = `asset/${image}`;
    this.name = name;
    this.costAttr = costAttr;
    this.cost = cost;
    this.action = action;
  }
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
    '<div id="characters" class="hide"></div>',
    `<button type="submit">${button}</button>`,
  ]);
  _showInputOverlay(true);
  loginForm.classList.remove('hide');
  loginForm.onsubmit = function (e) {
    e.preventDefault();
    const name = document.getElementById('displayName').value || 'player';
    loginForm.classList.add('hide');
    _showInputOverlay(false);
    let character = document.querySelector('.selectedCharacter');
    if (character) onStart(name, character.name);
    else onStart(name);
  };
}

// Show a how to page that allows them to explain there game
function useHowToScreen(
  title = 'How To', // string: What the header should say.
  theDescriptions, // object: All of the descriptions that they want to explain
  theContributors // object: All of the people that have contributed
) {
  const loginForm = document.querySelector('#input-overlay > form.login');
  let button = document.createElement('div');
  button.id = 'howTo';
  button.innerHTML = '?';
  document.getElementById('exit-button').onclick = function (e) {
    e.preventDefault();
    const howTo = document.querySelector('#input-overlay > div.howTo');
    howTo.classList.add('hide');
  };
  button.onclick = function (e) {
    e.preventDefault();
    const descriptions = document.querySelector(
      '#input-overlay > div.howTo > div.descriptions'
    );
    const contributors = document.querySelector(
      '#input-overlay > div.howTo > div.contributors'
    );
    const howTo = document.querySelector('#input-overlay > div.howTo');
    howTo.classList.remove('hide');
    let allDescriptions = [];
    for (key in theDescriptions) {
      allDescriptions.push(
        `<div class='description'><h3>${key}</h3><p>${theDescriptions[key]}</p></div>`
      );
    }
    let allContributors = [];
    for (key in theContributors) {
      allContributors.push(
        `<div class='description'><h3>${key}</h3><p>${theContributors[key]}</p></div>`
      );
    }
    descriptions.innerHTML = _render([`<h1>${title}</h1>`, ...allDescriptions]);
    contributors.innerHTML = _render([
      '<h1>Contributors</h1>',
      ...allContributors,
    ]);
  };
  loginForm.prepend(button);
}

// Show a player select on the loginScreen that allows them to explain their game
function usePlayerSelectScreen(
  data // object: The names and pictures they can choose from
) {
  const charactersDiv = document.querySelector(
    '#input-overlay > form.login > div#characters'
  );
  charactersDiv.classList.remove('hide');
  newCharacters = [];
  for (key in data) {
    let thisCharacter = document.createElement('div');
    thisCharacter.classList.add('character');
    thisCharacter.style.background = `url(../asset/${data[key]})`;
    thisCharacter.style.backgroundSize = 'contain';
    thisCharacter.style.backgroundPosition = 'center';
    thisCharacter.style.backgroundRepeat = 'no-repeat';
    thisCharacter.name = key;
    thisCharacter.onclick = function () {
      document
        .querySelector('.selectedCharacter')
        .classList.remove('selectedCharacter');
      thisCharacter.classList.add('selectedCharacter');
    };
    const wrapper = document.createElement('div');
    wrapper.appendChild(thisCharacter);
    charactersDiv.appendChild(wrapper);
  }
  document.querySelector('.character').classList.add('selectedCharacter');
}

/* eslint-disable */
// Show the lives, names, and scores of a specific type of character on the leaderboard.
function handleLeaderboard(
  type, // string: The type of characters.
  title = 'Leaderboard' // string: What the header should say.
) {
  const { game } = this;
  document.querySelector('#game-overlay > .leaderboard').innerHTML = _render([
    `<h3>${title}</h3>`,
    ...Object.entries(game[type])
      .sort(([a, da], [b, db]) =>
        typeof da.score === 'number' && typeof db.score === 'number'
          ? db.score - da.score
          : 1
      )
      .map(
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
/* eslint-enable */

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
    <button id="${item.action}">Buy</button>
    </div>`
    ),
  ]);
  const self = this;
  items.forEach((item) => {
    document.getElementById(item.action).onclick = function () {
      self.sendAction(item.action);
    };
  });
}

// Turn the store interface on and off.
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

// Unlock the state of the store interface so you can toggle again.
function unlockStore() {
  const storeDiv = document.querySelector('#input-overlay > .store');
  if (storeDiv.classList.contains('locked')) {
    storeDiv.classList.remove('locked');
  }
}

const client = {
  StoreItem,
  useLoginScreen,
  useHowToScreen,
  usePlayerSelectScreen,
  handleLeaderboard,
  useStore,
  toggleStore,
  unlockStore,
};

module.exports = { client };
