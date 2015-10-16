/**************************************************
** GAME PLAYER CLASS
**************************************************/
var Player = function (x, y) {
	this.segments = [[x, y], [x - 1, y], [x - 2, y], [x - 3, y]];
	this.direction = "r";
	this.toGrow = 0;
    this.color = getRandomColor();
};

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
    
Player.prototype.length = function () {
	return this.segments.length;
};

Player.prototype.grow = function (length) {
	this.toGrow += length || 1;
};

Player.prototype.update = function (players) {
	var head = this.segments[0].slice(),
		headStr = JSON.stringify(head),
		i, j, playerSegments;

	switch (this.direction) {
		case "u": head[1]--; break;
		case "d": head[1]++; break;
		case "l": head[0]--; break;
		case "r": head[0]++; break;
	}

	players.forEach(function (p) {
		p.segments.forEach(function (s) {
			if (JSON.stringify(s) == headStr) return false;
		});
	});

	this.segments.unshift(head);
	if (!this.toGrow) this.segments.pop();
	else this.toGrow--;

	return true;
};

Player.prototype.draw = function (ctx) {
    ctx.fillStyle = this.color;
	this.segments.forEach(function (s) {
		ctx.fillRect(s[0] * 10, s[1] * 10, 10, 10);
	});
};

// export if node.js
if (typeof module !== "undefined") module.exports = Player;
