/**************************************************
** GAME PLAYER CLASS
**************************************************/
var Player = function(startX, startY) {
	var segments = [[startX, startY]],
		direction = "r",
		id,

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

	var update = function() {
		head = segments[0].slice();

		switch (direction) {
			case "u": head[1]--; break;
			case "d": head[1]++; break;
			case "l": head[0]--; break;
			case "r": head[0]++; break;
		}

		segments.pop();
		segments.unshift(head);
	};

	var draw = function(ctx) {
		segments.foreach(function (s) {
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
