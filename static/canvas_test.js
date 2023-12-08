// import {fabric} from 'fabric'
// var fabric = require('fabric')
var canvas = this.__canvas = new fabric.Canvas('c');
canvas.preserveObjectStacking = true;
// create a rect object
var deleteIcon = "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg version='1.1' id='Ebene_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='595.275px' height='595.275px' viewBox='200 215 230 470' xml:space='preserve'%3E%3Ccircle style='fill:%23F44336;' cx='299.76' cy='439.067' r='218.516'/%3E%3Cg%3E%3Crect x='267.162' y='307.978' transform='matrix(0.7071 -0.7071 0.7071 0.7071 -222.6202 340.6915)' style='fill:white;' width='65.545' height='262.18'/%3E%3Crect x='266.988' y='308.153' transform='matrix(0.7071 0.7071 -0.7071 0.7071 398.3889 -83.3116)' style='fill:white;' width='65.544' height='262.179'/%3E%3C/g%3E%3C/svg%3E";

var ppi = 5 // Pixles per inch

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

function createGrid(){
  var canvasWidth = canvas.getWidth();
  var canvasHeight = canvas.getHeight();
  console.log("==CanvasWidth:", canvasWidth)
  console.log("==CanvasHeight:", canvasHeight)

  // gridGroup = new fabric.Group(); 
  for (var i = 0; i < (canvasWidth / grid); i++) {
    canvas.add(new fabric.Line([i * grid, 0, i * grid, canvasHeight], {
      stroke: '#ccc',
      selectable: false,
      preserveObjectStacking: true,
    }));
  }
  for (var i = 0; i < (canvasHeight / grid); i++) {
    canvas.add(new fabric.Line([0, i * grid, canvasWidth, i * grid], {
      stroke: '#ccc',
      selectable: false
    }))
  }
}
createGrid();

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

function addSVG(){
fabric.loadSVGFromURL('./lib/svg/bed.svg', function(objects, options) {
  var obj = fabric.util.groupSVGElements(objects, options);
  obj.scale(2);
  obj.left = 100;
  obj.top = 100;
  console.log(obj)
  canvas.add(obj);
});
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

// Add();

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

var prevCircle = null;

function lineMidpoint(line){
  var x = (line.x1 + line.x2) /2;
  var y = (line.y1 + line.y2) /2; 
  return [x, y];
}
function lineLength(line){
  var length = (((line.x1 + line.x2)/2)^2+((line.y1 + line.y2)/2)^2)^0.5
  length = length/ppi; 
  return length;
}

function updateDimPos(line){
  var midpoint = lineMidpoint(line);
  var length = lineLength(line).toString();
  length = length + '"'
  line.dim.set({
    left: midpoint[0],
    top: midpoint[1],
    text: length,
  })
}

function linkCircle(e, circle, prevCircle){
  console.log("linkCircle");
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

  var length = (((line.x1 + line.x2)/2)^2+((line.y1 + line.y2)/2)^2)^0.5
  var midPoint = lineMidpoint(line);

  console.log("==Midpoint", midPoint)
  console.log('==Length: ', length);

  var dim = new fabric.Text(length.toString(), {
    fontSize: 10, 
    left: midPoint[0],
    top: midPoint[1],
    selectable: false,
  })

  // var lineGroup = new fabric.Group([line, dim],{
  //   selectable: false,

  // })
  line.dim = dim;
  updateDimPos(line);
  // circle.lineTo = prevCircle.lineFrom;
  prevCircle.lineFrom = line;
  canvas.add(line);
  canvas.add(line.dim);
  // console.log(line.group);
  // line.sendToBack(); 
  circle.bringToFront();
  prevCircle.bringToFront();
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

    // Do I just need to make it so you can only ever have one set of lines
    // Like you can't connect more lines you just have to add to what you already have?

    // drawEndpoint(e);
    var x = e.pointer.x;
    var y = e.pointer.y;
    console.log("x: ", x, "y: ", y);
    console.log(prevCircle);
    var circle = makeCircle(e, prevCircle);

    if(e.target != null && e.target.type === 'circle'){
      // var line = linkCircle(e, prevCircle, e.target);
      // e.target.lineTo = line;
      // var line = linkCircle(e, e.target, prevCircle);
      if (firstWall === true){
        // var line = linkCircle(e, e.target, circle);
        // prevCircle = e.target;
        // prevCircle.lineTo = prevCircle.lineFrom;
      } else {
        var line = linkCircle(e, e.target, prevCircle);
        e.target.lineTo = line;
        prevCircle.lineFrom = line; 
      }
    } else if (prevCircle != null){
      prevCircle.next = circle
      var line = linkCircle(e, circle, prevCircle);
      circle.lineTo = line; 
      prevCircle.lineFrom = line;
      prevCircle = circle; 
      // firstWall = false;
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
    // canvas.preserveObjectStacking = false;
    // circle.bringToFront();
    // canvas.preserveObjectStacking = true;
    // canvas.bringToFront(circle);
    canvas.renderAll();
  }
})



canvas.on('object:moving', (e) => {
  var o = e.target;
  console.log("Dragging Object:", o)
  if (o.type != null && o.type === 'circle'){
    console.log("___Dragging Circle");
    var radius = o.radius;
    if (o.lineTo != null){
      console.log("Setting lineTo end");
      o.lineTo.set({'x2': o.left + radius, 'y2': o.top + radius})
      updateDimPos(o.lineTo)
    }
    if (o.lineFrom != null){
      console.log("Setting lineFrom end")
      o.lineFrom.set({'x1': o.left + radius, 'y1': o.top + radius})
      updateDimPos(o.lineFrom)
    }
  }
}
)

function clearAll(){
  canvas.clear();
  createGrid();
}