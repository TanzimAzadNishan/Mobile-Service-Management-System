const executeQuery = require('../Database/queryIntoDB')

module.exports = function(app){
    app.post('/history', (req, res)=>{
        console.log('retrieving history details : ', req.body)
        
        historyInfo = {histories: null}

        historyDetailsQuery =
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

        var queryInfo = {
            mobile_number : req.body.mobile_number,
            history_type : 'call',
            contact_number : req.body.mobile_number

        }

        executeQuery(historyDetailsQuery, queryInfo)
        .then((historyrecord)=>{
            console.log(historyrecord)
            console.log('history Information Retrieved')
            res.json({serverMsg: 'History Information Retrieved', 
            historyInfo: historyrecord.rows})

        })
        
    })

    
}