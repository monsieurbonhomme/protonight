require.config({

});

require(['gamepad', 'hero'], function(GamepadHandler, Hero) {
    let game = {
        canvas: document.querySelector('canvas'),
        gamepad: {
            handler: new GamepadHandler()
        },
        foreground: {
            color: "#ffffff",
            opacity: 1
        }
    };

    game.canvas.width = 800;
    game.canvas.height = 400;
    game.context = game.canvas.getContext('2d');

    game.hero = new Hero();
    game.hero.x = game.canvas.width / 2;
    game.hero.y = game.canvas.height / 2;
    game.hero.move = game.hero.velocityMove;
    game.gamepad.handler.onInput(function(config) {
        if(config.axes.l) {
            game.hero.move(config.axes.l);
        }
    });

    function _drawBackground(c) {
        c.clearRect(0, 0, game.canvas.width, game.canvas.height);
        c.fillStyle = '#EEE';
        c.fillRect(0, 0, game.canvas.width, game.canvas.height);
    }

    function gameLoop() {
        requestAnimationFrame(gameLoop);
        _drawBackground(game.context);
        game.hero.update(game.context)
    }

    gameLoop();


});