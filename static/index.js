/* *********************************      Global Definitions       ******************************* */ 

const canvas = new fabric.Canvas('canvas2'); // Reference to canvas element
var deleteIcon = "/SVGs/delete-button.svg"
var cloneIcon =  "/SVGs/copy-button.svg"

var deleteImg = document.createElement('img');
deleteImg.src = deleteIcon;

var clonedImg = document.createElement('img');
cloneIcon.src = cloneIcon;

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
    canvas.remove(target);
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
        var scale = parseFloat(button.getAttribute('scale')) || .3 ;
        fabric.loadSVGFromURL('/SVGs/' + id + '.svg' ,function(object, options ) {
            var objectSVG = fabric.util.groupSVGElements(object, options);
            objectSVG.scale(scale);
            canvas.add(objectSVG);
        })
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