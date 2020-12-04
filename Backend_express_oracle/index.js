const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const cors = require('cors')
const http = require('http')
const multer = require('multer')
const socketIO = require('socket.io')

const signupController = require('./ApiControllers/auth/signup')
const loginController = require('./ApiControllers/auth/login')
const adminLoginController = require('./ApiControllers/admin/adminLogin')
const adminDashboardController = require('./ApiControllers/admin/adminDashboard')
const accountInfoController = require('./ApiControllers/Dashboard/accountInfo')
const editProfileController = require('./ApiControllers/Dashboard/editProfile')
const packageInfoController = require('./ApiControllers/Services/package')
const fnfInfoController = require('./ApiControllers/Services/fnf')
const flexiplanController = require('./ApiControllers/Services/flexiplan')
const feedbackController = require('./ApiControllers/Services/feedback')
const connectWithOthersController = require('./ApiControllers/Services/connectWithOthers')
const socketConController = require('./ApiControllers/SocketConnction')
const historyController = require('./ApiControllers/history')


const app = express()
const server = http.createServer(app)


/*------------------- socket connection section starts------------- */

const sio = socketIO(server, 
    {
    cors: {
        origin: "http://localhost:4000",
        methods: ["GET", "POST"]
    },
    handlePreflightRequest: (req, res) => {
        const headers = {
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            "Access-Control-Allow-Origin": 'http://localhost:4000', //or the specific origin you want to give access to,
            "Access-Control-Allow-Credentials": true
        };
        res.writeHead(200, headers);
        res.end();
    }
})


sio.on("connection", () => {
    console.log("Connected!");
});


/*------------------- socket connection section ends------------- */


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

//app.use('/static', express.static(path.join(__dirname, 'static')))
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
adminLoginController(app)
adminDashboardController(app)
accountInfoController(app)
editProfileController(app, upload)
packageInfoController(app)
fnfInfoController(app)
flexiplanController(app)
connectWithOthersController(app, sio)
socketConController(sio)
historyController(app)
feedbackController(app, sio)
