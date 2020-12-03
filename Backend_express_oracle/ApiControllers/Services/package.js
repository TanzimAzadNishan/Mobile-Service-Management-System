const executeQuery = require('../../Database/queryIntoDB')

module.exports = function(app){
    app.post('/package', (req, res)=>{
        console.log('retrieving package details: ', req.body)

        packageInfo = {pkgs: null}

        packageDetailsQuery =
        `
        SELECT PKG_NAME, CALL_RATE, SMS_RATE, FNF_NUM
        FROM PACKAGE
        `
        executeQuery(packageDetailsQuery,req.body)
        .then((pkgRecord)=>{
            console.log(pkgRecord)
            console.log('Package Information Retrieved')
            res.json({serverMsg: 'Package Information Retrieved', 
            packageInfo: pkgRecord.rows})

        })
        
    })

    app.post('/package/set', (req, res)=>{
        console.log('updating package details: ', req.body)

        pkgInfo = {
            name: req.body.name,
            mobile_number: req.body.number
        }
        
        packageUpdateQuery =
        `
        UPDATE PERSON 
        SET CURRENT_PKG = :name
        WHERE MOBILE_NUMBER = :mobile_number
        `
        executeQuery(packageUpdateQuery,pkgInfo)
        .then(()=>{
            console.log('Package Information Updated')
            res.json({serverMsg: 'Package Information Updated'})

        })
    })

    
}