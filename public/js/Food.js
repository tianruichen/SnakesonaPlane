var Food = function(startX, startY) {
	var x = startX,
		y = startY,
        id
    
    var getX = function() {
        return x;
    };

    var getY = function() {
        return y;
    };

	var draw = function(ctx) {
        context.beginPath();
        context.arc(x, y, radius, 0, 2 * Math.PI, false);
        context.fillStyle = 'green';
        context.fill();
	};

	return {
        getX: getX,
        getY: getY,
		draw: draw
	}
};