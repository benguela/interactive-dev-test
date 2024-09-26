const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let dots = [];
let speed = 10;
let nDots = 100;
let size = 10;
let hasCollisions = false;
let hasColors = true;

let lineDistance = 100;

let width = (canvas.width = window.innerWidth);
let height = (canvas.height = window.innerHeight);

// split the window into 100px x 100px squares to make it easier to search dots
let grid = [];
let xGrids = Math.ceil(width / lineDistance);
let yGrids = Math.ceil(height / lineDistance);

const IDEAL_FPS = 60;
let FPS = 60;

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

// get values from inputs
document.getElementById("nDots").oninput = function () {
	nDots = parseInt(this.value);
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
					size,
					Math.random() * speed
				)
			);
		}
	}
};

document.getElementById("speed").oninput = function () {
	const oldSpeed = speed;
	speed = parseInt(this.value);
	// update speed of all dots
	dots.forEach((dot) => {
		dot.vx = (dot.vx / oldSpeed) * speed;
		dot.vy = (dot.vy / oldSpeed) * speed;
	});
};

document.getElementById("size").oninput = function () {
	const oldSize = size;
	size = parseInt(this.value);
	// update size of all dots
	dots.forEach((dot) => {
		dot.size = (dot.size / oldSize) * size;
	});
};

document.getElementById("collisions").onchange = function () {
	hasCollisions = this.checked;
};

document.getElementById("colors").onchange = function () {
	hasColors = this.checked;
	dots.forEach((dot) => {
		dot.color = hasColors ? "#" + genHexString(6) : "black";
	});
};

// max line distance is half the width of the canvas
const lineDistanceInput = document.getElementById("lineDistance");
lineDistanceInput.max = width / 2;

document.getElementById("lineDistance").oninput = function () {
	lineDistance = parseInt(this.value);
	resetGrid();
};

// initialize the grid and the dots
function init() {
	for (let i = 0; i < xGrids; i++) {
		grid.push([]);
		for (let j = 0; j < height / lineDistance; j++) {
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

// reset the grid and move dots to random positions if out of bounds
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

// update the grid with the dot positions
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

// update canvas size and grid on resize
window.onresize = function () {
	width = canvas.width = window.innerWidth;
	height = canvas.height = window.innerHeight;

	lineDistanceInput.max = width / 2;
	if (lineDistanceInput.value > width / 2) {
		lineDistanceInput.value = width / 2;
	}

	resetGrid();
};

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

// draw the dots and lines
function draw() {
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

		const x = Math.max(0, Math.floor(p.x / lineDistance));
		const y = Math.max(0, Math.floor(p.y / lineDistance));

		// draw lines between this and other dots, search only the 8 neighbors
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
							// gradient color based on color of the dots
							if (hasColors) {
								const gradient = ctx.createLinearGradient(p.x, p.y, q.x, q.y);
								gradient.addColorStop(0, p.color);
								gradient.addColorStop(1, q.color);
								ctx.strokeStyle = gradient;
							} else {
								ctx.strokeStyle = "black";
							}
							ctx.stroke();
						}

						// if there are collisions, change the speed
						if (hasCollisions) {
							if (dist <= p.size + q.size) {
								q.vx = -q.vx;
								q.vy = -q.vy;
								p.vx = -p.vx;
								p.vy = -p.vy;
							}
						}
					}
				}
			}
		}
	}

	updateGrid();
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
