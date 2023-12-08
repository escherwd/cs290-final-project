const path = require('path');
var express = require('express')
var exphbs = require("express-handlebars")
var fabric = require("fabric").fabric;


// Create the express server
var app = express()
var port = process.env.PORT || 3000 // PORT



//app.engine("handlebars", exphbs.engine( { defaultLayout: "main"}));
//app.set("view engine", "handlebars");

// Use the static middleware
//app.use(express.static('static'))

app.use(express.static('static'));

console.log("== path: " + path);

app.get('/SVGs/:filename', function(req, res){
    
})

app.get("*", function(req, res, next) {

})

app.listen(port, function () {
    console.log("== Server is listening on port", port)
})