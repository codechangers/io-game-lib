/* -- CodeChangers io-game-lib 2020 --
 * This file contains the source code to create some helpful user interfaces. */

/* ==========================
 * ==== Ignored Methods: ====
 * ========================== */

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
  document.getElementById('input-overlay').innerHTML = `<form class="login">
    <h1>${title}</h1>
    <input id="displayName" type="text" placeholder="${input}" />
    <button type="submit">${button}</button>
  </form>`;
  document.getElementById('input-overlay').style.display = 'flex';
  document.querySelector('form.login').onsubmit = function (e) {
    e.preventDefault();
    const name = document.getElementById('displayName').value || 'player';
    document.getElementById('input-overlay').style.display = 'none';
    document.querySelector('#input-overlay > .login').style.display = 'none';
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

function useStore() {
  document.querySelector('#game-overlay > .store').innerHTML = _render([
    '<h1 style="color:white">This is the Store!</h1>',
  ]);
}

function toggleStore() {
  const storeDiv = document.querySelector('#game-overlay > .store');
  if (
    !storeDiv.classList.contains('locked') &&
    storeDiv.classList.contains('hide')
  ) {
    storeDiv.classList.remove('hide');
    storeDiv.classList.add('locked');
  } else if (!storeDiv.classList.contains('locked')) {
    storeDiv.classList.add('hide');
    storeDiv.classList.add('locked');
  }
}
function unlockStore() {
  const storeDiv = document.querySelector('#game-overlay > .store');
  if (storeDiv.classList.contains('locked')) {
    storeDiv.classList.remove('locked');
  }
}

const client = {
  useLoginScreen,
  handleLeaderboard,
  useStore,
  toggleStore,
  unlockStore,
};

module.exports = { client };
