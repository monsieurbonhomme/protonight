define(['object'], function(Object) {
    class Sniper extends Object{
        constructor() {
            super(400, 200, 0, 10, 10, '#FF4136', 0)
            this.x = 400;
            this.y = 200;
            this.speed = .2;
            this.color = '#FF4136';
            this.size = 20;
            this.weigth = 2;
            this.holeSize = 10;
            this.velocity = {
                x: 0,
                y: 0
            }
        }

        move(axes) {
            super.move();
            this.velocity.x += axes[0] * this.speed;
            this.velocity.y += axes[1] * this.speed;
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