var express = require('express'),
    app = express(),
    server = require('http').createServer(app), 
    io = require('socket.io')(server),
    Player = require("./public/js/Player"),
    players = [],
    grid = [50][50];

function init() {
    app.use(express.static(__dirname + '/public'));
    server.listen(8000); 
    setEventHandlers();
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
        client.on("update", updater);
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
    this.broadcast.emit("new player", {id: newPlayer.id, x: newPlayer.getX(), y: newPlayer.getY()});
    var i, existingPlayer;
    for (i = 0; i < players.length; i++) {
        existingPlayer = players[i];
        this.emit("new player", {id: existingPlayer.id, x: existingPlayer.getX(), y: existingPlayer.getY()});
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

    movePlayer.setX(data.x);
    movePlayer.setY(data.y);

    this.broadcast.emit("move player", {id: movePlayer.id, x: movePlayer.getX(), y: movePlayer.getY()});
};


function playerById(id) {
    var i;
    for (i = 0; i < players.length; i++) {
        if (players[i].id == id)
            return players[i];
    };

    return false;
};

function updater(){
    //update();
    this.emit("get objects", objects);
}

init();

