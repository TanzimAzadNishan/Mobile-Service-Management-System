const executeQuery = require('../../Database/queryIntoDB')
const insertOperation = require('../../Database/insertOperation')
const oracledb = require('oracledb')


var emitToReceiverQuery = 
`
SELECT SOCKET_ID
FROM ACCOUNT
WHERE MOBILE_NUMBER = :mobile_number
`
var updatedhistoryQuery =  
`
SELECT *
FROM PERSON_HISTORY
WHERE ACCOUNT_TRACKING_ID = (
    SELECT ACCOUNT_TRACKING_ID FROM ACCOUNT
    WHERE MOBILE_NUMBER = :mobile_number
)
OR (
    HISTORY_TYPE = :history_type AND
    CONTACT_NUMBER = :contact_number
)
ORDER BY TIME_SLOT DESC
`
var accountQuery = 
`
SELECT ACCOUNT_BALANCE, INTERNET_BALANCE, TALKTIME, SMS_BALANCE, POINTS,  SOCKET_ID
FROM ACCOUNT
WHERE MOBILE_NUMBER = :mobile_number 
`
var updatedInfo = {
    history_type : 'call'
}
var updatedInternetQuery =  
`
SELECT *
FROM PERSON_HISTORY
WHERE ACCOUNT_TRACKING_ID = (
    SELECT ACCOUNT_TRACKING_ID FROM ACCOUNT
    WHERE MOBILE_NUMBER = :mobile_number
)
ORDER BY TIME_SLOT DESC
`

var callFlag = 1;


function sendHistoryIdOfCurrentAction(req, sio, res, type){
    var historyIdDynamicQuery = 
    `
    SELECT HISTORY_ID
    FROM PERSON_HISTORY
    WHERE ACCOUNT_TRACKING_ID = (
        SELECT ACCOUNT_TRACKING_ID FROM ACCOUNT
        WHERE MOBILE_NUMBER = :mobile_number
    ) 
    AND HISTORY_TYPE = :history_type
    `
    var dynamicInfo = {
        history_type: type,
        mobile_number: req.body.sender
    }
    if(type === 'call'){
        historyIdDynamicQuery = historyIdDynamicQuery + 
        `
        AND SENDER_NUMBER = :sender
        AND CONTACT_NUMBER = :receiver
        `
        dynamicInfo.sender = req.body.sender
        dynamicInfo.receiver = req.body.receiver
    }

    historyIdDynamicQuery = historyIdDynamicQuery +
    `
    ORDER BY TIME_SLOT DESC
    `

    executeQuery(historyIdDynamicQuery, dynamicInfo)
    .then((historyData)=>{
        console.log(historyData.rows[0].HISTORY_ID)

        if(type === 'int'){
            res.json({serverMsg: 'Session Id Retrieved Succesfully!',
            lastSessionHistoryId: historyData.rows[0].HISTORY_ID})
        }
        else if(type === 'call'){
            res.json({serverMsg: 'Talktime Id Retrieved Succesfully!',
            lastTalktimeId: historyData.rows[0].HISTORY_ID})
            
            executeQuery(emitToReceiverQuery, [req.body.receiver])
            .then((socketData)=>{
                var socketId = socketData.rows[0].SOCKET_ID

                sio.to(socketId).emit('someone-calling',
                {lastTalktimeId: historyData.rows[0].HISTORY_ID, sender: req.body.sender})
            })
        }
    })
}

function updateAfterSMS(req, sio, res){
    executeQuery(accountQuery, [req.body.sender])
    .then((accdata)=>{
        var id = accdata.rows[0].SOCKET_ID;
        sio.to(id).emit('updated-account-balance',
        {accountInfo: accdata.rows[0]})
    })

    var afterSMSInfo = {
        history_type : 'sms',
        mobile_number : req.body.sender,
        contact_number : req.body.sender
    }

    executeQuery(emitToReceiverQuery, [req.body.receiver])
    .then((socketData)=>{
        var socketId = socketData.rows[0].SOCKET_ID
        
        executeQuery(updatedhistoryQuery, afterSMSInfo)
        .then((updatedHistory)=>{
            sio.to(socketId).emit('send-updated-history',
            {historyInfo: updatedHistory.rows})
        })
    })
}

function insertToPersonHistory(req, type, amount, dataVolume, cutDuration, sio, res){
    var historyQuery = 
    `
    INSERT INTO PERSON_HISTORY (HISTORY_ID, HISTORY_TYPE, TIME_SLOT, 
        AMOUNT, ACCOUNT_TRACKING_ID,
    `
    var info = {
        mobile_number: req.body.sender,
        amount: amount
    }

    if(type === 'sms'){
        historyQuery = historyQuery +
        `
        CONTACT_NUMBER, SENDER_NUMBER )
        `
    }
    else if(type === 'call'){
        historyQuery = historyQuery +
        `
        CONTACT_NUMBER, SENDER_NUMBER, CALL_TYPE, CUT_DURATION, TIME_SLOT_END )
        `
    }
    else if(type === 'int'){
        historyQuery = historyQuery + 
        `
        TIME_SLOT_END, DATA_VOLUME )
        `
    }

    historyQuery = historyQuery +
    `
    VALUES (
        HISTORY_ID_SEQ.NEXTVAL, :history_type, SYSDATE, :amount,
        (
            SELECT ACCOUNT_TRACKING_ID
            FROM ACCOUNT
            WHERE MOBILE_NUMBER = :mobile_number
        ),
    `

    if(type === 'sms'){
        historyQuery = historyQuery +
        `
        :contact_number, :sender_number )
        `

        info.history_type = 'sms'
        info.contact_number =  req.body.receiver
        info.sender_number =  req.body.sender
    }
    else if(type === 'call'){
        historyQuery = historyQuery +
        `
        :contact_number, :sender_number, :call_type, :cut_duration, SYSDATE )
        `
                
        info.history_type = 'call'
        info.contact_number =  req.body.receiver
        info.sender_number =  req.body.sender
        info.call_type = 'n'
        info.cut_duration = cutDuration
    }
    else if(type === 'int'){
        historyQuery = historyQuery +
        `
        SYSDATE, :dataVolume )
        `
        info.dataVolume = dataVolume
        info.history_type = 'int'
    }

    insertOperation(historyQuery, info)
    .then((hasErr)=>{
        if(!hasErr){
            if(type === 'call' || type === 'int'){
                sendHistoryIdOfCurrentAction(req, sio, res, type)
            }
            else if(type === 'sms'){
                updateAfterSMS(req, sio, res)
            }
        }
        else{
            console.log('insert error in person-history')
        }
    })
}


function sendUpdatesToUsers(req, sio, res, type){
    var current_history_id;

    executeQuery(accountQuery, [req.body.sender])
    .then((accdata)=>{
        var id = accdata.rows[0].SOCKET_ID;
        sio.to(id).emit('updated-account-balance',
        {accountInfo: accdata.rows[0]})

        updatedInfo.mobile_number = req.body.sender
        updatedInfo.contact_number = req.body.sender

        if(type === 'int'){
            executeQuery(updatedInternetQuery, [req.body.sender])
            .then((updatedHistory)=>{
                //current_history_id = updatedHistory.rows[0].HISTORY_ID

                res.json({serverMsg: 'Session Id Retrieved Succesfully!',
                lastSessionHistoryId: updatedHistory.rows[0].HISTORY_ID})
            })
        }
        else if(type === 'call'){
            executeQuery(updatedhistoryQuery, updatedInfo)
            .then((updatedHistory)=>{
                current_history_id = updatedHistory.rows[0].HISTORY_ID
                res.json({serverMsg: 'Talktime Id Retrieved Succesfully!',
                lastTalktimeId: updatedHistory.rows[0].HISTORY_ID})
            })
        }
    })

    if(req.body.receiver != null){
        executeQuery(emitToReceiverQuery, [req.body.receiver])
        .then((data)=>{
            var id = data.rows[0].SOCKET_ID;

            if(type === 'call'){

                updatedInfo.mobile_number = req.body.sender
                updatedInfo.contact_number = req.body.sender

                executeQuery(updatedhistoryQuery, updatedInfo)
                .then((updatedHistory)=>{
                    current_history_id = updatedHistory.rows[0].HISTORY_ID

                    sio.to(id).emit('someone-calling',
                    {lastTalktimeId: current_history_id, sender: req.body.sender})
                })
            }
            else{
                executeQuery(updatedhistoryQuery, updatedInfo)
                .then((updatedHistory)=>{
                    updatedInfo.mobile_number = req.body.receiver
                    updatedInfo.contact_number = req.body.receiver

                    sio.to(id).emit('send-updated-history',
                    {historyInfo: updatedHistory.rows})
                })
            }
        })
    }
}

function intcallsmsDynamic(req, type, amount, dataVolume, cutDuration, sio, res){
    var historyQuery = 
    `
    INSERT INTO PERSON_HISTORY (HISTORY_ID, HISTORY_TYPE, TIME_SLOT, 
        AMOUNT, ACCOUNT_TRACKING_ID,
    `
    var info = {
        mobile_number: req.body.sender,
        amount: amount
    }

    if(type === 'sms'){
        historyQuery = historyQuery +
        `
        CONTACT_NUMBER, SMS_TYPE )
        `
    }
    else if(type === 'call'){
        historyQuery = historyQuery +
        `
        CONTACT_NUMBER, SENDER_NUMBER, CALL_TYPE, CUT_DURATION, TIME_SLOT_END )
        `
    }
    else if(type === 'int'){
        historyQuery = historyQuery + 
        `
        TIME_SLOT_END, DATA_VOLUME )
        `
    }

    historyQuery = historyQuery +
    `
    VALUES (
        HISTORY_ID_SEQ.NEXTVAL, :history_type, SYSDATE, :amount,
        (
            SELECT ACCOUNT_TRACKING_ID
            FROM ACCOUNT
            WHERE MOBILE_NUMBER = :mobile_number
        ),
    `

    if(type === 'sms'){
        historyQuery = historyQuery +
        `
        :contact_number, :sms_type )
        `

        info.history_type = 'sms'
        info.contact_number =  req.body.receiver
        info.sms_type = 'i'
    }
    else if(type === 'call'){
        historyQuery = historyQuery +
        `
        :contact_number, :sender_number, :call_type, :cut_duration, SYSDATE )
        `
                
        info.history_type = 'call'
        info.contact_number =  req.body.receiver
        info.sender_number =  req.body.sender
        info.call_type = 'n'
        info.cut_duration = cutDuration
    }
    else if(type === 'int'){
        historyQuery = historyQuery +
        `
        SYSDATE, :dataVolume )
        `
        info.dataVolume = dataVolume
        info.history_type = 'int'
    }

    insertOperation(historyQuery, info)
    .then((hasErr)=>{
        if(!hasErr){
            
            if(req.body.receiver != null && type !== 'call'){
                info.mobile_number = req.body.receiver
                info.amount = -1
                info.sms_type = 'o'
                info.contact_number =  req.body.sender

                insertOperation(historyQuery, info)
                .then((hasReceiverErr)=>{
                    if(!hasReceiverErr){
                        sendUpdatesToUsers(req, sio, res, type)
                    }
                    else{
                        console.log('insert error in receiver person-history')  
                    }
                })
            }
            else{
                console.log('receiver is null')
                sendUpdatesToUsers(req, sio, res, type)
            }
        }
        else{
            console.log('insert error in person-history')
        }
    })
}

function updateInternetSession(req, sio, amount, dataVolume){
    var updateSessionQuery = 
    `
    UPDATE PERSON_HISTORY
    SET TIME_SLOT_END = SYSDATE, 
    DATA_VOLUME = DATA_VOLUME + :dataVolume, 
    AMOUNT = AMOUNT + :amount
    WHERE HISTORY_ID = :history_id
    `
    var updateInfo = {
        history_id: req.body.history_id,
        dataVolume: dataVolume,
        amount: amount
    }

    executeQuery(updateSessionQuery, updateInfo)
    .then(()=>{
        executeQuery(accountQuery, [req.body.sender])
        .then((accData)=>{
            var socketid = accData.rows[0].SOCKET_ID

            sio.to(socketid).emit('updated-account-balance',
            {accountInfo: accData.rows[0]})

            //updatedInfo.mobile_number = req.body.sender
            //updatedInfo.contact_number = req.body.sender

            executeQuery(updatedInternetQuery, [req.body.sender])
            .then((updatedHistory)=>{
                sio.to(socketid).emit('send-updated-history',
                {historyInfo: updatedHistory.rows})

            })
        })
    })
}

function updateCallSession(req, sio, amount, cutDuration, callType){
    var updateSessionQuery = 
    `
    UPDATE PERSON_HISTORY
    SET TIME_SLOT_END = SYSDATE,
    CALL_TYPE = :call_type, 
    CUT_DURATION = CUT_DURATION + :cutDuration, 
    AMOUNT = AMOUNT + :amount
    WHERE HISTORY_ID = :history_id
    `
    var updateInfo = {
        history_id: req.body.history_id,
        call_type: callType,
        cutDuration: cutDuration,
        amount: amount
    }

    /*var collectMobNumQuery = 
    `
    SELECT MOBILE_NUMBER
    FROM ACCOUNT
    WHERE ACCOUNT_TRACKING_ID = (
        SELECT ACCOUNT_TRACKING_ID
        FROM PERSON_HISTORY
        WHERE HISTORY_ID = :history_id
    )
    `*/

    executeQuery(updateSessionQuery, updateInfo)
    .then(()=>{
        executeQuery(accountQuery, [req.body.sender])
        .then((accData)=>{
            var socketid = accData.rows[0].SOCKET_ID

            sio.to(socketid).emit('updated-account-balance',
            {accountInfo: accData.rows[0]})

            updatedInfo.mobile_number = req.body.sender
            updatedInfo.contact_number = req.body.sender

            executeQuery(updatedhistoryQuery, updatedInfo)
            .then((updatedHistory)=>{
                sio.to(socketid).emit('send-updated-history',
                {historyInfo: updatedHistory.rows})

            })
        })

        executeQuery(emitToReceiverQuery, [req.body.receiver])
        .then((socketData)=>{
            var socketid = socketData.rows[0].SOCKET_ID

            updatedInfo.mobile_number = req.body.receiver
            updatedInfo.contact_number = req.body.receiver

            executeQuery(updatedhistoryQuery, updatedInfo)
            .then((updatedHistory)=>{

                sio.to(socketid).emit('send-updated-history',
                {historyInfo: updatedHistory.rows})

            })
        })
    })
}

function emitMessageOfCutCall(req, sio){
    
    executeQuery(emitToReceiverQuery, [req.body.sender])
    .then((socketData)=>{
        var socketid = socketData.rows[0].SOCKET_ID
        sio.to(socketid).emit('show-cut-call',
        {caller: req.body.receiver})
    })
    executeQuery(emitToReceiverQuery, [req.body.receiver])
    .then((socketData)=>{
        var socketid = socketData.rows[0].SOCKET_ID
        sio.to(socketid).emit('show-cut-call',
        {caller: req.body.sender})
    })
}



module.exports = function(app, sio){

    app.post('/send-sms', (req, res)=>{
        console.log(req.body)

        var smsAllowQuery =
        `
        BEGIN
            IS_SENDING_SMS_ALLOWED(:sender, :receiver, :msg, :amount);
        END;
        `
        var existQuery =
        `
        BEGIN
            :ret := IS_MOBILE_NUMBER_EXIST(:receiver);
        END;
        `
        var existInfo = {
            receiver: req.body.receiver,
            ret: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 100 }
        }
        var info = {
            sender: req.body.sender,
            receiver: req.body.receiver,
            msg: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 100 },
            amount: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER}
        }

        executeQuery(existQuery, existInfo)
        .then((data)=>{
            console.log(data.outBinds);
            if(data.outBinds.ret === 'True'){
                executeQuery(smsAllowQuery, info)
                .then((result)=>{
                    console.log(result.outBinds);
                    if(result.outBinds.msg === 'True'){
                        
                        console.log('amount : ', result.outBinds.amount)
                        /*intcallsmsDynamic(req, 'sms', result.outBinds.amount, 
                            null, null, sio, res)*/

                        insertToPersonHistory(req, 'sms', result.outBinds.amount, 
                            null, null, sio, res)
                    }
                    else if(result.outBinds.msg === 'False'){
                        console.log('Not sufficient balance to send sms')
                        res.json({serverMsg: 'Not sufficient balance to send sms'})
                    }
                    else{
                        console.log('other record error')
                    }
                })
            }
            else if(data.outBinds.ret === 'False'){
                console.log('The mob num does not exist')
                res.json({serverMsg: 'This Mobile Number is not found!'})
            }
            else{
                console.log('other exist query error')
            }
        })
    })

    app.post('/start-internet-session', (req, res)=>{
        console.log('start-internet-session')
        console.log(req.body)

        var sessionAllowQuery =
        `
        BEGIN
            IS_SESSION_ALLOWED(:sender, SYSDATE, SYSDATE, :msg, :amount, 
            :dataVolume);
        END;
        `
        var sessioninfo = {
            sender: req.body.sender,
            msg: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 100 },
            amount: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER},
            dataVolume: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER}
        }

        executeQuery(sessionAllowQuery, sessioninfo)
        .then((allowData)=>{
            if(allowData.outBinds.msg === 'True'){

                console.log('amount : ', allowData.outBinds.amount)
                console.log('data volume : ', allowData.outBinds.dataVolume)
                /*intcallsmsDynamic(req, 'int', allowData.outBinds.amount, 
                allowData.outBinds.dataVolume, null, sio, res)*/
                
                insertToPersonHistory(req, 'int', allowData.outBinds.amount, 
                allowData.outBinds.dataVolume, null, sio, res)
            }
            else if(allowData.outBinds.msg === 'False'){
                console.log('Not sufficient balance to start session')
                res.json({serverMsg: 'Not sufficient balance to start session'})
            }
            else{
                console.log('other session allow query error')
            }
        })
    })

    app.post('/update-internet-session', (req, res)=>{
        console.log('update-internet-session')
        console.log(req.body)

        var lastupdateQuery = 
        `
        SELECT TIME_SLOT_END
        FROM PERSON_HISTORY
        WHERE HISTORY_ID = :history_id
        `
        var sessionAllowQuery =
        `
        BEGIN
            IS_SESSION_ALLOWED(:sender, :stime, SYSDATE, :msg, :amount,
            :dataVolume);
        END;
        `
        var sessioninfo = {
            sender: req.body.sender,
            msg: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 100 },
            amount: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER},
            dataVolume: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER}
        }

        executeQuery(lastupdateQuery, [req.body.history_id])
        .then((lastUpdate)=>{

            sessioninfo.stime = lastUpdate.rows[0].TIME_SLOT_END
            console.log('stime : ', sessioninfo.stime)

            executeQuery(sessionAllowQuery, sessioninfo)
            .then((allowData)=>{
                if(allowData.outBinds.msg === 'True'){
    
                    console.log('amount : ', allowData.outBinds.amount)
                    console.log('data volume : ', allowData.outBinds.dataVolume)
                    updateInternetSession(req, sio, allowData.outBinds.amount,
                        allowData.outBinds.dataVolume)          
                }
                else if(allowData.outBinds.msg === 'False'){
                    console.log('Not sufficient balance to continue session')
                    res.json({serverMsg: 'Not sufficient balance to continue session'})
                }
                else{
                    console.log('other update session allow query error')
                }
            })

        })
    })

    app.post('/start-call', (req, res)=>{
        console.log(req.body)
        callFlag = 1

        var callAllowQuery =
        `
        BEGIN
            IS_SENDING_CALL_ALLOWED(:sender, :receiver, :msg, :amount);
        END;
        `
        var callAllowInfo = {
            sender: req.body.sender,
            receiver: req.body.receiver,
            msg: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 100 },
            amount: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER}
        }

        var existQuery =
        `
        BEGIN
            :ret := IS_MOBILE_NUMBER_EXIST(:receiver);
        END;
        `
        var existInfo = {
            receiver: req.body.receiver,
            ret: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 100 }
        }
        
        executeQuery(existQuery, existInfo)
        .then((data)=>{
            console.log(data.outBinds);

            if(data.outBinds.ret === 'True'){
                executeQuery(callAllowQuery, callAllowInfo)
                .then((allowData)=>{
                    if(allowData.outBinds.msg === 'True'){
        
                        console.log('amount : ', allowData.outBinds.amount)
        
                        /*intcallsmsDynamic(req, 'call', 0, 
                        null, 0, sio, res)*/
                        
                        insertToPersonHistory(req, 'call', 0, 
                        null, 0, sio, res)   
                    }
                    else if(allowData.outBinds.msg === 'False'){
                        console.log('Not sufficient balance to start call')
                        res.json({serverMsg: 'Not sufficient balance to start call'})
                    }
                    else{
                        console.log('other call allow query error')
                    }
                })
            }
            else if(data.outBinds.ret === 'False'){
                console.log('The mob num does not exist')
                res.json({serverMsg: 'This Mobile Number is not found!'})
            }
            else{
                console.log('other exist query error')
            }

        })
    })

    app.post('/ongoing-call', (req, res)=>{
        console.log('----------ongoing call------------------')
        console.log(req.body)

        var lastupdateQuery = 
        `
        SELECT TIME_SLOT_END
        FROM PERSON_HISTORY
        WHERE HISTORY_ID = :history_id
        `

        var callAllowQuery =
        `
        BEGIN
            IS_SENDING_CALL_ALLOWED(:sender, :receiver, :msg, :amount);
        END;
        `
        var callAllowInfo = {
            sender: req.body.sender,
            receiver: req.body.receiver,
            msg: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 100 },
            amount: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER}
        }

        var ongoingAllowQuery =
        `
        BEGIN
            IS_ONGOING_CALL_ALLOWED(:sender, :rate, :stime, SYSDATE, :msg, :amount,
            :duration);
        END;
        `
        var ongoinginfo = {
            sender: req.body.sender,
            msg: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 100 },
            amount: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER},
            duration: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER}
        }

        executeQuery(lastupdateQuery, [req.body.history_id])
        .then((lastUpdate)=>{

            ongoinginfo.stime = lastUpdate.rows[0].TIME_SLOT_END
            console.log('stime : ', ongoinginfo.stime)

            executeQuery(callAllowQuery, callAllowInfo)
            .then((allowData)=>{
                if(allowData.outBinds.msg === 'True'){
    
                    console.log('amount : ', allowData.outBinds.amount)
                    var currentCallRate = allowData.outBinds.amount
                    ongoinginfo.rate = currentCallRate
    
                    executeQuery(ongoingAllowQuery, ongoinginfo)
                    .then((ongoingData)=>{
                        if(ongoingData.outBinds.msg === 'True'){

                            console.log('amount : ', ongoingData.outBinds.amount)
                            console.log('duration : ', ongoingData.outBinds.duration)

                            if(callFlag === 1){
                                emitMessageOfCutCall(req, sio)
                                callFlag = 0
                            }
                            
                            updateCallSession(req, sio, ongoingData.outBinds.amount,
                                ongoingData.outBinds.duration, 'r')

                        }
                        else if(ongoingData.outBinds.msg === 'False'){
                            console.log('Not sufficient balance to continue call')
                            res.json({serverMsg: 'Not sufficient balance to continue call'})
                        }
                        else{
                            console.log('other ongoing allow query error')
                        }
                    })
                }
            })
        })
    })

    app.post('/discard-call', (req, res)=>{
        console.log('----------- discard call --------------')
        console.log(req.body)

        updateCallSession(req, sio, 0, 0, 'm')
        executeQuery(emitToReceiverQuery, [req.body.sender])
        .then((socketData)=>{
            var socketid = socketData.rows[0].SOCKET_ID
            sio.to(socketid).emit('call-is-rejected')
        })
    })

    app.post('/cut-call', (req, res)=>{
        console.log('----------- cut call --------------')
        console.log(req.body)

        executeQuery(emitToReceiverQuery, [req.body.user1])
        .then((socketData)=>{
            var socketid = socketData.rows[0].SOCKET_ID
            sio.to(socketid).emit('remove-cut-call')
        })
        executeQuery(emitToReceiverQuery, [req.body.user2])
        .then((socketData)=>{
            var socketid = socketData.rows[0].SOCKET_ID
            sio.to(socketid).emit('remove-cut-call')
        })
    })

    /*app.post('/waiting-call', (req, res)=>{
        console.log('----------- waiting call --------------')
        console.log(req.body)

        executeQuery(emitToReceiverQuery, [req.body.user1])
        .then((socketData)=>{
            var socketid = socketData.rows[0].SOCKET_ID
            sio.to(socketid).emit('receiver-is-engaged')
        })
    })*/
}