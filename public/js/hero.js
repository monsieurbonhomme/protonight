define(['./collideable-circle'], function (CollideableCircle, Sparkle, Bullet) {
	class Hero extends CollideableCircle {
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
			this.axes = {
				x: 0,
				y: 0
			};
			this.isShooting = false;
			this.shootTimer = 0;
			this.shootRate = 10;
			this.bullets = [];
		}

		staticMove(axes) {
			this.x += axes[0] * 2;
			this.y += axes[1] * 2;
		}

		move() {
			this.x += this.axes.x * 1.3;
			this.y += this.axes.y * 1.3;
		}

		justCollidedWith(t) {
			switch (t.type) {
				case 'pickup':
					this.size += 1;
					break;
				default:
					break;
			}
		}

		sparkle(c) {
			this.timer++;
			if (this.timer % 1 === 0) {
				this.sparkles.push(new Sparkle(this.x + Math.random() * this.radius - this.radius / 2, this.y + Math.random() * this.radius - this.radius / 2));
			}
			for (let i = this.sparkles.length - 1; i >= 0; i--) {
				let s = this.sparkles[i];
				s.update(c);
				if (s.isDead) {
					this.sparkles.splice(i, 1);
				}
			}
		}

		shoot() {
			if (this.shootTimer % this.shootRate === 0) {
				this.bullets.push(new Bullet(this.x, this.y, this.shootDirection, 1));
			}
		}


	}
	return Hero;
});