// PLEASE IGNORE ME IN THE DOCS
function exampleOnStart(name) {
  console.log(name + ' is joining...');
}

// Show an interactive login screen when a player first joins.
function useLoginScreen(
  onStart = exampleOnStart, // function: What to do when they click the button.
  title = 'IO Game', // string: What the header should say.
  input = 'Display Name', // string: What the input should say.
  button = 'START' // string: What the button should say.
) {
  document.getElementById('input-overlay').innerHTML = `<div class="login">
    <h1>${title}</h1>
    <input id="displayName" type="text" placeholder="${input}" />
    <button id="start-button">${button}</button>
  </div>`;
  document.getElementById('input-overlay').style.display = 'flex';
  document.getElementById('start-button').onclick = function () {
    const name = document.getElementById('displayName').value || 'player';
    document.getElementById('input-overlay').style.display = 'none';
    document.querySelector('#input-overlay > .login').style.display = 'none';
    onStart(name);
  };
}

const client = { useLoginScreen };

module.exports = { client };
