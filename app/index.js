// app.js
var Server = require("./server");
var express = require('express');
var app = express();

app.use(express.static(__dirname + '/../public'));
//app.get('/socket.io/socket.io.js', function (req, res, next) {
//	res.sendFile(__dirname + '/../node_modules/socket.io/socket.io.js');
//});
//app.listen(3000);


new Server(app, 3000);
