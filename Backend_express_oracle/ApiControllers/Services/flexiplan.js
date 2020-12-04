const executeQuery = require('../../Database/queryIntoDB')
const insertOperation = require('../../Database/insertOperation')
const getRandomId = require('../../Database/idGenerator')

module.exports = function(app){
    app.post('/flexiplan/get-balance', (req,res)=>{
        console.log(req.body)
        personBalance = {
            balance: null
        }
    getBalanceQuery = 
    `
    SELECT ACCOUNT_BALANCE FROM ACCOUNT
    WHERE MOBILE_NUMBER = :mobile_number
    `

    executeQuery(getBalanceQuery,[req.body.mobile_number])
    .then((record)=>{
        console.log(record)
        personBalance.balance = record.rows[0].ACCOUNT_BALANCE
        res.json({serverMsg: 'account balance retrieved', 
                    personInfo:personBalance})
    })
    })

    app.post('/flexiplan/update-account', (req,res)=>{
        //console.log(req.body)
        const id = getRandomId(15);
        accountPlanDetails = {
            amount: req.body.amount,
            internet: req.body.internet,
            talktime: req.body.talktime,
            sms: req.body.sms,
            mobile_number: req.body.mobile_number
        }
        planDetails = {
            id: id,
            amount: req.body.amount,
            internet: req.body.internet,
            talktime: req.body.talktime,
            sms: req.body.sms,
            validity: req.body.validity
        }

        linkBuyerPlan = {
            id: id,
            mobile_number: req.body.mobile_number
        }

        planInfo = {
            amount: req.body.amount,
            internet: req.body.internet,
            talktime: req.body.talktime,
            sms: req.body.sms,
            validity: req.body.validity
        }

        planExistsAccountInfo = {
            mobile_number: req.body.mobile_number,
            amount: req.body.amount,
            internet: req.body.internet,
            talktime: req.body.talktime,
            sms: req.body.sms,
            validity: req.body.validity
        }

        console.log(planDetails)

        flexiplanExistsQuery =
        `
        SELECT FLEXIPLAN_ID FROM FLEXIPLAN 
        WHERE 
        INTERNET_QUANTITY = :internet AND
        TALKTIME_QUANTITY = :talktime AND
        SMS_QUANTITY = :sms AND
        VALIDITY = :validity AND
        AMOUNT_NEEDED = :amount
        `

        updateAccountQuery = 
        `
        UPDATE ACCOUNT
        SET
        ACCOUNT_BALANCE = ACCOUNT_BALANCE - :amount,
        INTERNET_BALANCE = INTERNET_BALANCE + :internet,
        TALKTIME = TALKTIME + :talktime,
        SMS_BALANCE = SMS_BALANCE + :sms
        WHERE MOBILE_NUMBER = :mobile_number
        `

        setNewFlexiplanQuery = 
        `
        INSERT INTO FLEXIPLAN (FLEXIPLAN_ID, INTERNET_QUANTITY, TALKTIME_QUANTITY, SMS_QUANTITY, VALIDITY, AMOUNT_NEEDED)
        VALUES(:id, :internet, :talktime, :sms, :validity, :amount)
        `
        UpdatePersonExistingFlexiplanQuery = 
        `
        INSERT INTO PERSON_FLEXIPLAN
        VALUES(:mobile_number,(SELECT FLEXIPLAN_ID FROM FLEXIPLAN
                        WHERE
                        INTERNET_QUANTITY = :internet AND
                        TALKTIME_QUANTITY = :talktime AND
                        SMS_QUANTITY = :sms AND
                        VALIDITY = :validity AND
                        AMOUNT_NEEDED = :amount),SYSDATE)
        `

        UpdatePersonFlexiplanQuery = 
        `
        INSERT INTO PERSON_FLEXIPLAN 
        VALUES(:mobile_number, :id, SYSDATE)
        `

        executeQuery(flexiplanExistsQuery,planInfo)
        .then((record)=>{
            if(record.rows.length!=0){
                insertOperation(UpdatePersonExistingFlexiplanQuery,planExistsAccountInfo)
                .then((planerr)=>{
                    if(!planerr){
                    executeQuery(updateAccountQuery,accountPlanDetails)
                    .then(()=>{
                        console.log('existing flexplan updated for user')
                        res.json({serverMsg: 'existing flexplan updated for user'})
                    })}
                })
            }
            else{
                executeQuery(updateAccountQuery,accountPlanDetails)
                .then(()=>{
                    insertOperation(setNewFlexiplanQuery,planDetails)
                    .then((planerr)=>{
                        if(!planerr){
                        insertOperation(UpdatePersonFlexiplanQuery,linkBuyerPlan)
                        .then((personplanerr)=>{
                            if(!personplanerr){
                            console.log('flexplan updated for user')
                            res.json({serverMsg: 'flexplan updated for user'})
                        }})}
                    })
                })
            }

        })
        
    })
}