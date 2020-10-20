# IO Game Library

This is the official IO Game Library for building awesome games on the CodeChangers IO Platform.

## Structure

- **bin:** Helpful scripts for developers.
- **examples:** Some cool IO Game examples.
- **src:** Library Source Code.
- **template:** A template game with the latest library build.

# Setup:

## Example Game Setup

Setup a local development environment for one of the example games.

> **Note:** replace `{game}` with the name of the example game you are setting up in all of the following:

```
git clone https://github.com/codechangers/io-game-lib.git
cd io-game-lib

./bin/setup.sh examples/{game}

cd examples/{game}/code
npm install
npm run dev
```

---

## Library Dev Setup

Setup a development environment for the IO Game Library source.

> **Note:** replace `{game}` with the name of the example game you are setting up in all of the following:

### Run Commands:

```
git clone https://github.com/codechangers/io-game-lib.git
cd io-game-lib
npm install

./bin/setup.sh examples/{game}
```

### Edit File: examples/`{game}`/code/client/src/game.js

```
Line 2:
  From:   const ClientLib = require('./client-lib');
  To:     const ClientLib = require('../../../../../src/client');
```

### Edit File: examples/`{game}`/code/server/rooms/room.js

```
Line 2:
  From:   const ServerLib = require('./server-lib');
  To:     const ServerLib = require('../../../../../src/server');
```

### Run Commands:

```
cd examples/{game}/code
npm install
npm run dev
```

# Cleanup:

Cleanup up the development environment of a given example game.

> **Note:** make sure you have commited all changes you don't want to lose!

> **Note:** replace `{game}` with the name of the example game you are setting up in all of the following:

```
cd examples/{game}
rm -rf code
git checkout -- code
```

# Deploying:

The _IO Platform_ pulls the latest changes from the `template` directory upon setup, to deploy the latest library updates run the following commands:

```
npm run build
git add template
git commit
git push
```

Submit a Pull Request to merge your current branch into `master`. Once the Pull Request is merged, run the setup script on the _IO Platform_ server and it will pull the latest library updates.
