// import {fabric} from 'fabric'
// var fabric = require('fabric')
var canvas = this.__canvas = new fabric.Canvas('c');
// create a rect object
var deleteIcon = "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg version='1.1' id='Ebene_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='595.275px' height='595.275px' viewBox='200 215 230 470' xml:space='preserve'%3E%3Ccircle style='fill:%23F44336;' cx='299.76' cy='439.067' r='218.516'/%3E%3Cg%3E%3Crect x='267.162' y='307.978' transform='matrix(0.7071 -0.7071 0.7071 0.7071 -222.6202 340.6915)' style='fill:white;' width='65.545' height='262.18'/%3E%3Crect x='266.988' y='308.153' transform='matrix(0.7071 0.7071 -0.7071 0.7071 398.3889 -83.3116)' style='fill:white;' width='65.544' height='262.179'/%3E%3C/g%3E%3C/svg%3E";

var img = document.createElement('img');
img.src = deleteIcon;

fabric.Object.prototype.transparentCorners = false;
fabric.Object.prototype.cornerColor = 'blue';
fabric.Object.prototype.cornerStyle = 'circle';

// tool flags
var mode = null;
const modes = {
  wall: 'wall',
  door: 'door',
  window: 'window',
}

var grid = 50;

// create grid

var canvasWidth = canvas.getWidth();
var canvasHeight = canvas.getHeight();
console.log("==CanvasWidth:", canvasWidth)
console.log("==CanvasHeight:", canvasHeight)

for (var i = 0; i < (canvasWidth / grid); i++) {
  canvas.add(new fabric.Line([i * grid, 0, i * grid, canvasHeight], {
    stroke: '#ccc',
    selectable: false
  }));
}
for (var i = 0; i < (canvasHeight / grid); i++) {
  canvas.add(new fabric.Line([0, i * grid, canvasWidth, i * grid], {
    stroke: '#ccc',
    selectable: false
  }))
}

function Add() {
var rect = new fabric.Rect({
  left: 100,
  top: 50,
  fill: 'yellow',
  width: 200,
  height: 100,
  objectCaching: false,
  stroke: 'lightgreen',
  strokeWidth: 9,
});

canvas.add(rect);
canvas.setActiveObject(rect);
}

fabric.Object.prototype.controls.deleteControl = new fabric.Control({
x: 0.5,
y: -0.5,
offsetY: 16,
cursorStyle: 'pointer',
mouseUpHandler: deleteObject,
render: renderIcon,
cornerSize: 24
});

Add();

function deleteObject(eventData, transform) {
    var target = transform.target;
    var canvas = target.canvas;
        canvas.remove(target);
    canvas.requestRenderAll();
}

function renderIcon(ctx, left, top, styleOverride, fabricObject) {
var size = this.cornerSize;
ctx.save();
ctx.translate(left, top);
ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
ctx.drawImage(img, -size/2, -size/2, size, size);
ctx.restore();
}

var firstWall = true; 

function drawWall(){
  // if (mode === modes.wall){
  //   mode = null;
  // } else {
  //   mode = modes.wall;

  // }
  // var pointer = canvas.getPointer(e);
  // var posX = pointer.x;
  // var posY = pointer.y;
  // start = new fabric.Circle({
  //   radius: 10, 
  //   fill: black,

  // })

  if (mode === modes.wall){
    mode = null;
  } else {
    mode = modes.wall;
    firstWall = true;
  }
  console.log(mode);

}

function drawEndpoint(event){
  console.log(event)
  var pointer = canvas.getPointer(event);
  var posX = pointer.x;
  var posY = pointer.y;
  var radius = 10
  console.log(posX, posY)
  endpoint = new fabric.Circle({
    radius: radius, 
    fill: 'green',
    left: posX - (radius),
    top: posY - (radius),

  })
  canvas.add(endpoint)
  return {posX, posY}
}

// canvas.on('mouse:down', (event) => drawEndpoint(event))
// canvas.on('mouse:up', (event) => drawEndpoint(event))

// var start = canvas.on('mouse:down', (event) => drawEndpoint(event))
// var end = canvas.on('mouse:up', (event) => drawEndpoint(event))
// console.log(start)
// console.log(end)

// canvas.add(new fabric.Line([start.posX, start.posY, end.posX, end.posY], {
//   stroke: 'red'
// }))

// from http://fabricjs.com/stickman demo 

// function makeCircle(left, top, line1, line2, line3, line4) {
//   var c = new fabric.Circle({
//     left: left,
//     top: top,
//     strokeWidth: 5,
//     radius: 12,
//     fill: '#fff',
//     stroke: '#666'
//   });
//   c.hasControls = c.hasBorders = false;

//   c.line1 = line1;
//   c.line2 = line2;
//   c.line3 = line3;
//   c.line4 = line4;

//   return c;
// }

// function makeLine(coords) {
//   return new fabric.Line(coords, {
//     fill: 'red',
//     stroke: 'red',
//     strokeWidth: 5,
//     selectable: false,
//     evented: false,
//   });
// }

var prevCircle = null;

function linkCircle(e, circle, prevCircle){
  var line = new fabric.Line([
    prevCircle.left + circle.radius, 
    prevCircle.top + circle.radius,
    circle.left + circle.radius,
    circle.top + circle.radius,
  ],{
    fill: 'red',
    stroke: 'red',
    strokeWidth: '8',
    selectable: false,
    evented: false,
  });
  // circle.lineTo = prevCircle.lineFrom;
  prevCircle.lineFrom = line;
  canvas.add(line);
  return line; 
}

function makeCircle(e, prevCircle){
    var radius = 8;
    var pointer = canvas.getPointer(e);
    var x = pointer.x;
    var y = pointer.y;
    var circle = new fabric.Circle({
      radius: radius,
      top: y - radius,
      left: x - radius,
      strokeWidth: 3,
      fill: '#fff',
      stroke: '666',
    })
    circle.hasControls = circle.hasBorders = false;
    circle.prev = prevCircle;
    circle.next = null; 
    circle.lineFrom = null;
    // circle.lineTo = prevCircle.lineFrom;

    return circle;

}

canvas.on('mouse:up', (e) => {
  console.log(e);
  console.log("target: ", e.target);
  if (e.target){console.log("type: ", e.target.type)}
  if (mode === modes.wall){
    console.log("==firstWall: ", firstWall)
    if (firstWall === true){
      prevCircle = null;
    }

    // drawEndpoint(e);
    var x = e.pointer.x;
    var y = e.pointer.y;
    console.log("x: ", x, "y: ", y);
    console.log(prevCircle);
    var circle = makeCircle(e, prevCircle);

    if(e.target != null && e.target.type === 'circle'){
      // var line = linkCircle(e, prevCircle, e.target);
      // e.target.lineTo = line;
      var line = linkCircle(e, e.target, prevCircle);
      if (firstWall === true){
        prevCircle = e.target;
      } else {
        e.target.lineTo = line;
        prevCircle.lineFrom = line; 
      }
    } else if (prevCircle != null){
      prevCircle.next = circle
      var line = linkCircle(e, circle, prevCircle);
      circle.lineTo = line; 
      prevCircle.lineFrom = line;
      prevCircle = circle; 
      canvas.add(circle);
      // var line = linkCircle(e, circle, prevCircle);
      // circle.lineTo = line;
      // prevCircle.lineFrom = line; 
    } else {
      console.log("prevCircle: ", prevCircle);
      prevCircle = circle;
      console.log(circle);
      canvas.add(circle);
    }
    firstWall = false;
    canvas.renderAll();
  }
})

canvas.on('object:moving', (e) => {
  var o = e.target;
  if (o.type != null && o.type === 'circle'){
    var radius = o.radius;
    if (o.lineTo != null){
      o.lineTo.set({'x2': o.left + radius, 'y2': o.top + radius})
    }
    if (o.lineFrom != null){
      o.lineFrom.set({'x1': o.left + radius, 'y1': o.top + radius})
    }
  }
}
)