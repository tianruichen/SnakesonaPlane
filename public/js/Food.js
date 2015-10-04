var Food = function (startX, startY) {
	this.x = startX;
	this.y = startY;
};

Food.prototype.draw = function (ctx) {
	ctx.beginPath();
	ctx.arc(x * 10 + 5, y * 10 + 5, 5, 0, 2 * Math.PI, false);
	ctx.fillStyle = 'green';
	ctx.fill();
};
