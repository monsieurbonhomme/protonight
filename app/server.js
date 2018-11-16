var constants = require("./constants");
var Hero = require("./hero");
var waitedPlayers = 2;

function Server(app, port) {
	this.port = port;
	this.roomName = "protonight";
	this.httpServer = app.listen(port);
	console.log("Le server écoute le port " + this.port);
	this.io = require("socket.io")(this.httpServer);
	this.start();
	gameLoopServer();
};
let players = {};
let sniperId;


function gameLoopServer() {
	setInterval(() => {
		for (let playerId in players) {
			players[playerId].move();
		}
	}, 1000 / 60);
}

function _generateDecor() {
	var count = 100;
	let decor = [];
	for(let i = 0; i < count; i++) {
		decor.push({
			x: Math.random() * 800,
			y: Math.random() * 400,
			color: constants.colors[Math.floor(Math.random() * constants.colors.length)].value
		})
	}
	return decor;
}

Server.prototype.start = function () {
	that = this;

	this.io.on('connection', function (socket) {
		console.log("Connection du client :" + socket.id);

		socket.on("join_room", function () {
			players[socket.id] = new Hero({
				id: socket.id,
				x: Math.random() * 800,
				y: Math.random() * 400,
				color: constants.colors[Math.floor(Math.random() * constants.colors.length)].value
			});
			socket.emit("get_hero", players[socket.id]);

			var keys = Object.keys(players);
			console.log(keys.length + ' joueurs connectés !')
			if (keys.length === waitedPlayers) {
				var rand = Math.floor(Math.random() * keys.length)
				sniperId = keys[rand];
				players[sniperId].isSniper = true;
				var decors = _generateDecor();
				socket.broadcast.emit("start_game", players, decors);
				socket.emit('start_game', players, decors);
			}
		});

		socket.on("update_direction", function (direction) {
			if (!players[socket.id]) {
				return;
			}
			players[socket.id].axes = direction;
			players[socket.id].move();
			socket.broadcast.emit("update_players", players);
			socket.emit("update_players", players);
		});

		socket.on("shoot", function () {
			let TheSniper = players[sniperId];
			let deadCounter = 0;
			for (let playerId in players) {
				if (playerId != sniperId) {
					if (players[playerId].collidesWith(TheSniper)) {
						players[playerId].isDead = true;
					}
					if(players[playerId].isDead) {
						deadCounter++;
					}
				}
			}
			console.log(deadCounter, Object.keys(players).length);
			if (deadCounter === Object.keys(players).length - 1) {
				socket.emit('sniper_won');
				socket.broadcast.emit('sniper_won');
			}
		});


		socket.on('remove_player', function (id) {
			delete players[id];
		});

		socket.on("disconnect", function () {
			console.log(arguments)
		});
	});

};

module.exports = Server;