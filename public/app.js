const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const lineDistance = 100;
const speed = 10;
const nDots = 100;
const size = 5;
let dots = [];

let width = (canvas.width = window.innerWidth);
let height = (canvas.height = window.innerHeight);

// split the window into 100px x 100px squares to make it easier to search dots
let grid = [];
let xGrids = Math.ceil(width / lineDistance);
let yGrids = Math.ceil(height / lineDistance);

let FPS = 60;
const IDEAL_FPS = 60;

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

function resetGrid() {
	grid = [];

	xGrids = Math.ceil(width / lineDistance);
	yGrids = Math.ceil(height / lineDistance);

	for (let i = 0; i <= xGrids; i++) {
		grid.push([]);
		for (let j = 0; j <= yGrids; j++) {
			grid[i].push([]);
		}
	}

	// move dots to random positions if out of bounds of the new grid
	dots.forEach((dot) => {
		if (dot.x > width || dot.y > height) {
			dot.x = Math.random() * width;
			dot.y = Math.random() * height;
		}
	});

	updateGrid();
}

window.onresize = function () {
	width = canvas.width = window.innerWidth;
	height = canvas.height = window.innerHeight;

	resetGrid();
};

function init() {
	for (let i = 0; i < xGrids; i++) {
		grid.push([]);
		for (let j = 0; j < yGrids; j++) {
			grid[i].push([]);
		}
	}

	for (let i = 0; i < nDots; i++) {
		dots.push(
			new Dot(
				Math.random() * width,
				Math.random() * height,
				size,
				Math.random() * speed
			)
		);
	}
}

function updateGrid() {
	for (let i = 0; i < xGrids; i++) {
		for (let j = 0; j < yGrids; j++) {
			grid[i][j] = [];
		}
	}

	dots.forEach((dot) => {
		const x = Math.max(0, Math.floor(dot.x / lineDistance));
		const y = Math.max(0, Math.floor(dot.y / lineDistance));
		grid[x][y].push(dot);
	});
	// log the grid sizes
	let r = "";
	grid.forEach((row) => {
		row.forEach((cell) => {
			r += cell.length + " ";
		});
	});
}

function draw() {
	ctx.clearRect(0, 0, width, height);

	for (let i = 0; i < nDots; i++) {
		const p = dots[i];
		p.update();

		// draw dot
		ctx.fillStyle = "black";
		ctx.globalAlpha = 1;
		ctx.beginPath();
		ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
		ctx.fill();

		const x = Math.max(0, Math.floor(p.x / lineDistance));
		const y = Math.max(0, Math.floor(p.y / lineDistance));

		// draw lines between this and other dots, search only this square and the 8 neighbors
		const xMin = Math.max(0, x - 1);
		const xMax = Math.min(xGrids - 1, x + 1);
		const yMin = Math.max(0, y - 1);
		const yMax = Math.min(yGrids - 1, y + 1);

		// search close grid space for neighbours
		for (let i = xMin; i <= xMax; i++) {
			for (let j = yMin; j <= yMax; j++) {
				const neighbors = grid[i][j];
				for (let k = 0; k < neighbors.length; k++) {
					const q = neighbors[k];
					if (p !== q) {
						const dx = p.x - q.x;
						const dy = p.y - q.y;
						const dist = Math.sqrt(dx * dx + dy * dy);
						if (dist < lineDistance) {
							// change opacity based on distance
							ctx.globalAlpha = 1 - dist / lineDistance;

							ctx.beginPath();
							ctx.moveTo(p.x, p.y);
							ctx.lineTo(q.x, q.y);
							ctx.stroke();
						}
					}
				}
			}
		}
	}

	updateGrid();
}

// frame rate
let lastTime = 0;
let frame = 0;
function updateFrameRate() {
	const now = performance.now();
	const elapsed = now - lastTime;
	lastTime = now;

	const fps = 1000 / elapsed;

	if (fps < IDEAL_FPS - 1) {
		FPS++;
	} else if (fps > IDEAL_FPS + 1) {
		FPS--;
	}

	frame++;
	if (frame > FPS / 2) {
		frame = 0;
		document.getElementById("fps").innerText = fps.toFixed(2);
		if (fps < IDEAL_FPS) {
			document.getElementById("fps").style.color = "red";
		} else {
			document.getElementById("fps").style.color = "black";
		}
	}
}

// main loop
function update() {
	draw();
	updateFrameRate();
	// requestAnimationFrame(update);
	setTimeout(update, 1000 / FPS);
}

// initialize and start the main loop
init();
update();
