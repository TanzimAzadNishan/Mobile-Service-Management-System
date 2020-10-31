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

    app.post('/dashboard/edit/current-package', (req, res)=>{
        console.log(req.body)

        PackageQuery = 
        `
        UPDATE PERSON
        SET CURRENT_PKG = :current_pkg
        WHERE MOBILE_NUMBER = :mobile_number
        `
        packageInfo = {
            current_pkg: req.body.package,
            mobile_number: req.body.mobile_number
        }
        executeQuery(PackageQuery, packageInfo)
        .then(()=>{
            res.json({serverMsg: 'Package Updated', package: packageInfo})
        })
    })

    app.post('/dashboard/edit/current-fnf-plan', (req, res)=>{
        console.log(req.body)

        FNFQuery = 
        `
        UPDATE PERSON
        SET CURRENT_FNF_PLAN = :current_fnf_plan
        WHERE MOBILE_NUMBER = :mobile_number
        `
        FNFInfo = {
            current_fnf_plan: req.body.current_fnf_plan,
            mobile_number: req.body.mobile_number
        }
        executeQuery(FNFQuery, FNFInfo)
        .then(()=>{
            res.json({serverMsg: 'FNF Plan Updated', fnfPlan: FNFInfo})
        })
    })
}