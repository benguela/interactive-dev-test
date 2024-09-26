/**
 * Dot class
 *
 * @param {number} x - x position
 * @param {number} y - y position
 * @param {number} size - size of the dot
 * @param {number} speed - speed of the dot
 * @returns {Dot}
 * @constructor
 */
class Dot {
	constructor(x, y, size, speed) {
		this.x = x;
		this.y = y;
		this.size = size;
		this.vx = Math.cos(speed);
		this.vy = Math.sin(speed);
		this.color = "#" + genHexString(6);
	}

	update() {
		// keep in bounds
		if (this.x > width || this.x < 0) {
			this.vx *= -1;
		}
		if (this.y > height || this.y < 0) {
			this.vy *= -1;
		}

		this.x += this.vx;
		this.y += this.vy;
	}
}

window.Dot = Dot;
