define(['object'], function (Object) {
    class Circle extends Object {
        constructor(x, y, size, color, depth) {
            super(x, y, 0, size, size, color, depth);
            this.size = size;
            this.shape = 'circle';
        }

        get radius() {
            return this.size / 2;
        }

        getHypWith(t) {
            return Math.sqrt((t.x - this.x) * (t.x - this.x) + (t.y - this.y) * (t.y - this.y));
        }

        move() {
            super.move();
        }
        draw(c) {
            super.draw(c);
            c.fillStyle = this.color;
            c.globalAlpha = this.opacity;
            c.beginPath();
            c.arc(this.x, this.y - this.z, this.radius, 0, 2 * Math.PI, false);
            c.fill();
            c.shadowColor = 'transparent';
            c.shadowBlur = 0;
            c.shadowOffsetX = 0;
            c.shadowOffsetY = 0;
            c.globalAlpha = 1;
        }
    }

    return Circle;
});