/**************************************************
** GAME VARIABLES
**************************************************/
var canvas,			// Canvas DOM element
	ctx,			// Canvas rendering context
	keys,			// Keyboard input
    remotePlayers,  // Remote player
	localPlayer,	// Local player
    players = new Array(0),
    food = new Array (0),
    socket;


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
};

// Keyboard key down
function onKeydown(e) {
    var code = e.keyCode;
    if (code >= 37 || code <=40 ){
        if (localPlayer) {
            //console.log("testing");
            //keys.onKeyDown(e);
            socket.emit("change direction", {id: localPlayer.id, direction: code});
        };
    };
};

// Keyboard key up
function onKeyup(e) {
	if (localPlayer) {
        //socket.emit("move player", {x: localPlayer.getX(), y: localPlayer.getY()});
        //console.log("testing");
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

/*function onMovePlayer(data) {
    console.log("testing part 2");
    var movePlayer = remotePlayerById(data.id);

    if (!movePlayer) {
        console.log("Player not found: "+data.id);
        return;
    };

    movePlayer.setX(data.x);
    movePlayer.setY(data.y);
};*/

function onRemovePlayer(data) {
    console.log("New player disconnected: " + data.id);
    var removeRemotePlayer = remotePlayerById(data.id);

    if (!removeRemotePlayer) {
        console.log("Player not found: "+data.id);
        return;
    };

    remotePlayers.splice(remotePlayers.indexOf(removeRemotePlayer), 1);
    
    this.broadcast.emit("remove player", {id: this.id});
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
    //update();
    socket.emit("updater");
	draw();

	// Request a new animation frame using Paul Irish's shim
	window.requestAnimFrame(animate);
};


/**************************************************
** GAME UPDATE
**************************************************/
/*function update() {
	if (localPlayer.update(keys)) {
        socket.emit("move player", {x: localPlayer.getX(), y: localPlayer.getY()});
    };
};*/


/**************************************************
** GAME DRAW
**************************************************/
function draw() {
	// Wipe the canvas clean
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// Draw the local player
	//localPlayer.draw(ctx);
    var i;
    for (i = 0; i < allObjects.length; i++) {
        allObjects[i].draw(ctx);
    };
};

function getObjects(data){
    console.log("objects got")
    players = data.player;
    food = data.food;
}