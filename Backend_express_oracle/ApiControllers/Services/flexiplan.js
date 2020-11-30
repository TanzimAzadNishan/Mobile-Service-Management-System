const executeQuery = require('../../Database/queryIntoDB')
const getRandomId = require('../../Database/idGenerator')

module.exports = function(app){
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

        console.log(planDetails)

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

        UpdatePersonFlexiplanQuery = 
        `
        INSERT INTO PERSON_FLEXIPLAN (BUYER, SELECTED_PLAN)
        VALUES(:mobile_number, :id )
        `

        //executeQuery(setNewFlexiplanQuery,planDetails)
        executeQuery(updateAccountQuery,accountPlanDetails)
        .then(()=>{
            executeQuery(setNewFlexiplanQuery,planDetails)
            .then(()=>{
                executeQuery(UpdatePersonFlexiplanQuery,linkBuyerPlan)
                .then(()=>{
                    console.log('flexplan updated for user')
                    res.json({serverMsg: 'flexplan updated for user'})
                })
            })
        })
        })
}