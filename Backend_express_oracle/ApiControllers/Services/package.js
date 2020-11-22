const executeQuery = require('../../Database/queryIntoDB')

module.exports = function(app){
    app.post('/package', (req, res)=>{
        console.log('retrieving package details: ', req.body)


        packageDetailsQuery =
        `
        SELECT PKG_NAME, CALL_RATE, SMS_RATE, FNF_NUM
        FROM PACKAGE
        `
        executeQuery(packageDetailsQuery)
        .then((pkgRecord)=>{
            console.log(pkgRecord)
        })

        console.log('Package Information Retrieved')
        res.json({serverMsg: 'Package Information Retrieved', 
                packageInfo: pkgRecord})

    })
}