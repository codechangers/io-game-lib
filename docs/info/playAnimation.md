## Usage

You can use this method to change a character or resources attributes like x, y, or rotation by a certain amount every certain amount of time to make it look like it is moving.

## Examples

### Example 1

```
// File: code/server/rooms/room.js
​
onJoin(client) {
	const player = g.getACharacter('players', client.sessionId);
	g.playAnimation(player, 'rotation', 1, 1000);
}
```

### Example 2

```
// File: code/server/rooms/room.js
​
onJoin(client) {
	const player = g.getACharacter('players', client.sessionId);
	g.playAnimation(player, 'x', 5, 2000);
}
```
