define(['object'], function(Object) {
    class Sniper extends Object{
        constructor(config) {
            super(config.x, config.y, 20, config.color, 5);
			this.speed = .4;
			this.id = config.id;
            this.strength = 1;
            this.sparkles = [];
            this.timer = 0;
            this.shootDirection = {
                x: 1,
                y: 0
            };
            this.axes = {x: 0, y: 0};
            this.shootTimer = 0;
            this.shootRate = 10;
			this.bullets = [];

			this.color = '#FF4136';
			this.size = 20;
			this.weigth = 2;
			this.holeSize = 10;
			this.isSniper = true;
			this.isShooting = false;
        }


        move() {
        	this.x += this.axes.x * 2;
        	this.y += this.axes.y * 2;
        }

        draw(c) {
            c.fillStyle = this.color;
            c.fillRect(this.x - this.size - this.holeSize / 2, this.y - this.weigth / 2, this.size, this.weigth);
            c.fillRect(this.x + this.holeSize / 2, this.y - this.weigth / 2, this.size, this.weigth);
            c.fillRect(this.x - this.weigth / 2, this.y - this.size - this.holeSize / 2, this.weigth, this.size);
            c.fillRect(this.x - this.weigth / 2, this.y + this.holeSize / 2, this.weigth, this.size);
        }

        update(c) {
            this.draw(c)
        }
    }
    return Sniper;
});