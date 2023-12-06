
var express = require('express')
var app = express()

app.use(express.static('static'))

var port = process.env.PORT || 3000
app.listen(port, function () {
    console.log("== Server is listening on port", port)
})