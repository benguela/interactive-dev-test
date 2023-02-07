let canvas = document.querySelector('canvas');
let c2d;

if (canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    c2d = canvas.getContext('2d');


}

// c2d.fillStyle='rgba(255,0,0,0,0.5)';
// c2d.fillRect(100,100,100,100);
// c2d.fillRect(400,100,100,100);
// c2d.fillRect(300,300,100,100);
class Circle {
    x: number;
    y: number;
    velocityX: number;
    velocityY: number;
    circleRadius: number;
    constructor(x: number = Math.random() * innerWidth,
        y: number = Math.random() * innerHeight,
        velocityX: number = (Math.random() - 0.5) * 10,
        velocityY: number = (Math.random() - 0.5) * 10,
        circleRadius: number = 30) {
        this.x = x;
        this.y = y;
        this.velocityX = velocityX;
        this.velocityY = velocityY;
        this.circleRadius = circleRadius;
    }


    draw() {
        c2d.beginPath();
        c2d.arc(this.x, this.y, this.circleRadius, 0, Math.PI * 2, false);
        c2d.strokeStyle = 'blue';
        c2d.stroke();
    };
    update() {
        if (this.x + this.circleRadius > innerWidth || this.x - this.circleRadius < 0) {
            this.velocityX = -this.velocityX;
        }
        if (this.y + this.circleRadius > innerHeight || this.y - this.circleRadius < 0) {
            this.velocityY = -this.velocityY;
        }
        //x speed or velocity to ward direction
        this.x += this.velocityX;
        //y speed or velocity to ward direction
        this.y += this.velocityY;

        this.draw();
    };
}

let circle1 = new Circle(200, 200, 2, 2, 10);
let circle2 = new Circle();
let circlesArray : any[]=[];
for (let i = 0; i < 100; i++) {
    let x = Math.random() * innerWidth;
    let y = Math.random() * innerHeight;
    let velocityX = (Math.random() - 0.5) * 10;
    let velocityY = (Math.random() - 0.5) * 10;
    let circleRadius = 10;
    circlesArray.push(new Circle(x, y, velocityX, velocityY, circleRadius));
}
function animate() {
    requestAnimationFrame(animate);
    c2d.clearRect(0, 0, innerWidth, innerHeight);
    circlesArray.forEach(function(item){
        item.update();
    })
}
animate();


