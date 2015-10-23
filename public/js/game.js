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
    canvas.style.display = "inline";
    gameOver = false;
	ctx = canvas.getContext("2d");

	// Maximise the canvas
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	// Initialise keyboard controls
	keys = new Keys();

	// Calculate a random start position for the local player
	// The minus 5 (half a player size) stops the player being
	// placed right on the egde of the screen
	var startX = Math.floor(Math.random() * 49),
		startY = Math.floor(Math.random() * 49);

	// Initialise the local player
	localPlayer = new Player(startX, startY);

    socket = io.connect('{{url}}');
    remotePlayers = [];

	// Start listening for events
	setEventHandlers();
    socket.emit("new player", {x:startX, y:startY});
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
        var length = data.length;
        console.log("dead");
        gameOver = true;
        canvas.style.display = "none";
        text = document.getElementById("centerText");
        text.innerHTML = "Length at death: " + length * 5 + " px"
        document.getElementById("screen2").style.display = "inline";
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
	if (!gameOver){
        window.requestAnimFrame(animate);
    }
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
