var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io')(server),
    Player = require("./public/js/Player"),
    players = [],
    food = [],
    fps = 5,
    intervalId;

function init() {
    app.use(express.static(__dirname + '/public'));
    server.listen(8000); 
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
        // client.on("update", getObjects);
        // client.on("remove player", onRemovePlayer);
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
    players.push(newPlayer);
    /*this.broadcast.emit("new player", {id: newPlayer.id, x: data.x, y: data.y});
    var i, existingPlayer;
    for (i = 0; i < players.length; i++) {
        existingPlayer = players[i];
        //this.emit("new player", {id: existingPlayer.id, x: existingPlayer.getX(), y: existingPlayer.getY()});
    };
    players.push(newPlayer);*/
};

function changeDirection(data) {
    var movePlayer = playerById(this.id);

    if (!movePlayer) {
        console.log("Player not found: "+this.id);
        return;
    };
    movePlayer.direction = data.direction;

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

function update() {
    players.forEach(function(p) {
        if (!p.update(players)) {
            // TODO: player lose
        }
    });
    io.emit("get objects", {players: players, food: food});
}

init();
