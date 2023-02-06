"use strict";
let canvas = document.querySelector('canvas');
let c2d;
if (canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    c2d = canvas.getContext('2d');
}
c2d.fillStyle = 'rgba(255,0,0,0,0.5)';
c2d.fillRect(100, 100, 100, 100);
c2d.fillRect(400, 100, 100, 100);
c2d.fillRect(300, 300, 100, 100);
https://www.youtube.com/watch?v=yq2au9EfeRQ&list=PLpPnRKq7eNW3We9VdCfx9fprhqXHwTPXL&index=3