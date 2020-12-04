const executeQuery = require('../../Database/queryIntoDB')
const insertOperation = require('../../Database/insertOperation')


var retrieveFeedbackQuery = 
`
SELECT FEEDBACK_ID, SUBJECT, FEEDBACK_DATE, FEEDBACK_BODY
FROM FEEDBACK
WHERE REVIEWER = :reviewer
AND FEEDBACK_TYPE = :feedback_type
ORDER BY FEEDBACK_DATE DESC
`
var adminFeedQuery = 
`
SELECT FEEDBACK_ID, FEEDBACK_DATE, FEEDBACK_BODY, REVIEWER, SUBJECT
FROM FEEDBACK
WHERE FEEDBACK_TYPE = :feedback_type
AND SUBJECT = (
    SELECT ASSIGNED_FEEDBACK_SUB
    FROM ADMIN
    WHERE ADMIN_NID = :nid
)
ORDER BY FEEDBACK_DATE DESC
`

var personSocketQuery = 
`
SELECT SOCKET_ID 
FROM ACCOUNT
WHERE MOBILE_NUMBER = :mobile_number
`

var adminNewFeedQuery = 
`
SELECT FEEDBACK_ID, FEEDBACK_DATE, FEEDBACK_BODY, REVIEWER, SUBJECT
FROM FEEDBACK
WHERE FEEDBACK_TYPE = :feedback_type
AND SUBJECT = :feedback_subject
ORDER BY FEEDBACK_DATE DESC
`


function retrieveFeedbackList(req, res){
    var info = {
        reviewer: req.body.reviewer,
        feedback_type: 'I'
    }

    executeQuery(retrieveFeedbackQuery, info)
    .then((record)=>{
        res.json({serverMsg: 'Retrieved Feedback List Successfully!', 
        feedbackInfo: record.rows})
    })
}

function emitFeedbackListToAdmin(req, sio){
    var info = {
        nid: req.body.NID,
        feedback_type: 'O'
    }
    console.log(req.body)
    var adminQuery = 
    `
    SELECT SOCKET_ID
    FROM ADMIN
    WHERE ASSIGNED_FEEDBACK_SUB = :sub
    `

    executeQuery(adminFeedQuery, info)
    .then((record)=>{
        console.log('------- for admin --------------', record.rows)

        executeQuery(adminQuery, [record.rows[0].SUBJECT])
        .then((data)=>{
            console.log('socket id: ', data.rows[0].SOCKET_ID)
            sio.to(data.rows[0].SOCKET_ID).emit('send-new-feedback',
            {feedbackInfo: record.rows})
        })
    })
}

function emitReplyToUser(req, sio){
    var info = {
        reviewer: req.body.reviewer,
        feedback_type: 'I'
    }

    executeQuery(retrieveFeedbackQuery, info)
    .then((record)=>{
        executeQuery(personSocketQuery, [req.body.reviewer])
        .then((data)=>{
            console.log('------- before emitting to user .......... ', record.rows)
            console.log('------- before emitting to user .......... ', data.rows)
            sio.to(data.rows[0].SOCKET_ID).emit('receive-admin-reply',
            {feedbackInfo: record.rows})
        })
    })
}

function emitNewFeedbackListToAdmin(req, sio){
    var info = {
        feedback_subject: req.body.subject,
        feedback_type: 'O'
    }
    console.log(req.body)
    var adminQuery = 
    `
    SELECT SOCKET_ID
    FROM ADMIN
    WHERE ASSIGNED_FEEDBACK_SUB = :feedback_subject
    `

    executeQuery(adminNewFeedQuery, info)
    .then((record)=>{
        console.log('------- for admin --------------', record.rows)

        executeQuery(adminQuery, [req.body.subject])
        .then((data)=>{
            console.log('socket id: ', data.rows[0].SOCKET_ID)
            sio.to(data.rows[0].SOCKET_ID).emit('send-new-feedback',
            {feedbackInfo: record.rows})
        })
    })
}


module.exports = function(app, sio){
    app.post('/retrieve-admin-feedback', (req, res)=>{
        console.log(req.body)
        emitFeedbackListToAdmin(req, sio)
    })

    app.post('/get-feedback-list', (req, res)=>{
        console.log(req.body)
        retrieveFeedbackList(req, res)
    })

    app.post('/send-feedback', (req, res)=>{
        console.log(req.body)
        var curerntTime = Date()
        console.log('-------- current time ------------', curerntTime)
        var currentDate = curerntTime.split(' ')
        var dateStr = currentDate[2] + '-' + currentDate[1] + '-' + currentDate[3]

        var feedbackQuery =
        `
        INSERT INTO FEEDBACK (FEEDBACK_ID, SUBJECT, FEEDBACK_DATE, FEEDBACK_BODY, 
            REVIEWER, FEEDBACK_TYPE)
        VALUES (FEEDBACK_ID_SEQ.NEXTVAL, :feedback_subject, :feedback_date, :feedback_body, 
            :reviewer, :feedback_type)
        `
        var feedbackInfo = {
            feedback_subject: req.body.subject,
            feedback_date: dateStr,
            feedback_body: req.body.body,
            reviewer: req.body.reviewer,
            feedback_type: 'O',
        }


        insertOperation(feedbackQuery, feedbackInfo)
        .then((hasErr)=>{
            if(!hasErr){
                retrieveFeedbackList(req, res)
                //emitFeedbackListToAdmin(req, sio)
                emitNewFeedbackListToAdmin(req, sio)

                /*executeQuery(adminQuery, [req.body.subject])
                .then((data)=>{
                    sio.to(data.rows[0].SOCKET_ID).emit('send-new-feedback',
                    {feedbackInfo: feedbackInfo})
                })*/
            }
            else{
                console.log('retrieved feedback list failed') 
            }
        })
    })

    app.post('/feedback-reply', (req, res)=>{
        console.log(req.body)
        var curerntTime = Date()
        console.log('-------- current time ------------', curerntTime)
        var currentDate = curerntTime.split(' ')
        var dateStr = currentDate[2] + '-' + currentDate[1] + '-' + currentDate[3]

        var feedbackQuery =
        `
        INSERT INTO FEEDBACK (FEEDBACK_ID, SUBJECT, FEEDBACK_DATE, FEEDBACK_BODY, 
            REVIEWER, FEEDBACK_TYPE)
        VALUES (FEEDBACK_ID_SEQ.NEXTVAL, :feedback_subject, :feedback_date, :feedback_body, 
            :reviewer, :feedback_type)
        `
        var feedbackInfo = {
            feedback_subject: req.body.subject,
            feedback_date: dateStr,
            feedback_body: req.body.body,
            reviewer: req.body.reviewer,
            feedback_type: 'I',
        }


        insertOperation(feedbackQuery, feedbackInfo)
        .then((hasErr)=>{
            if(!hasErr){
                emitReplyToUser(req, sio)
                emitFeedbackListToAdmin(req, sio)
            }
            else{
                console.log('retrieved feedback list failed') 
            }
        })
    })
}