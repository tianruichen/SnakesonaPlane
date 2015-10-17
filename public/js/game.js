/**************************************************
** GAME VARIABLES
**************************************************/
var canvas,			// Canvas DOM element
	ctx,			// Canvas rendering context
	keys,			// Keyboard input
    remotePlayers,  // Remote player
	localPlayer,	// Local player
    players = [],
    food = [],
    socket,
    gameOver = false;


/**************************************************
** GAME INITIALISATION
**************************************************/
function init() {
	// Declare the canvas and rendering context
	canvas = document.getElementById("gameCanvas");
	ctx = canvas.getContext("2d");

	// Maximise the canvas
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	// Initialise keyboard controls
	keys = new Keys();

	// Calculate a random start position for the local player
	// The minus 5 (half a player size) stops the player being
	// placed right on the egde of the screen
	var startX = Math.round(Math.random()*(canvas.width-5)),
		startY = Math.round(Math.random()*(canvas.height-5));

	// Initialise the local player
	localPlayer = new Player(startX, startY);

    socket = io.connect('http://localhost:8000');
    remotePlayers = [];

	// Start listening for events
	setEventHandlers();

};


/**************************************************
** GAME EVENT HANDLERS
**************************************************/
var setEventHandlers = function() {
	// Keyboard
	window.addEventListener("keydown", onKeydown, false);
	window.addEventListener("keyup", onKeyup, false);

	// Window resize
	window.addEventListener("resize", onResize, false);
    socket.on("connect", onSocketConnected);
    socket.on("disconnect", onSocketDisconnect);
    socket.on("new player", onNewPlayer);
    //socket.on("move player", changeDirection);
    socket.on("remove player", onRemovePlayer);
    socket.on("get objects", getObjects);
};

// Keyboard key down
function onKeydown(e) {
    if (!gameOver){
        var d = false;
        switch (e.keyCode) {
            case 37: d = "l"; break;
            case 38: d = "u"; break;
            case 39: d = "r"; break;
            case 40: d = "d"; break;
        }

        if (d) socket.emit("change direction", {id: localPlayer.id, direction: d});
    }
};

// Keyboard key up
function onKeyup(e) {
	if (localPlayer) {
		keys.onKeyUp(e);
	};
};

// Browser window resize
function onResize(e) {
	// Maximise the canvas
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
};

function onSocketConnected() {
    console.log("Connected to socket server");
    socket.emit("new player", {x: Math.floor(Math.random() * 49), y: Math.floor(Math.random() * 49)});
};

function onSocketDisconnect() {
    console.log("Disconnected from socket server");
    //socket.emit("remove player", {x: localPlayer.getX(), y: localPlayer.getY()});
};

function onNewPlayer(data) {
    console.log("New player connected: "+data.id);
    var newPlayer = new Player(data.x, data.y);
    newPlayer.id = data.id;
    remotePlayers.push(newPlayer);
};

function onRemovePlayer(data) {
    /*console.log("New player disconnected: " + data.id);
    var removeRemotePlayer = remotePlayerById(data.id);

    if (!removeRemotePlayer) {
        console.log("Player not found: "+data.id);
        return;
    };*/
    console.log("testing");
    if (data.id === this.id){
        console.log("dead");
        gameOver = true;
    }
    //remotePlayers.splice(remotePlayers.indexOf(removeRemotePlayer), 1);
    //this.broadcast.emit("remove player", {id: this.id});
};

function remotePlayerById(id) {
    var i;
    for (i = 0; i < remotePlayers.length; i++) {
        if (remotePlayers[i].id == id)
            return remotePlayers[i];
    };

    return false;
};
/**************************************************
** GAME ANIMATION LOOP
**************************************************/
function animate() {
    draw();

	// Request a new animation frame using Paul Irish's shim
	window.requestAnimFrame(animate);
};

/**************************************************
** GAME DRAW
**************************************************/
function draw() {
	// Wipe the canvas clean
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// Draw all players
    players.forEach(function (p) { p.draw(ctx); });
    food.forEach(function (f) { f.draw(ctx); });
    if (gameOver){
        ctx.font="30px Comic Sans";
        ctx.fillStyle = "black";
        ctx.fillText("Game Over",canvas.width/2,canvas.height/2);
        ctx.fillText("Refresh to restart",canvas.width/2,canvas.height/2 + 35);
    }
};

function toPrototype(proto, data) {
	obj = Object.create(proto);
	for (key in data) obj[key] = data[key];
	return obj;
}

function getObjects(data) {
    players = data.players.map(function (p) { return toPrototype(Player.prototype, p); });
    food = data.food.map(function (f) { return toPrototype(Food.prototype, f); });
}
