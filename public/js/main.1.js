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
            type: 'pj',
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
           if(names.length === 2) {
                socket.emit("generate_pnj", 4, constants.colors);
            }

       });

       socket.on('start_game', function (players) {
            console.log(players);
            _startGameTest(players);
        });

        socket.on('update_players', function (socketId,player) {
            if (pnjs[socketId] && player.name !== name) {
                pnjs[socketId].x = player.x;
                pnjs[socketId].y = player.y;

           }
       });

        socket.on('change_pnj_axes', function (socketId,axes) {
            pnjs[socketId].axePos = axes;
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

    function randomMovePnj(timer) {
        for (const index in pnjs) {

            if ((!pnjs[index].moveTimer || timer > pnjs[index].moveTimer) && pnjs[index].type == "pnj" ) {
                if ( pnjs[index].tick == true){
                    pnjs[index].axePos = [Math.random() * 2 - 1, Math.random() * 2 - 1];

                }
                pnjs[index].tick = !pnjs[index].tick;
                pnjs[index].moveTimer = timer + (Math.random()* 120 +60);

            }
            pnjs[index].move(pnjs[index].axePos);
            pnjs[index].update(game.context);
            socket.emit("update_hero", index,  {
                    x: pnjs[index].x,
                    y: pnjs[index].y
                });

        }


     }

     var timer = 0;

    function gameLoop() {
        timer++;
        requestAnimationFrame(gameLoop);
        _drawBackground(game.context);
        if(hero.isSniper){
            randomMovePnj(timer);
        }else{
            for (const index in pnjs) {
                pnjs[index].move(pnjs[index].axePos);
                pnjs[index].update(game.context);
            }
        }

        hero.update(game.context);
        for (const index in pnjs) {
            const element = pnjs[index];
            element.draw(game.context);

        }
    }

    function _startGameTest(players) {
        for(const socketId in players) {
            if (players[socketId].name !== name) {
                pnjs[socketId] = new Hero(players[socketId].x, players[socketId].y, players[socketId].color, players[socketId].type);
                // Nouveau PNJ
            } else {
                if( players[socketId].isSniper) {
                    hero = new Sniper();
                } else {
                    hero = new Hero(players[socketId].x, players[socketId].y, players[socketId].color, players[socketId].type);
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