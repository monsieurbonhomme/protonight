
function Server(app, port) {
	this.port = port;
	this.roomName = "protonight";
	this.httpServer = app.listen(port);
	console.log("Le server écoute le port " + this.port);
	this.io = require("socket.io")(this.httpServer);
	this.start();
};

Server.prototype.start = function () {
	that = this;
	var params_players={};

	this.io.on('connection', function (socket) {
		console.log("Connection du client :" + socket.id);

		socket.on("join_room", function (username,params) {
			console.log("{" + that.roomName + "} l'utilisateur " + username + " s'est connecté au salon !");
			socket.join(that.roomName);
			params_players[socket.id] = params;
			socket.broadcast.emit("init_players", params_players);
			socket.emit("init_players", params_players);
		});


		socket.on("generate_pnj", function (nbPnj,colors) {

			//qui est le sniper
			var keys = Object.keys(params_players);
			params_players[keys[Math.floor(Math.random() * keys.length)]].isSniper = true;

			for (let index = 0; index < nbPnj; index++) {
				params_players['pnj'+index]=
				{
					x: Math.random() * 800,
					y: Math.random() * 400,
					name: 'pnj' + index,
					color: colors[Math.floor(Math.random() * colors.length)].value
				}
			}
			socket.broadcast.emit("start_game", params_players);
			socket.emit("start_game", params_players);
		});

		socket.on("update_hero", function (socket_id,position) {
			params_players[socket_id].x=position.x;
			params_players[socket_id].y=position.y;
			socket.broadcast.emit("update_players", params_players);
		});

		// socket.on("leave_room", function (username) {
		// console.log("{" + that.roomName + "} l'utilisateur " + username + " s'est déconnecté du salon !");
		// 	socket.to(that.roomName).emit("messages", "{" + that.roomName + "} l'utilisateur " + username + " s'est déconnecté du salon !");
		// 	socket.leave(that.roomName);
		// });


		// socket.on('messages', function (data, username) {
		// 	console.log("{" + that.roomName + "} l'utilisateur " + username + " envoi le message " + data);
		// 	socket.to(that.roomName).emit('broad', data, username, that.roomName);

		// });

		socket.on("disconnect", function () {
			if (params_players[socket.id]){
				delete params_players[socket.id];
			}

			console.log("Déconnection du client :" + socket.id);
		});
	});


	//this.httpServer.listen(this.port, function () {
	//	console.log("Le server écoute le port " + that.port);
	//});
};

module.exports = Server;