/* *********************************      Global Definitions       ******************************* */ 

var trans_canvas = document.getElementById("canvas"); // gets mostly transparent canvas
fitToContainer(trans_canvas);
var context = trans_canvas.getContext('2d');

var canvas = document.getElementById("canvas2"); // gets canvas to add objects to
fitToContainer(canvas);
var context2 = canvas.getContext('2d');


// Event Listeners for Canvas
canvas.onmousedown = mouseDown;
canvas.onmouseout = mouseOut;
canvas.onmouseup = mouseUp;
canvas.onmousemove = mouseMove;


var startX;
var startY;


var objects = []; // array of objects (literally) , unsure of what they'll be like as of right now, need HTML/CSS code first
var is_dragging = false;
var current_object_index = null;


// testing 

// canvas.style.border = '5px solid red'; // so its visible

var canvas_width = canvas.width * .3;
var canvas_height = canvas.height * .3;
var offset_x = 0;
var offset_y = 0;

getOffset();
window.onscroll = getOffset;
window.onresize = getOffset;
canvas.onscroll = getOffset;

objects.push({x: 200, y:50, width: 200, height: 200, color: 'red'});
objects.push({x: 200, y:50, width: 200, height: 200, color: 'blue'});


//Event Listeners for toolbar
var enlargeButton = document.getElementById('tool-enlarge-button');
EnlargeButton.addEventListener('click', enlarge);

var shrinkButton = document.getElementById('tool-enlarge-button');
ShrinkButton.addEventListener('click', shrink);

var bringForwardButton = document.getElementById('tool-bring-forward-button');
bringForwardButton.addEventListener('click', bringForward);

var sendBackwardButton = document.getElementById('tool-send-backward-button');
sendBackwardButton.addEventListener('click', sendBackward);

var lockButton = document.getElementById('tool-lock-button');
lockButton.addEventListener('click', lock);

var eraseButton = document.getElementById('tool-delete-button');
eraseButton.addEventListener('click', deleteButton);

/* *********************************              Base Functionality             ******************************* */ 

function fitToContainer(canvas) {
    /* Sets canvas elements to fit their parent element*/
    canvas.style.width = '100%'; // sets canvas style attribute to fit parent's width
    canvas.style.height= '100%';  // sets canvas style attribute to fit parent's height

    canvas.width = canvas.offsetWidth; // set width to use w/ width of element (includes padding, border, and scrollbar, NOT margin). basically gives it it's true width
    canvas.height = canvas.offsetHeight; // set height to use ^ but height
}

function getOffset(event){
    var offsets = canvas.getBoundingClientRect();
    offset_x = offsets.left;
    offset_y = offsets.top;
}

/* *********************************      Tool Ribbon Place Implementation       ******************************* */ 

/* 
All scalable, dependent on user's click and drag
*/

// need buttons in tool bar
function insertFloor() {

}

function insertWall() {

}

function insertWindow() {

}

function insertDoor() {

}

function enlarge() {

}

function shrink() {

}

function deleteButton() {

}

function bringForward() {

}

function sendBackward() {

}

function lock() {

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
    var element = document.getElementById("canvas"); // get canvas
    element.style.width = '872px'; // width on page
    element.style.height = '764px'; // height on page
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

function mouseDown(event) {
    event.preventDefault();
    console.log("== mouseDown registering")

    startX = parseInt(event.clientX); // gets current position, x coordinate
    startY = parseInt(event.clientY); // gets current position, y coordinate

    var idx = 0;
    for(var object of objects){
        if(mouseInShape(startX, startY, object)){
            console.log("== Object registering as mouse being in \'shape\'.");
            current_object_index = idx;
            is_dragging = true;
            return;
        }
        idx++;
    }
}

function mouseOut(event) {
    if(!is_dragging){
        console.log("== mouseOut registering is_dragging as true")
        return;
    }
    event.preventDefault();
    is_dragging = false;
}

function mouseUp(event) {
    if(!is_dragging){
        console.log("== mouseUp registering is_dragging as true")
        return;
    }
    event.preventDefault();
    is_dragging = false;
}

function mouseMove(event) {
    if(!is_dragging){
        console.log("== mouseMove registering is_dragging as true")
        return;
    } else {
        console.log("== mouseMove registering is_dragging as false, should move object.")
        event.preventDefault();
        var mouseX = parseInt(event.clientX); // get client x position
        var mouseY = parseInt(event.clientY); // get client y position

        var dx = mouseX - startX; // change in x
        var dy = mouseY - startY; // change in y

        var current_object = objects[current_object_index];
        current_object.x += dx;
        current_object.y += dx;

        console.log("== mouseMove calls implementObjects correctly")
        implementObjects();


        startX = mouseX;
        startY = mouseY;

    }
    
}

function mouseInShape(x, y, object) {
    // most likely a place holder for whatever implimentation we'll use for each object 


    var shapeLeft = object.x; // x coord of upper left corner of object 
    var shapeRight = object.x + object.width;  
    var shapeTop = object.y; // y coord of upper left corner of object 
    var shapeBottom = object.y + object.height; 
    console.log("== inputted x: " + x + "  inputted y: " + y + "  inputted object height:" + object.height + "  inputted object width: " + object.width);
    console.log("== shapeLeft/x: " + shapeLeft + "  shapeRight: " + shapeRight + "  shapeTop/y: " + shapeTop + "  shapeBottom: " + shapeBottom);

    if(x > shapeLeft && x < shapeRight && y > shapeTop && y < shapeBottom){
        console.log("== mouseInShape returning TRUE")
        return true;
    }
    console.log("== mouseInShape returning FALSE")
    return false;
    
}

function implementObjects() {
    context2.clearRect(0, 0, canvas_width, canvas_height);
    for(var object of objects) {
        context2.fillStyle = object.color;
        context2.fillRect(object.x, object.y, object.width, object.height);
    }
}

implementObjects();