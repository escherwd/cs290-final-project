
const fs = require('fs/promises');
const path = require('path');
const hb_adapter = require('express-handlebars');
const layoutData = require('./layoutdata.json'); // array of layout button data
var objectsData = require('./objectsdata.json') // array of object buttons data
var express = require('express')
var exphbs = require("express-handlebars")
var fabric = require("fabric").fabric;


// Create the express server
var app = express()
var port = process.env.PORT || 3000 // PORT



//app.engine("handlebars", exphbs.engine( { defaultLayout: "main"}));
//app.set("view engine", "handlebars");

// Use the static middleware
app.use(express.static('static', { index: false }))
app.use(express.json());
// Use handlebars
app.engine('handlebars', hb_adapter.engine())
app.set('view engine', 'handlebars')
app.set('views', './views')


// Save a project to file. Will overwrite existing data.
app.post('/project/:name/save', function (req, res) {

    // Grab the name, data, and path to save at
    let name = req.params.name
    let data = JSON.stringify(req.body)
    let file = path.join(__dirname, 'storage', `${name}.json`);

    // Write to file (overwrite existing data)
    fs.writeFileSync(file, data)
    res.end()
})

async function getProjects() {
    let dir = path.join(__dirname, 'storage')
    return (await fs.readdir(dir)).map(file => file.replace('.json', ''))
}

async function getProjectData(name) {
    let file = path.join(__dirname, 'storage', `${name}.json`)
    return await fs.readFile(file)
}

app.get('/project/:name', async function (req, res) {
    try {
        let data = await getProjectData(req.params.name);
        res.render('editor', {
            layout: 'editor',
            data: data ,
            layoutbuttons: layoutData, // passes array of data for layout buttons 
            objects: objectsData
        })
    } catch (err) {
        res.render('404')
    }
})

app.get('/new', async function (req, res) {
    res.render('editor', {
        layout: 'editor',
        layoutbuttons: layoutData,
        objects: objectsData
    })
})

app.get('/', async function (req, res) {
    res.render('home', {
        projects: await getProjects()
    })
})

app.get('*', function (req, res) {
    res.render('404')
})

// Listen on port
app.listen(port, function () {
    console.log("== Server is listening on port", port)
})

