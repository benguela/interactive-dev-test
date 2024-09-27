function genHexString(len) {
	const hex = "0123456789ABCDEF";
	let output = "";
	for (let i = 0; i < len; ++i) {
		output += hex.charAt(Math.floor(Math.random() * hex.length));
	}
	return output;
}

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
		this.color = Dot.genColor();
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

	static genColor() {
		return "#" + genHexString(6);
	}
}

window.Dot = Dot;
