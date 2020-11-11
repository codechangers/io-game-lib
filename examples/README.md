# Example Games

This directory uses git submodules to include repositories of some example games that show different ways of using the _io-game-lib_.

## Example Game Setup

Setup a local development environment for one of the example games.

> **Note:** replace `{game}` with the name of the example game you are setting up in all of the following:

```
git clone https://github.com/codechangers/io-game-lib.git
cd io-game-lib
git submodule update --init --recursive

./bin/setup.sh examples/{game}

cd examples/{game}/code
npm install
npm run dev
```

> **Note:** To pull the latest changes to the example games and push them to this repo run the following:
>
> ```
> cd io-game-lib
> ./bin/pull_subs.sh
> ```

---

## Adding Example Games

Add a new example game to the examples directory.

> **Note:** the game must be hosted on a remote git repository that you have access to. The repo must also contain a code directory with the same structure as the `template` directory. It is highly recommended that this repo is also hooked up to a repl.it project.

> **Note:** replace `https://repo.url/path/to/game.git` with a url pointing to your git repository.

```
cd examples
git submodule add https://repo.url/path/to/game.git
```
