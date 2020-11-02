const executeQuery = require('../../Database/oracleSetup')
const getRandomId = require('../../Database/idGenerator')

module.exports = function(app){
    app.post('/dashboard/account-details', (req, res)=>{
        console.log('retrieving account details: ', req.body)

        accountDetails = {
            accountInfo: null,
            packageInfo: null,
            fnfInfo: null
        }

        AccountQuery = 
        `
        SELECT ACCOUNT_BALANCE, INTERNET_BALANCE, TALKTIME, SMS_BALANCE, POINTS
        FROM ACCOUNT
        WHERE MOBILE_NUMBER = :mobile_number
        `
        findPackageQuery = 
        `
        SELECT PKG_NAME, CALL_RATE, SMS_RATE, FNF_NUM
        FROM PACKAGE
        WHERE PKG_NAME = 
        (
            SELECT CURRENT_PKG
            FROM PERSON
            WHERE MOBILE_NUMBER = :mobile_number
        )
        `

        findFNFQuery = 
        `
        SELECT CURRENT_FNF_PLAN
        FROM PERSON
        WHERE MOBILE_NUMBER = :mobile_number
        `
        FNFQuery = 
        `
        SELECT FNF_TYPE, CALL_RATE, SMS_RATE
        FROM FNF
        WHERE FNF_TYPE = :fnf_type
        `
        executeQuery(AccountQuery, [req.body.mobile_number])
        .then((accRecord)=>{
            console.log(accRecord)
            accountDetails.accountInfo = accRecord.rows[0]

            /*accountDetails.accountInfo = {
                ACCOUNT_BALANCE: accRecord.rows[0].ACCOUNT_BALANCE,
                INTERNET_BALANCE: accRecord.rows[0].INTERNET_BALANCE,
                TALKTIME: accRecord.rows[0].TALKTIME,
                SMS_BALANCE: accRecord.rows[0].SMS_BALANCE,
                POINTS: accRecord.rows[0].POINTS
            }*/


            executeQuery(findPackageQuery, [req.body.mobile_number])
            .then((pkgRecord)=>{
                console.log(pkgRecord)

                accountDetails.packageInfo = pkgRecord.rows[0]
                /*accountDetails.packageInfo = {
                    PKG_NAME: pkgRecord.rows[0].PKG_NAME,
                    CALL_RATE: pkgRecord.rows[0].CALL_RATE,
                    SMS_RATE: pkgRecord.rows[0].SMS_RATE,
                    FNF_NUM: pkgRecord.rows[0].FNF_NUM
                }*/

                executeQuery(findFNFQuery, [req.body.mobile_number])
                .then((fnfRecord)=>{
                    console.log(fnfRecord)

                    if(fnfRecord.rows[0].CURRENT_FNF_PLAN != null){
                        executeQuery(FNFQuery, [fnfRecord.rows[0].CURRENT_FNF_PLAN])
                        .then((data)=>{
                            accountDetails.fnfInfo = data.rows[0]
                            /*accountDetails.fnfInfo = {
                                FNF_TYPE: data.rows[0].FNF_TYPE,
                                CALL_RATE: data.rows[0].CALL_RATE,
                                SMS_RATE: data.rows[0].SMS_RATE
                            }*/

                            console.log('Account Information Retrieved')
                            res.json({serverMsg: 'Account Information Retrieved', 
                                    accountDetails: accountDetails})
                        })
                    }
                    else{
                        console.log('Account Information Retrieved')
                        res.json({serverMsg: 'Account Information Retrieved', 
                                    accountDetails: accountDetails})
                    }
                })
            })
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