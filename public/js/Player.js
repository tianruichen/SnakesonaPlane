/**************************************************
** GAME PLAYER CLASS
**************************************************/
var Player = function(startX, startY) {
	this.segments = [[startX, startY],
	                [startX - 1, startY],
	                [startX - 2, startY],
	                [startX - 3, startY]];
	this.direction = "r";
	this.toGrow = 0;

	this.length = function() {
		return segments.length;
	};

	this.update = function(players) {
		var head = this.segments[0].slice(),
			headStr = JSON.stringify(head),
			i, j, playerSegments;

		switch (this.direction) {
			case "u": head[1]--; break;
			case "d": head[1]++; break;
			case "l": head[0]--; break;
			case "r": head[0]++; break;
		}

		for (i = 0; i < players.length; i++) {
			var playerSegments = players[i].segments;
			for (j = 0; j < playerSegments.length; j++) {
				if (JSON.stringify(playerSegments[j]) == headStr) {
					return false;
				}
			}
		}

		segments.pop();
		segments.unshift(head);
		return true;
	};

	this.draw = function(ctx) {
		segments.forEach(function (s) {
			ctx.fillRect(s[0] * 10, s[1] * 10, 10, 10);
		});
	};
};

// export if node.js
if (typeof module !== "undefined") module.exports = Player;
