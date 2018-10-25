
function Server(app, port) {
	this.port = port;
	this.roomName = "protonight";
	this.httpServer = app.listen(port);
    console.log("Le server écoute le port " + port);
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
			params_players[username] = params;
			socket.broadcast.emit("update_players", params_players);
			socket.emit("update_players", params_players);
		});



		socket.on("leave_room", function (username) {
		console.log("{" + that.roomName + "} l'utilisateur " + username + " s'est déconnecté du salon !");
			socket.to(that.roomName).emit("messages", "{" + that.roomName + "} l'utilisateur " + username + " s'est déconnecté du salon !");
			socket.leave(that.roomName);
		});


		socket.on('messages', function (data, username) {
			console.log("{" + that.roomName + "} l'utilisateur " + username + " envoi le message " + data);
			socket.to(that.roomName).emit('broad', data, username, that.roomName);

		});

		socket.on("disconnect", function () {

			console.log("Déconnection du client :" + socket.id);
		});
	});
};

module.exports = Server;