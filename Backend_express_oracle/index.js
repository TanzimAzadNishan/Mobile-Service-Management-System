const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const cors = require('cors')
const http = require('http')
const multer = require('multer')

const signupController = require('./ApiControllers/auth/signup')
const loginController = require('./ApiControllers/auth/login')
const AdminLoginController = require('./ApiControllers/Admin/adminLogin')
const accountInfoController = require('./ApiControllers/Dashboard/accountInfo')
const editInfoController = require('./ApiControllers/Dashboard/editInfo')


const app = express()
const server = http.createServer(app)

server.listen(4000)

var requestTime = function (req, res, next) {
    req.requestTime = Date.now()
    next()
}
app.use(requestTime)


//--------------- file handling section starts --------------------
var filename = ``

const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, 'uploads')
    },
    filename: (req, file, callBack) => {
        filename = req.requestTime + path.extname(file.originalname)
        callBack(null, `${filename}`)
    }
})

const upload = multer({
    storage: storage
})
app.use(express.static('uploads'))

//--------------- file handling section ends --------------------


app.use(cors())
//Mount the body-parser middleware  here
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));


//registering api end points
signupController(app)
loginController(app)
AdminLoginController(app)
accountInfoController(app)
editInfoController(app, upload)
