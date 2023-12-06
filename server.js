
var express = require('express')
var port = process.env.PORT || 3000

// Create the express server
var app = express()
// Use the static middleware
app.use(express.static('static'))


// Listen on port
app.listen(port, function () {
    console.log("== Server is listening on port", port)
})