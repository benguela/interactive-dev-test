"use strict";
let canvas = document.querySelector('canvas');
let c2d;
const framePerSecond = 60;
let alpha = 0.5;
if (canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    c2d = canvas.getContext('2d');
}
class Circle {
    constructor(x = Math.random() * innerWidth, y = Math.random() * innerHeight, velocityX = (Math.random() - 0.5) * 10, velocityY = (Math.random() - 0.5) * 10, circleRadius = 30) {
        this.x = x;
        this.y = y;
        this.velocityX = velocityX;
        this.velocityY = velocityY;
        this.circleRadius = circleRadius;
    }
    draw(index) {
        //draw circle 1
        c2d.beginPath();
        c2d.arc(this.x, this.y, this.circleRadius, 0, Math.PI * 2, false);
        c2d.strokeStyle = 'blue';
        c2d.stroke();
        c2d.fill();
        c2d.fillStyle = "black";
        if (index > 0) {
            //draw circle 2
            c2d.beginPath();
            c2d.arc(circlesArray[index - 1].x, circlesArray[index - 1].y, circlesArray[index - 1].circleRadius, 0, Math.PI * 2, false);
            c2d.strokeStyle = 'blue';
            c2d.stroke();
            c2d.fill();
            c2d.fillStyle = "black";
            //draw line
            c2d.moveTo(circlesArray[index - 1].x, circlesArray[index - 1].y);
        }
        else {
            c2d.moveTo(this.x, this.y);
        }
        c2d.lineTo(this.x, this.y);
        c2d.strokeStyle = "rgba(72,72,72," + alpha + ")";
        c2d.stroke();
    }
    ;
    update(index) {
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
        if (index > 0) {
            //circle 2
            if (circlesArray[index - 1].x + circlesArray[index - 1].circleRadius > innerWidth || circlesArray[index - 1].x - circlesArray[index - 1].circleRadius < 0) {
                circlesArray[index - 1].velocityX = -circlesArray[index - 1].velocityX;
            }
            if (circlesArray[index - 1].y + circlesArray[index - 1].circleRadius > innerHeight || circlesArray[index - 1].y - circlesArray[index - 1].circleRadius < 0) {
                circlesArray[index - 1].velocityY = -circlesArray[index - 1].velocityY;
            }
            //x speed or velocity to ward direction
            circlesArray[index - 1].x += circlesArray[index - 1].velocityX;
            //y speed or velocity to ward direction
            circlesArray[index - 1].y += circlesArray[index - 1].velocityY;
        }
        this.draw(index);
    }
    ;
}
let circlesArray = [];
for (let i = 0; i < 200; i++) {
    let x = Math.random() * innerWidth;
    let y = Math.random() * innerHeight;
    let velocityX = (Math.random() - 0.5) * 10;
    let velocityY = (Math.random() - 0.5) * 10;
    let circleRadius = (Math.random() * 10) + 5;
    circlesArray.push(new Circle(x, y, velocityX, velocityY, circleRadius));
}
function animate() {
    setTimeout(() => {
        requestAnimationFrame(animate);
    }, 1000 / framePerSecond);
    c2d.clearRect(0, 0, innerWidth, innerHeight);
    for (let i = 0; i < circlesArray.length; i += 2) {
        circlesArray[i].update(i);
    }
    // circlesArray.forEach(function(item,index){
    //     item.update(index);
    // })
}
animate();
