define(['./circle'], function (Circle) {
    class CollideableCircle extends Circle{
        constructor(x, y, size, color, height, mass) {
            super(x, y, size, color, height);
            this.mass = mass || .1;
            this.collisionChecks = [];
            this.timer = 0
        }

        canCollidesWith(t, cb) {
            let check;
            switch (t.shape) {
                case 'square': check = this.isSquareColliding; break;
                case 'circle': check = this.isCircleColliding; break;
            }
            this.collisionChecks.push({target: t, cb: cb, check: check});
        }

        isSquareColliding(t) {
            let deltaX = t.x - Math.max(this.x - this.size / 2, Math.min(t.x, this.x + this.size / 2));
            let deltaY = t.y - Math.max(this.y - this.size / 2, Math.min(t.y, this.y + this.size / 2));
            return (deltaX * deltaX + deltaY * deltaY) < (t.radius * t.radius) && Math.abs(this.z - t.z) < 2;
        }

        isCircleColliding(t) {
            return ((this.x - t.x) * (this.x - t.x) + (this.y - t.y) * (this.y - t.y)) < (this.radius + t.radius) * (this.radius + t.radius);
        }

        correctPosition(t) {
            let direction = {
                x: this.x < t.x ? -1 : 1,
                y: this.y < t.y ? -1 : 1,
            };
            let missingHyp = (t.radius + this.radius) - this.getHypWith(t);
            let xDist = (this.x - t.x);
            let yDist = (this.x - t.x);
            let part = xDist + yDist;
            let xPart = xDist / part;
            let yPart = yDist / part;
            let missingTotal = missingHyp;
            let missingX = xPart * missingTotal;
            let missingY = yPart * missingTotal;
            this.x += missingX * direction.x;
            this.y += missingY * direction.y;

        }

        slipsWith(t) {
            let direction = {
                x: this.x < t.x ? -1 : 1,
                y: this.y < t.y ? -1 : 1,
            };
            let xDist = (this.x - t.x);
            let yDist = (this.x  - t.x);
            let velo = Math.abs(t.velocity.x + t.velocity.y);
            let strengthDif = Math.max((t.strength - this.mass), 0);
            this.velocity.x = xDist / yDist * velo * direction.x * strengthDif;
            this.velocity.y = yDist / xDist * velo * direction.y * strengthDif;

        }

        checkCollisions() {
            this.timer++;
            for(let i = 0; i < this.collisionChecks.length; i++) {
                let t = this.collisionChecks[i].target;
                if(this.collisionChecks[i].check.bind(this)(t)) {
                    this.collisionChecks[i].cb(this);
                }
            }
        }

        update(c) {
            this.checkCollisions();
            super.move();
        }
        draw(c) {
            super.draw(c)
        }
    }
    return CollideableCircle;
});