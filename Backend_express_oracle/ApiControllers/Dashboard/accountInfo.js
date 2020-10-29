const executeQuery = require('../../Database/oracleSetup')
const getRandomId = require('../../Database/idGenerator')

module.exports = function(app){
    app.get('/dashboard', (req, res)=>{
        console.log(req.body)

        AccountQuery = 
        `
        SELECT ACCOUNT_BALANCE, INTERNET_BALANCE, TALKTIME, SMS_BALANCE, POINTS
        FROM ACCOUNT
        WHERE MOBILE_NUMBER = :mobile_number
        `
        executeQuery(AccountQuery, [req.body.mobile_number])
        .then((record)=>{
            console.log(record)
            res.json({serverMsg: 'Account Information Retrieved', accountInfo: record})
        })
    })
}