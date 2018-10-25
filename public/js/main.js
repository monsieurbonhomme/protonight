require.config({
});


require(['./lib/socket', 'constants', 'gamepad', 'hero'], function (Chaussette,constants, GamepadHandler, Hero) {
   var socket = Chaussette.connect();

    /*let game = {
        canvas: document.querySelector('canvas'),
        gamepad: {
            handler: new GamepadHandler()
        },
        state: 'lobby'
    };

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
    for(var i = 0; i < constants.colors.length; i++) {
        $('.js-colors-list').append('<div class="js-color-item" data-value="' + constants.colors[i].value + '"style="border-color: ' + constants.colors[i].value + '; background-color: ' + constants.colors[i].value + '">' + constants.colors[i].name + '</div>')
    }

    function _joinRoom() {
        var color = $('.js-color-item.selected').attr('data-value');
        var name = $('.js-name-input').val();
        // A toi Nico !!! CONNEXION
        socket.emit('join_room', Date.now(), 'protonight');
    }

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
        game.hero.draw(game.context)
    }

    //gameLoop();

});