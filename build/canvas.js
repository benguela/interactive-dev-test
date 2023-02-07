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
        let randomColor = this.sendRandomColor();
        //draw circle 1
        c2d.beginPath();
        c2d.arc(this.x, this.y, this.circleRadius, 0, Math.PI * 2, false);
        c2d.strokeStyle = "rgba(" + randomColor + "," + randomColor + "," + randomColor + ",1)";
        c2d.stroke();
        c2d.fill();
        c2d.fillStyle = "rgba(" + randomColor + "," + randomColor + "," + randomColor + ",1)";
        if (index > 0) {
            //draw circle 2
            c2d.beginPath();
            c2d.arc(circlesArray[index - 1].x, circlesArray[index - 1].y, circlesArray[index - 1].circleRadius, 0, Math.PI * 2, false);
            c2d.strokeStyle = "rgba(" + randomColor + "," + randomColor + "," + randomColor + ",1)";
            c2d.stroke();
            c2d.fill();
            c2d.fillStyle = "rgba(" + randomColor + "," + randomColor + "," + randomColor + ",1)";
            //draw line
            c2d.moveTo(circlesArray[index - 1].x, circlesArray[index - 1].y);
        }
        else {
            c2d.moveTo(this.x, this.y);
        }
        c2d.lineTo(this.x, this.y);
        c2d.strokeStyle = "rgba(" + randomColor + "," + randomColor + "," + randomColor + "," + this.calculateCircleAlpha(index) + ")";
        c2d.stroke();
    }
    ;
    sendRandomColor() {
        return Math.floor(Math.random() * 255) + 1;
    }
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
    calculateCircleAlpha(index) {
        let myNumberString = "0";
        let finalAlpha = +myNumberString;
        if (index > 0) {
            let theYspace = Math.abs(circlesArray[index - 1].y - circlesArray[index].y);
            let theXspace = Math.abs(circlesArray[index - 1].x - circlesArray[index].x);
            let theDistance = Math.abs(theYspace - theXspace);
            if (theDistance < 200) {
                finalAlpha = 1;
            }
            else {
                finalAlpha = parseInt((theDistance / innerWidth).toFixed(3));
            }
        }
        if (finalAlpha < 0.3) {
            finalAlpha = 0.3;
        }
        return finalAlpha;
    }
}
let circlesArray = [];
for (let i = 0; i < 200; i++) {
    let x = Math.random() * innerWidth;
    let y = Math.random() * innerHeight;
    let velocityX = (Math.random() - 0.5) * 10;
    let velocityY = (Math.random() - 0.5) * 10;
    let circleRadius = (Math.random() * 8) + 2;
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
