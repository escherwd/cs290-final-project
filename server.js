
const fs = require('fs');
const path = require('path');
var express = require('express')
var port = process.env.PORT || 3000

// Create the express server
var app = express()
// Use the static middleware
app.use(express.static('static'))
app.use(express.json());

app.post('/save', function (req, res) {
    let name = req.body['name']
    let data = req.body['data']

    let file = path.join(__dirname, 'storage', `${name}.json`);

    fs.writeFileSync(file, JSON.stringify(data))
    res.end()
})

app.get('/files', function (req, res) {
    let name = req.body['name']
    let data = req.body['data']

    let files = fs.readdirSync(path.join(__dirname, 'storage'))
        .map(file => file.replace('.json', ''))

    res.send({ files: files })
})

app.get('/data', function (req, res) {
    let name = req.query.name

    let file = path.join(__dirname, 'storage', `${name}.json`)

    if (!fs.existsSync(file)) {
        res.status(404).send({ 'error': 'File not found' })
        return
    }

    let data = fs.readFileSync(file)

    res.send(JSON.parse(data))
})


// Listen on port
app.listen(port, function () {
    console.log("== Server is listening on port", port)
})

