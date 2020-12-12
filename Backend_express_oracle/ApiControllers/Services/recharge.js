const executeQuery = require('../../Database/queryIntoDB')
const insertOperation = require('../../Database/insertOperation')
const oracledb = require('oracledb')


function emitUpdate(receiver, sio){
    var accountQuery = 
    `
    SELECT ACCOUNT_BALANCE, INTERNET_BALANCE, TALKTIME, SMS_BALANCE, POINTS,  SOCKET_ID
    FROM ACCOUNT
    WHERE MOBILE_NUMBER = :mobile_number 
    `
    var historyQuery =  
    `
    SELECT *
    FROM PERSON_HISTORY
    WHERE ACCOUNT_TRACKING_ID = (
        SELECT ACCOUNT_TRACKING_ID FROM ACCOUNT
        WHERE MOBILE_NUMBER = :mobile_number
    )
    ORDER BY TIME_SLOT DESC
    `

    executeQuery(accountQuery, [receiver])
    .then((record)=>{
        var socketid = record.rows[0].SOCKET_ID

        sio.to(socketid).emit('transfer-new-recharge',
        {accountBalance: record.rows[0]})

        executeQuery(historyQuery, [receiver])
        .then((data)=>{
            sio.to(socketid).emit('send-updated-history',
            {historyInfo: data.rows})
        })
    })

}


module.exports = function(app, sio){
    app.post('/send-recharge', (req, res)=>{
        console.log(req.body)

        var validityExistQuery = 
        `
        BEGIN
            :ret := IS_AMOUNT_VALIDITY_EXIST(:mob, SYSDATE);
        END;
        `
        var validityExistInfo = {
            mob: req.body.sender,
            ret: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 100 }
        }

        var mobExistQuery =
        `
        BEGIN
            :ret := IS_MOBILE_NUMBER_EXIST(:receiver);
        END;
        `
        var mobExistInfo = {
            receiver: req.body.receiver,
            ret: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 100 }
        }

        var amountQuery =
        `
        BEGIN
            IS_AMOUNT_VALID(:amount, :sender, :msg);
        END;
        `
        var amountInfo = {
            amount: req.body.amount,
            sender: req.body.sender,
            msg: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 100 }
        }

        var curerntTime = Date()
        console.log('-------- current time ------------', curerntTime)
        var currentDate = curerntTime.split(' ')
        var dateStr = currentDate[2] + '-' + currentDate[1] + '-' + currentDate[3]
                        + ' ' + currentDate[4]

        var historyQuery = 
        `
        INSERT INTO PERSON_HISTORY (HISTORY_ID, HISTORY_TYPE, CONTACT_NUMBER, TIME_SLOT, 
            RECHARGE_TYPE, AMOUNT, ACCOUNT_TRACKING_ID)
        VALUES (
            HISTORY_ID_SEQ.NEXTVAL, :history_type, :contact_number, 
            SYSDATE,
            :recharge_type, :amount,
            (
                SELECT ACCOUNT_TRACKING_ID
                FROM ACCOUNT
                WHERE MOBILE_NUMBER = :mobile_number
            )
            )
        `
        var senderInfo = {
            history_type: 'rec',
            contact_number: req.body.receiver,
            //time_slot: dateStr,
            recharge_type: 'o',
            amount: req.body.amount,
            mobile_number: req.body.sender
        }
        var receiverInfo = {
            history_type: 'rec',
            contact_number: req.body.sender,
            //time_slot: dateStr,
            recharge_type: 'i',
            amount: req.body.amount,
            mobile_number: req.body.receiver
        }


        executeQuery(validityExistQuery, validityExistInfo)
        .then((validityData)=>{
            console.log('validity exist : ', validityData.outBinds)

            if(validityData.outBinds.ret === 'True'){

                executeQuery(mobExistQuery, mobExistInfo)
                .then((mobData)=>{
                    console.log('mob num exist : ', mobData.outBinds)

                    if(mobData.outBinds.ret === 'True'){

                        executeQuery(amountQuery, amountInfo)
                        .then((result)=>{
                            console.log(result.outBinds);
                            if(result.outBinds.msg === 'VALID'){
                                insertOperation(historyQuery, senderInfo)
                                .then((hasSenderErr)=>{
                                    if(!hasSenderErr){
                                        insertOperation(historyQuery, receiverInfo)
                                        .then((hasHistoryErr)=>{
                                            if(!hasHistoryErr){
                                                emitUpdate(req.body.receiver, sio)
                                            }
                                        })
                                    }
                                })
                            }
                
                            else{
                                console.log(result.outBinds.msg)
                                res.json({serverMsg: 'Your account does not have sufficient balance'})
                            }
                        })
                    }

                    else if(mobData.outBinds.ret === 'False'){
                        console.log('The mob num does not exist')
                        res.json({serverMsg: 'This Mobile Number is not found!'})
                    }
                    else{
                        console.log('other mob exist query error')
                    }
                })
            }

            else if(validityData.outBinds.ret === 'False'){
                console.log('validity date over')
                res.json({serverMsg: 'Validity Date Over!'})
            }
            else{
                console.log('other exist query error')
            }
        })

    })
}