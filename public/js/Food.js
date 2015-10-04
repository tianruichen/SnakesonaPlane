var Food = function(startX, startY) {
	var x = startX,
		y = startY;
    
    var getX = function() {
        return x;
    };

    var getY = function() {
        return y;
    };

	var draw = function(ctx) {
        ctx.beginPath();
        ctx.arc(x + 5, y + 5, 5, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'green';
        ctx.fill();
	};

	return {
        getX: getX,
        getY: getY,
		draw: draw
	}
};