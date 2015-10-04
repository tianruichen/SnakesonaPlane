var express = require('express'),
    app = express(),
    server = require('http').createServer(app), 
    io = require('socket.io')(server),
    Player = require("./public/js/Player"),
    players = [],
    food = [],
    grid = new Array(50),
    fps = 2,
    intervalId;

function init() {
    app.use(express.static(__dirname + '/public'));
    server.listen(8000); 
    var i, j;
    for (i = 0; i < 50; i++){    
        grid[i] = new Array(50);
    }
    setEventHandlers();
    intervalId = setInterval(update, 1000 / fps);
};

function setEventHandlers(){
    io.on('connection', function(client) {  
        console.log('Client connected...');

        client.on('join', function(data) {
            console.log(data);
            //client.emit('messages', 'Hello from server');
        });
        
        client.on("disconnect", onClientDisconnect);
        client.on("new player", onNewPlayer);
        client.on("change direction", changeDirection);
        client.on("update", getObjects);
        //client.on("remove player", onRemovePlayer);
    });
};

function onClientDisconnect() {
    console.log("Player has disconnected: "+this.id);
    console.log("Removing plz");
    var removePlayer = playerById(this.id);
    if (!removePlayer) {
        console.log("Player not found: "+this.id);
        return;
    };

    players.splice(players.indexOf(removePlayer), 1);
    this.broadcast.emit("remove player", {id: this.id});
    //this.emit("remove player", {id: this.id, x: this.getX(), y: this.getY()})
};

function onNewPlayer(data) {
    var newPlayer = new Player(data.x, data.y);
    newPlayer.id = this.id;
    this.broadcast.emit("new player", {id: newPlayer.id, x: data.x, y: data.y});
    var i, existingPlayer;
    for (i = 0; i < players.length; i++) {
        existingPlayer = players[i];
        //this.emit("new player", {id: existingPlayer.id, x: existingPlayer.getX(), y: existingPlayer.getY()});
    };
    players.push(newPlayer);
};

function changeDirection(data) {
    console.log("move it");
    var movePlayer = playerById(this.id);

    if (!movePlayer) {
        console.log("Player not found: "+this.id);
        return;
    };

    movePlayer.setDirection(data.direction);

    //this.broadcast.emit("move player", {id: movePlayer.id, x: movePlayer.getX(), y: movePlayer.getY()});
};


function playerById(id) {
    var i;
    for (i = 0; i < players.length; i++) {
        if (players[i].id == id)
            return players[i];
    };

    return false;
};

function update(){
    players.forEach(function (e) {
        e.getSegments().forEach(function (z) {
            grid[z[0]][z[1]] = e.id;
        });
    });
}

function getObjects(){
    //update();
    this.emit("get objects", {player: players, food: food});
}

init();

