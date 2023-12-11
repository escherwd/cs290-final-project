/* *********************************      Global Definitions       ******************************* */ 

const canvas = new fabric.Canvas('c'); // Reference to canvas element
var deleteIcon = "/SVGs/delete-button.svg"
var cloneIcon =  "/SVGs/copy-button.svg"

canvas.selection = false;

var deleteImg = document.createElement('img');
deleteImg.src = deleteIcon;

var clonedImg = document.createElement('img');
cloneIcon.src = cloneIcon;

// For adding dimensions to objects and walls
var ppi = 4 // Pixles per inch
var dimTextSize = 10;

var firstWall = true; 
var mode = null;
const modes = {
  wall: 'wall',
  door: 'door',
  window: 'window',
}

const palletteElements = document.querySelectorAll(".pallette-grid"); // gets all elements w/ buttons that are rendered
for(const element of palletteElements){ // adds event listeners to all layout and object buttons 
    console.log("== palletteElements:" + element);
    for(const child of element.children) {
        child.addEventListener("click", createObject);
    }
}

// const menuSaveButton = document.getElementById("menu-save-button")
// menuSaveButton.addEventListener('click', saveButtonHandler)

const resetButton = document.getElementById("reset-button")
resetButton.addEventListener("click", resetButtonHandler)

const pdfExportButton = document.getElementById("export-pdf-button")
pdfExportButton.addEventListener("click", generatePDF)

const jpegExportButton = document.getElementById("export-jpeg-button")
jpegExportButton.addEventListener('click', exportJPEG , false)

/* *********************************              Base Functionality / Object Prototypes            ******************************* */ 


fabric.Object.prototype.transparentCorners = false; // no transparent corners
fabric.Object.prototype.cornerStyle = "circle"; // circle corners so it's visible to users
fabric.Object.prototype.cornerColor = "blue"; // circles are blue

fabric.Object.prototype.controls.deleteControl = new fabric.Control({
    x: 0.5,
    y: -0.5,
    offsetY: -16,
    offsetX: 16,
    cursorStyle: 'pointer',
    mouseUpHandler: deleteObject,
    render: renderIcon(deleteImg),
    cornerSize: 24 
});

function renderIcon(icon) {
    return function renderIcon(ctx, left, top, styleOverride, fabricObject) {
        var size = this.cornerSize;
        ctx.save();
        ctx.translate(left, top);
        ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
        ctx.drawImage(icon, -size/2, -size/2, size, size);
        ctx.restore();
    }
}

function deleteObject(eventData, transform) {
    var target = transform.target;
    var canvas = target.canvas;
    // if (target === )
    canvas.remove(target);
    canvas.remove(target.widthDim);
    canvas.remove(target.heightDim);
    canvas.requestRenderAll();
}

/* *********************************      Tool Ribbon Place Implementation       ******************************* */ 


// None as of right now, no buttons are actually useful or implementable.


/* *********************************      Insert Objects Implementation       ******************************* */ 


function createObject(event){
    var button = event.target.closest('button'); // checks if clicked element or it's closest ancestor is button
    if(button){
        var id = button.id
        console.log("== object ID: ", id)
        if (id === "create-wall"){
            drawWall();
        } else {
            mode = null;
            var scale = parseFloat(button.getAttribute('scale')) || .3 ;
            fabric.loadSVGFromURL('/SVGs/' + id + '.svg' ,function(object, options ) {
            var objectSVG = fabric.util.groupSVGElements(object, options);
            objectSVG.scale(scale);
            giveDimensions(objectSVG);
            objectSVG.top = 100; 
            objectSVG.left = 100;
            canvas.add(objectSVG);
        })
        }
    }
    
}

/* *********************************            Menu Implementation              ******************************* */ 

function saveButtonHandler() {
    // this might end up being too much, current work towards this is happening in storage.js 

}

function resetButtonHandler(event) {
    // Clears canvas entirely
    canvas.clear();
}

function generatePDF() {
   // Create a jsPDF instance
    var pdf = new jsPDF({
    orientation: 'landscape' // fits the orientation of the canvas better 
    });

    // Get the canvas content as an image data URL
    var imgData = canvas.toDataURL('image/png');

    var scale = pdf.internal.pageSize.getWidth() / canvas.width; // scales so entire canvas content fits 
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width * scale, canvas.height * scale);

    // Save the PDF with a specified filename
    pdf.save('canvas.pdf');
}

function exportJPEG(event){
    // Export canvas as JPEG
    var a = document.createElement('a') // create anchor element 
    var dataURL = canvas.toDataURL({ // get data URL as png img
        format: 'jpeg',
        quality: 1,
    })
    a.href = dataURL // set href attribute 
    a.download = 'layoutplan.jpeg' // set download name 
    a.click() // trigger click to start download
    
}

/* Below is from Canvas_test */

function scaleDimension(dim){
    var scaledDim = dim / ppi; 
    scaledDim = scaledDim.toString();
    scaledDim = Math.round(scaledDim);
    scaledDim = scaledDim + '"';
    return scaledDim; 
  }
  
function giveDimensions(object){
var width = object.getScaledWidth();
var scaledWidth = scaleDimension(width)
var height = object.getScaledHeight();
var scaledHeight = scaleDimension(height);

var widthDim = new fabric.Text(scaledWidth, {
    fontSize: dimTextSize,
    left: object.left + width/2,
    top: object.top + height + 15,
    selectable: false,
})

object.widthDim = widthDim;
canvas.add(widthDim);

var heightDim = new fabric.Text(scaledHeight, {
    fontSize: dimTextSize, 
    left: object.left - 15,
    top: object.top + (height / 2),
    angle: 90, 
    selectable: false,
})
object.heightDim = heightDim;
canvas.add(heightDim); 

}
  
  function updateDimensions(object){
    var width = object.getScaledWidth();
    var scaledWidth = scaleDimension(width)
    var height = object.getScaledHeight();
    var scaledHeight = scaleDimension(height);
   
    // width = width.toString();
    object.widthDim.set({
      text: scaledWidth,
      left: object.left + width/2,
      top: object.top + height + 15,
    })
  
    object.heightDim.set({
      text: scaledHeight, 
      left: object.left - 15,
      top: object.top + (height / 2),
    })
  }
  
  function rotateDimensions(object){
    var width = object.getScaledWidth();
    var scaledWidth = scaleDimension(width)
    var height = object.getScaledHeight();
    var scaledHeight = scaleDimension(height);
  
    var theta = object.angle;
    var alpha = 90 - theta;
    var thetaRads = theta * Math.PI/180;
    var alphaRads = alpha * Math.PI/180;
  
    var xw = object.left + (height + 15)* Math.sin(-thetaRads) + (width /2)* Math.sin(alphaRads); 
    var yw = object.top + (height + 15) * Math.cos(-thetaRads) + (width /2) * Math.cos(alphaRads);
    
    var xh = object.left - ((height/2) * Math.sin(thetaRads) + 15 * Math.cos(thetaRads));
    var yh = object.top + ((height/2) * Math.cos(thetaRads) - 15 * Math.sin(thetaRads)); 
  
    width = width.toString();
    object.widthDim.set({
      text: scaledWidth, 
      top: yw,
      left: xw,
      angle: theta,
    })
  
    object.heightDim.set({
      text: scaledHeight,
      top: yh,
      left: xh,
      angle: theta + 90, 
    })
  }

  function drawWall(){
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
  var difX = Math.abs(line.x1 - line.x2);
  var difY = Math.abs(line.y1 - line.y2); 
  console.log("=difX: ", difX, difX**2, "=difY: ", difY)
  var length = Math.sqrt(difX**2 + difY**2)
  console.log("==Length: ", length);
  length = length/ppi; 
  return length;
}

function updateDimPos(line){
  var midpoint = lineMidpoint(line);
  var length = Math.round(lineLength(line));
  length = length.toString();
  length = length + '"'
  line.dim.set({
    left: midpoint[0],
    top: midpoint[1],
    text: length,
  })
}

function createWall(circle, prevCircle){
    console.log('***Creating wall');
    var line = new fabric.Line(
        [
            prevCircle.left + circle.radius, 
            prevCircle.top + circle.radius,
            circle.left + circle.radius, 
            circle.top + circle.radius
        ] , {
            fill: 'black',
            stroke: 'black',
            strokeWidth: '8',
            selectable: false,
            // evented: false, 
        }
    )
    line.length = lineLength(line);
    line.midpoint = lineMidpoint(line);
    line.dim = new fabric.Text(length.toString(), {
        fontSize: dimTextSize, 
        left: line.midpoint[0],
        top: line.midpoint[1],
        selectable: false,
        backgroundColor: 'white',
        borderColor: 'red',
      })
    prevCircle.lineFrom = line;
    circle.lineTo = line; 
    canvas.add(line);
    canvas.add(line.dim);
    updateDimPos(line);
    circle.bringToFront();
    prevCircle.bringToFront();
    console.log("New Wall: ", line);
    return line;
}

function createEndpoint(e, prevCircle){
    console.log('***Creating endpoint')
    var radius = 8;
    var x = e.pointer.x;
    var y = e.pointer.y;
    var circle = new fabric.Circle({
        radius: radius,
        top: y - radius,
        left: x - radius,
        strokeWidth: 3,
        fill: '#fff',
        stroke: '666',
        hasControls: false,
        hasBorders: false,
        type: 'wallNode',
    })
    circle.prev = prevCircle;
    circle.next = null;
    circle.lineFrom = null;
    circle.lineTo = null;
    // canvas.add(circle);
    return circle;
}

canvas.on('mouse:up', (e) => {
    console.log('==Target: ', e.target);
    if (mode === modes.wall){
        if (firstWall === true){
            prevCircle = null;
        }

        var circle = createEndpoint(e, prevCircle);
        if(e.target != null && e.target.type === 'wallNode'){
            if (firstWall === true){
                // Do nothing here but don't want to do the next in this if else chain
            } else if (e.target.prev === null){
                var line = createWall(e.target, prevCircle);
                e.target.lineTo = line; 
                prevCircle.lineFrom = line;
                firstWall = true;
            } else if (e.target.next === null){
                // var line = createWall(e.target, prevCircle);
                // e.target.lineFrom = line;
            }
        } else if (prevCircle != null){
            console.log('***Prev not null: ', prevCircle);
            prevCircle.next = circle;
            canvas.add(circle);
            createWall(circle, prevCircle);
            prevCircle = circle; 
            firstWall = false; 
        } else {
            console.log("prev is null", prevCircle);
            canvas.add(circle);
            prevCircle = circle;
            firstWall = false;
        }
    }
})

function linkCircle(e, circle, prevCircle){
  console.log("linkCircle");
  var line = new fabric.Line(
    [
    prevCircle.left + circle.radius, 
    prevCircle.top + circle.radius,
    circle.left + circle.radius,
    circle.top + circle.radius,
  ]
// [prevCircle.left, prevCircle.top, circle.left, circle.top]
  ,{
    fill: 'black',
    stroke: 'black',
    strokeWidth: '8',
    selectable: false,
    evented: false,
    left: prevCircle.left,
    top: prevCircle.top, 
  });

  var length = (((line.x1 + line.x2)/2)^2+((line.y1 + line.y2)/2)^2)^0.5
  var midPoint = lineMidpoint(line);

  console.log("==Midpoint", midPoint)
  console.log('==Length: ', length);

  var dim = new fabric.Text(length.toString(), {
    fontSize: dimTextSize, 
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

// canvas.on('mouse:up', (e) => {
//   console.log(e);
//   console.log("target: ", e.target);
//   if (e.target){console.log("type: ", e.target.type)}
//   if (mode === modes.wall){
//     console.log("==firstWall: ", firstWall)
//     if (firstWall === true){
//       prevCircle = null;
//     } 

//     // Do I just need to make it so you can only ever have one set of lines
//     // Like you can't connect more lines you just have to add to what you already have?

//     // drawEndpoint(e);
//     var x = e.pointer.x;
//     var y = e.pointer.y;
//     console.log("x: ", x, "y: ", y);
//     console.log(prevCircle);
//     var circle = makeCircle(e, prevCircle);

//     if(e.target != null && e.target.type === 'circle'){
//       // var line = linkCircle(e, prevCircle, e.target);
//       // e.target.lineTo = line;
//       // var line = linkCircle(e, e.target, prevCircle);
//       if (firstWall === true){
//         // var line = linkCircle(e, e.target, circle);
//         // prevCircle = e.target;
//         // prevCircle.lineTo = prevCircle.lineFrom;
//       } else {
//         // var line = linkCircle(e, e.target, prevCircle);
//         var line = createWall(e.target, prevCircle);
//         e.target.lineTo = line;
//         prevCircle.lineFrom = line; 
//       }
//     } else if (prevCircle != null){
//         prevCircle.next = circle
//         //   var line = linkCircle(e, circle, prevCircle);
//         var line = createWall(circle, prevCircle);
//         circle.lineTo = line; 
//         prevCircle.lineFrom = line;
//         prevCircle = circle; 
//         // firstWall = false;
//         canvas.add(circle);
//         // var line = linkCircle(e, circle, prevCircle);
//         // circle.lineTo = line;
//         // prevCircle.lineFrom = line; 
//     } else {
//         console.log("prevCircle: ", prevCircle);
//         prevCircle = circle;
//         console.log(circle);
//         canvas.add(circle);
//     }
//     firstWall = false;
//     // canvas.preserveObjectStacking = false;
//     // circle.bringToFront();
//     // canvas.preserveObjectStacking = true;
//     canvas.bringToFront(prevCircle);
//     canvas.bringToFront(circle);
//     canvas.renderAll();
//   }
// })



canvas.on('object:moving', (e) => {
  var o = e.target;
  console.log("Dragging Object:", o)

  if (o.type != null && o.type === 'wallNode'){
    console.log("___Dragging Circle");
    var radius = o.radius;
    if (o.lineTo != null){
        console.log("Setting lineTo end");
        o.lineTo.set({'x2': (o.left + radius), 'y2': (o.top + radius)})
        console.log("passedValue: ",o.left+radius, "actual: ", o.lineTo.x2)
        updateDimPos(o.lineTo)
    }
    if (o.lineFrom != null){
      console.log("Setting lineFrom end")
      o.lineFrom.set({'x1': (o.left + radius), 'y1': (o.top + radius)})
      updateDimPos(o.lineFrom)
    }
  } else if (o.type != null){
        rotateDimensions(o);
  }
}
)

canvas.on('object:scaling', (e) => {
    var o = e.target; 
    rotateDimensions(o);
})

canvas.on('object:rotating', (e) => {
    rotateDimensions(e.target);
})

// var testLine = new fabric.Line([
//     100, 100, 400, 400], {
//         strokeWidth: '10',
//         fill: 'black',
//         stroke: 'black',
//     })

// canvas.add(testLine)
// canvas.bringToFront(testLine)
// console.log(testLine)
// canvas.renderAll()

// var rect = new fabric.Rect({
//     left: 100,
//     top: 50,
//     fill: 'yellow',
//     width: 200,
//     height: 100,
//     objectCaching: false,
//     stroke: 'lightgreen',
//     strokeWidth: 9,
//   });

// canvas.add(rect)