const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);

const MAX_DOTS = 100;
const MAX_SIZE = 10;
const MAX_SPEED = 10;

const dots = [];

class Dot {
	constructor(x, y, size, speed) {
		this.x = x;
		this.y = y;
		this.size = size;
		this.vx = Math.cos(speed);
		this.vy = Math.sin(speed);
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

for (let i = 0; i < MAX_DOTS; i++) {
	dots.push(
		new Dot(
			Math.random() * width,
			Math.random() * height,
			Math.random() * MAX_SIZE,
			Math.random() * MAX_SPEED
		)
	);
}

function update() {
	ctx.clearRect(0, 0, width, height);

	for (let i = 0; i < MAX_DOTS; i++) {
		const p = dots[i];
		p.update();

		// draw dot
		// ctx.fillStyle = "white";
		ctx.globalAlpha = 1;
		ctx.beginPath();
		ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
		ctx.fill();

		// draw lines between this and other dots
		for (let j = 0; j < MAX_DOTS; j++) {
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

	requestAnimationFrame(update);
}

update();
