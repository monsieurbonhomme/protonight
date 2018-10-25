// app.js
var Server = require("./server");
var express = require('express');
var app = express();

app.use(express.static(__dirname + '/../public'));

new Server(app, 3000);
