---
title: playAnimation
subtitle: "Set an animation to be played on a character/resource."
tags: [server, animations, play]
author: jason
---

## Parameters

**obj**: `object` - The character/resource instance.

**attribute**: `string` - The attribute that will be animated.

**value**: `number` - The value the attribute should be changed by.

**duration**: `number` - (milliseconds) how long the animation should run.

## Returns

**Nothing**

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
