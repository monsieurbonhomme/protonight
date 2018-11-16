class Hero {

	constructor(config) {
		this.x = config.x;
		this.y = config.y;
		this.color = config.color;
		this.id = config.id;
		this.axes = {
			x: 0,
			y: 0
		};
		this.isSniper = false;
		this.speed = .4;
		this.size = 20;
		this.boingCompter = 0;
		this.hasBoing = false;
		this.isIdleTimer = 0;
	}

	isIdle() {
		return this.axes.x == 0 && this.axes.y == 0;
	}

	get radius() {
		return this.size / 2;
	}

	move() {
		if (this.isSniper) {
			this.x += this.axes.x * 2;
			this.y += this.axes.y * 2;
		} else {
			if (!this.isSniper) {
				if (this.isIdle()) {
					this.isIdleTimer++;
				} else {
					this.isIdleTimer = 0;
					this.size = Math.max(20, this.size - 0.2);
				}
				if (this.isIdleTimer >= 120) {
					this.size = Math.min(40, this.size + 0.1);
				}
			}

			this.x += this.axes.x * 1.3;
			this.y += this.axes.y * 1.3;
		}
	}

	collidesWith(t) {
		return ((this.x - t.x) * (this.x - t.x) + (this.y - t.y) * (this.y - t.y)) < (this.radius + t.radius) * (this.radius + t.radius);
	}
}

module.exports = Hero;