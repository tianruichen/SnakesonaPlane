var Food = function () {
	this.pos = [getRandomInt(10, 100), getRandomInt(10, 100)];
};

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

Food.prototype.draw = function (ctx) {
	ctx.beginPath();
	ctx.arc(this.pos[0] * 10 + 5, this.pos[1] * 10 + 5, 5, 0, 2 * Math.PI, false);
	ctx.fillStyle = 'green';
	ctx.fill();
};

// export if node.js
if (typeof module !== "undefined") module.exports = Food;