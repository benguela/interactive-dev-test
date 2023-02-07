let canvas = document.querySelector('canvas');
let c2d;

if (canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    c2d =canvas.getContext('2d');

    
}

c2d.fillStyle='rgba(255,0,0,0,0.5)';
c2d.fillRect(100,100,100,100);
c2d.fillRect(400,100,100,100);
c2d.fillRect(300,300,100,100);

let x=Math.random()*innerWidth;
let y=Math.random()*innerHeight;
let velocityX=(Math.random()-0.5)*10;
let velocityY=(Math.random()-0.5)*10;
let circleRadius=30;
function animate(){
    requestAnimationFrame(animate);
    c2d.clearRect(0,0, innerWidth, innerHeight);
    c2d.beginPath();
    c2d.arc(x,y,circleRadius,0, Math.PI*2, false);
    c2d.strokeStyle = 'blue';
    c2d.stroke();

    if(x + circleRadius>innerWidth || x-circleRadius<0){
        velocityX=-velocityX;
    }
    if(y + circleRadius>innerHeight || y-circleRadius<0){
        velocityY=-velocityY;
    }
    //x speed or velocity to ward direction
    x+=velocityX;
    //y speed or velocity to ward direction
    y+=velocityY;
}
animate();