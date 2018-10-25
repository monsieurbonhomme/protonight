define([], function() {
    class Object {
        constructor(x, y, z, width, height, color, depth) {
            this.x = x;
            this.y = y;
            this.z = z;
            this.width = width;
            this.height = height;
            this.opacity = 1;
            this.depth = depth || height;
            this.color = color;
            this.velocity = {
                x: 0,
                y: 0,
                z: 0
            };
            this.fly = false;
        }

        isOutOfScreen() {
            return this.x < 0 || this.x > 2000 || this.y < 0 || this.y > 2000;
        }

        move() {
            this.x += this.velocity.x;
            this.y += this.velocity.y;
            if(!this.fly) {
                this.z = Math.max(0, this.z + this.velocity.z);
            }

            this.velocity.x = this.velocity.x * .9;
            this.velocity.y = this.velocity.y * .9;
            if(this.z > 0) {
                this.velocity.z -= .5;
            }
        }
        draw(c) {
        }
    }
    return Object;
});