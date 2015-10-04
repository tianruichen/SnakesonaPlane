/**************************************************
** GAME PLAYER CLASS
**************************************************/
var Player = function(startX, startY) {
	var segments = [[startX, startY],
	                [startX - 1, startY],
	                [startX - 2, startY],
	                [startX - 3, startY]];
		direction = "r";

	var getSegments = function() {
		return segments;
	};

	var length = function() {
		return segments.length;
	};

	var getDirection = function() {
		return direction
	};

	var setDirection = function(d) {
		direction = d;
	};

	var update = function(players) {
		var head = segments[0].slice(),
			headStr = JSON.stringify(head),
			i, j, playerSegments;

		switch (direction) {
			case "u": head[1]--; break;
			case "d": head[1]++; break;
			case "l": head[0]--; break;
			case "r": head[0]++; break;
		}


		for (i = 0; i < players.length; i++) {
			var playerSegments = players[i].getSegments();
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

	var draw = function(ctx) {
		segments.forEach(function (s) {
			ctx.fillRect(s[0] * 10, s[1] * 10, 10, 10);
		});
	};

	return {
        getSegments: getSegments,
		length: length,
		getDirection: getDirection,
		setDirection: setDirection,
		update: update,
		draw: draw
	};
};

// export if node.js
if (typeof module !== "undefined") module.exports = Player;
