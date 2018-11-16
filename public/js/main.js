require.config({});

require(['./lib/socket', 'hero', 'gamepad', 'sniper', 'circle'], function (Chaussette, Hero, Gamepad, Sniper, Circle) {
	var socket = Chaussette.connect();

	let game = {
		canvas: document.querySelector('canvas'),
		hero: undefined,
		gamepad: new Gamepad()
	}
	game.canvas.width = 800;
	game.canvas.height = 400;
	var ctx = game.canvas.getContext('2d');
	var decor = [];

	function startGame() {
		$('canvas').show();
		$('.js-form').hide();
		socket.emit('join_room');
	}

	socket.on('sniper_won', function() {
		socket.emit('remove_player', game.hero.id);
		socket.disconnect();
		sniperWon = true;
		setTimeout(function() {
			window.location.reload();
		}, 2000);
	})

	socket.on('start_game', function (players, decorConfig) {
		for (playerId in players) {
			if (playerId === heroConfig.id) {
				if (players[playerId].isSniper) {
					game.hero = new Sniper(heroConfig)
				} else {
					game.hero = new Hero(heroConfig)
				}
			} else {
				var config = {
					x: players[playerId].x,
					y: players[playerId].y,
					id: players[playerId].id,
					axes: players[playerId].axes,
					color: players[playerId].color
				};
				if (players[playerId].isSniper) {
					pnjs[playerId] = new Sniper(config)
				} else {
					pnjs[playerId] = new Hero(config)
				}
			}
		}
		for (var i = 0; i < decorConfig.length; i++) {
			var c = decorConfig[i];
			decor.push(new Circle(c.x, c.y, 20, c.color, 0))
		}
		gameLoop();
	});
	var heroConfig;
	socket.on('get_hero', function (hero) {
		heroConfig = hero
		game.gamepad.onInput(function (config) {

			if(game.hero) {
				if (game.hero.isSniper) {
					if (game.hero.isShooting == false && !!config.triggers.r) {
						socket.emit("shoot");
						game.hero.isShooting = true;
					}
					if (!config.triggers.r) {
						game.hero.isShooting = false;
					}
				}

				if (!game.hero.isDead) {
					socket.emit("update_direction", {
						id: game.hero.id,
						x: config.axes.l[0],
						y: config.axes.l[1]
					});
				}
			}



		});
	})
	let pnjs = {};
	let sniperWon = false;
	socket.on('update_players', function (players) {
		if (!game.hero) {
			return
		}
		for (let playerId in players) {
			if (playerId === game.hero.id) {
				game.hero.x = players[playerId].x;
				game.hero.y = players[playerId].y;
				game.hero.axes = players[playerId].axes;
				game.hero.isDead = players[playerId].isDead;
				game.hero.size = players[playerId].size;
			} else {
				pnjs[playerId].x = players[playerId].x;
				pnjs[playerId].y = players[playerId].y;
				pnjs[playerId].axes = players[playerId].axes;
				pnjs[playerId].isDead = players[playerId].isDead;
				pnjs[playerId].size = players[playerId].size;
			}
		}
	})

	function _drawBackground(c) {
		c.clearRect(0, 0, game.canvas.width, game.canvas.height);
		c.fillStyle = '#EEE';
		c.fillRect(0, 0, game.canvas.width, game.canvas.height);
	}
	let foregroundOpacity = 0;

	function _drawForeground(c) {

		c.globalAlpha = foregroundOpacity;
		c.fillStyle = '#333';
		c.fillRect(0, 0, game.canvas.width, game.canvas.height);
		c.globalAlpha = 1;
	}
var sniperImage = new Image();
sniperImage.src = '/images/salt.jpg';
	function gameLoop() {
		requestAnimationFrame(gameLoop);
		_drawBackground(ctx);
		game.hero.move();
		game.hero.draw(ctx);
		for (let pnj in pnjs) {
			pnjs[pnj].move();
			pnjs[pnj].draw(ctx);
		}
		for (var i = 0; i < decor.length; i++) {
			decor[i].draw(ctx)
		}

		if (game.hero.isSniper) {
			var dif = Math.abs(game.hero.axes.x) + Math.abs(game.hero.axes.y);
			if (dif) {
				foregroundOpacity = Math.min(1, foregroundOpacity + 0.01)
			} else {
				foregroundOpacity = Math.max(0, foregroundOpacity - 0.01)
			}
			_drawForeground(ctx)
		}
		if(sniperWon) {
			ctx.drawImage(sniperImage, 0, 0, 2048, 1121, 0, 0, 800, 400);
		}
	}

	window.onbeforeunload = function () {
		socket.emit('remove_player', game.hero.id);
	}
	startGame();
})