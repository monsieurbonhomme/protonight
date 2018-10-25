require.config({
});


require(['./lib/socket', 'constants', 'gamepad', 'hero', 'sniper'], function (Chaussette,constants, GamepadHandler, Hero, Sniper) {
   var socket = Chaussette.connect();

    let game = {
        canvas: document.querySelector('canvas'),
        gamepad: {
            handler: new GamepadHandler()
        },
        state: 'lobby'
    };
    game.canvas.width = 800;
    game.canvas.height = 400;
    game.context = game.canvas.getContext('2d');

/*
    game.canvas.width = 800;
    game.canvas.height = 400;
    game.context = game.canvas.getContext('2d');

    game.hero = new Hero();
    game.hero.size = 50;
    game.hero.x = game.canvas.width / 2;
    game.hero.y = game.canvas.height / 2;
    game.gamepad.handler.onInput(function(config) {
        if(config.axes.l) {
            game.hero.move(config.axes.l);
        }
    });*/
    var hero;
    var name;
    var socket_id;
    var pnjs = {};
    for(var i = 0; i < constants.colors.length; i++) {
        $('.js-colors-list').append('<div class="js-color-item" data-value="' + constants.colors[i].value + '"style="border-color: ' + constants.colors[i].value + '; background-color: ' + constants.colors[i].value + '">' + constants.colors[i].name + '</div>')
    }

    function _joinRoom() {
        var color = $('.js-color-item.selected').attr('data-value');
        name = $('.js-name-input').val();

        //init position
        var params = {
            x: Math.random() * 200,
            y: Math.random() * 200,
            name: name,
            color: color, isSniper:false
        };
        socket.emit('join_room', name, params);

    }


function _startGame(players) {
    for(const socketId in players) {
        if (players[socketId].name !== name) {
            pnjs[socketId]=new Hero(players[socketId].x, players[socketId].y, players[socketId].color);
            // Nouveau PNJ
        } else {
            hero = new Hero(players[socketId].x, players[socketId].y, players[socketId].color);
            socket_id = socketId;
        }
    }
    $('canvas').show();
    $('.js-form').hide();
    hero.move= hero.velocityMove;
    game.gamepad.handler.onInput(function(config) {
        if(config.axes.l) {
            hero.move(config.axes.l);
            socket.emit("update_hero", socket_id ,{
                x: hero.x,
                y: hero.y
            });
        }
    });
    gameLoop();
}
       socket.on('init_players', function (players) {
           var names = Object.keys(players);
           if(names.length === 1) {

                socket.emit("generate_pnj", 100, constants.colors);
            }

       });

       socket.on('start_game', function (players) {
            console.log(players);
            _startGame(players);
        });

        socket.on('update_players', function (players) {

           for (const socketId in players) {
               if (pnjs[socketId] && players[socketId].name !== name) {
                    pnjs[socketId].x = players[socketId].x;
                    pnjs[socketId].y = players[socketId].y;
               }
           }
       });



    $('body').on('click.chooseColor', '.js-color-item', function() {
        $('.js-color-item').removeClass('selected');
        $(this).addClass('selected');
        $('.js-validate-button').show();
    }).on('click.validateColor', '.js-validate-button', _joinRoom);

    function _drawBackground(c) {
        c.clearRect(0, 0, game.canvas.width, game.canvas.height);
        c.fillStyle = '#EEE';
        c.fillRect(0, 0, game.canvas.width, game.canvas.height);
    }

    function gameLoop() {
        requestAnimationFrame(gameLoop);
        _drawBackground(game.context);
        hero.update(game.context);
        for (const index in pnjs) {
            const element = pnjs[index];
            element.draw(game.context);

        }
    }

    function _startGameTest(players) {
        for(const socketId in players) {
            if (players[socketId].name !== name) {
                pnjs[socketId]=new Hero(players[socketId].x, players[socketId].y, players[socketId].color);
                // Nouveau PNJ
            } else {
                if(true || players[socketId].isSniper) {
                    hero = new Sniper();
                } else {
                    hero = new Hero(players[socketId].x, players[socketId].y, players[socketId].color);
                }
                socket_id = socketId;
            }
        }
        $('canvas').show();
        $('.js-form').hide();
        game.gamepad.handler.onInput(function(config) {
            if(config.axes.l) {
                hero.move(config.axes.l);
                socket.emit("update_hero", socket_id ,{
                    x: hero.x,
                    y: hero.y
                });
            }
        });
        gameLoop();
    }
});