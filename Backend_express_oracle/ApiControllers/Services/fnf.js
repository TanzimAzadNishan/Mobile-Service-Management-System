const executeQuery = require('../../Database/queryIntoDB')

module.exports = function(app){
    app.post('/fnf', (req, res)=>{
        console.log('retrieving fnf details: ', req.body)

        fnfInfo = {fnfs: null}

        fnfDetailsQuery =
        `
        SELECT FNF_TYPE, CALL_RATE, SMS_RATE
        FROM FNF
        `
        executeQuery(fnfDetailsQuery,req.body)
        .then((fnfRecord)=>{
            console.log(fnfRecord)
            console.log('fnf Information Retrieved')
            res.json({serverMsg: 'fnf Information Retrieved', 
            fnfInfo: fnfRecord.rows})

        })
        
    })

    app.post('/fnf/set', (req, res)=>{
        console.log('updating fnf details: ', req.body)

        fnfInfo = {
            name: req.body.name,
            mobile_number: req.body.number
        }
        
        fnfUpdateQuery =
        `
        UPDATE PERSON 
        SET CURRENT_FNF_PLAN = :name
        WHERE MOBILE_NUMBER = :mobile_number
        `
        executeQuery(fnfUpdateQuery,fnfInfo)
        .then(()=>{
            console.log('fnf Information Updated')
            res.json({serverMsg: 'fnf Information Updated'})

        })
    })

    
}