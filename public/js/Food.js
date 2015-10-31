var Food = function () {
	this.pos = [getRandomInt(2, 140), getRandomInt(2, 80)];
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

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

Food.prototype.draw = function (ctx) {
	ctx.beginPath();
	ctx.arc(this.pos[0] * 10 + 5, this.pos[1] * 10 + 5, 5, 0, 2 * Math.PI, false);
	ctx.fillStyle = this.color;
	ctx.fill();
};

// export if node.js
if (typeof module !== "undefined") module.exports = Food;
