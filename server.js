var express = require('express'),
    app = express(),
    server = require('http').createServer(app), 
    io = require('socket.io')(server),
    Player = require("./Player").Player;

function init() {
    players = [];
    app.use(express.static(__dirname + '/public'));  
    app.get('/', function(req, res, next) {  
        res.sendFile(__dirname + '/public/index.html');
    });

    server.listen(8000); 
    setEventHandlers();
};

function setEventHandlers(){
    io.on('connection', function(client) {  
        console.log('Client connected...');

        client.on('join', function(data) {
            console.log(data);
            client.emit('messages', 'Hello from server');
        });
        
        client.on("disconnect", onClientDisconnect);
        client.on("new player", onNewPlayer);
        client.on("move player", onMovePlayer);
    });
};

function onClientDisconnect() {
    console.log("Player has disconnected: "+this.id);
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

function onMovePlayer(data) {

};

init();

