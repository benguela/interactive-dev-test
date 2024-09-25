const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);

const FPS = 60;

let dots = [];
let maxSpeed = 10;
let nDots = 100;
let maxSize = 10;

function genHexString(len) {
	const hex = "0123456789ABCDEF";
	let output = "";
	for (let i = 0; i < len; ++i) {
		output += hex.charAt(Math.floor(Math.random() * hex.length));
	}
	return output;
}

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

for (let i = 0; i < nDots; i++) {
	dots.push(
		new Dot(
			Math.random() * width,
			Math.random() * height,
			Math.random() * maxSize,
			Math.random() * maxSpeed
		)
	);
}

// get values from input
document.getElementById("nDots").oninput = function () {
	nDots = this.value;
	const oldDots = dots;
	dots = [];
	for (let i = 0; i < nDots; i++) {
		if (i < oldDots.length) {
			dots.push(oldDots[i]);
		} else {
			dots.push(
				new Dot(
					Math.random() * width,
					Math.random() * height,
					Math.random() * maxSize,
					Math.random() * maxSpeed
				)
			);
		}
	}
};

document.getElementById("maxSpeed").oninput = function () {
	const oldSpeed = maxSpeed;
	maxSpeed = this.value;
	// update speed of all dots
	dots.forEach((dot) => {
		dot.vx = (dot.vx / oldSpeed) * maxSpeed;
		dot.vy = (dot.vy / oldSpeed) * maxSpeed;
	});
};

document.getElementById("maxSize").oninput = function () {
	const oldSize = maxSize;
	maxSize = this.value;
	// update size of all dots
	dots.forEach((dot) => {
		dot.size = (dot.size / oldSize) * maxSize;
	});
};

function update() {
	ctx.clearRect(0, 0, width, height);

	for (let i = 0; i < nDots; i++) {
		const p = dots[i];
		p.update();

		// draw dot
		ctx.fillStyle = p.color;
		ctx.globalAlpha = 1;
		ctx.beginPath();
		ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
		ctx.fill();

		// draw lines between this and other dots
		for (let j = 0; j < nDots; j++) {
			const q = dots[j];
			const dx = p.x - q.x;
			const dy = p.y - q.y;
			const dist = Math.sqrt(dx * dx + dy * dy);
			if (dist < 100) {
				// change opacity based on distance
				ctx.globalAlpha = 1 - dist / 100;

				ctx.beginPath();
				ctx.moveTo(p.x, p.y);
				ctx.lineTo(q.x, q.y);
				ctx.stroke();
			}
		}
	}

	setTimeout(update, 1000 / FPS);
}

update();
