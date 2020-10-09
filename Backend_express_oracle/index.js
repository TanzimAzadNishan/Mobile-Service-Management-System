const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const cors = require('cors')
const http = require('http')


const app = express()
const server = http.createServer(app)

server.listen(3000)

app.use(cors())
//Mount the body-parser middleware  here
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

//registering api end points

