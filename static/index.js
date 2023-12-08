/* *********************************      Global Definitions       ******************************* */ 

const canvas = new fabric.Canvas('canvas2'); // Reference to canvas element

fabric.Object.prototype.transparentCorners = false; // no transparent corners
fabric.Object.prototype.cornerStyle = "circle"; // circle corners so it's visible to users
fabric.Object.prototype.cornerColor = "blue"; // circles are blue

const palletteElements = document.querySelectorAll(".pallette-grid"); // gets all elements w/ buttons that are rendered
for(const element of palletteElements){
    console.log("== palletteElements:" + element);
    for(const child of element.children) {
        child.addEventListener("click", createObject);
    }
}

/* *********************************              Base Functionality             ******************************* */ 

function svgDocument(path){
    return readFileSync(path);
}

/* *********************************      Tool Ribbon Place Implementation       ******************************* */ 

/* 
All scalable, dependent on user's click and drag
*/

// need buttons in tool bar

function createObject(event){
    var id = event.target.id
    console.log("== event target id:" + id)
    fabric.loadSVGFromURL('/SVGs/' + id + '.svg' ,function(object, options ) {
        options
        var object = fabric.util.groupSVGElements(object, options);
        canvas.add(object);
    })
}


function deleteButton() {

}


/* *********************************      Objects to Place Implementation       ******************************* */ 

function insertPremadeObject() {
    // need html code for object buttons implemented for this to properly be implemented
    // also need code for premade canvas objects 
}

/* *********************************            Menu Implementation              ******************************* */ 

function saveButtonHandler() {
    // this might end up being too much
}


function resetButtonHandler() {
// need button in top menu
}

function generatePDF() {
    var element = document.getElementById("canvas-container"); // get canvas
    element.style.width = '850px'; // width on page
    element.style.height = '750px'; // height on page
    var options = { // set options 
        margin: .5,
        filename: 'layoutschematic.pdf',
        image: {type: 'jpeg', quality: 1 },
        html2canvas: { scale: 1},
        jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape', precision: '12'}
    };

    html2pdf().set(options).from(element).save(); // call function to export to pdf
}

/* *********************************          Work Area Implementation           ******************************* */ 
