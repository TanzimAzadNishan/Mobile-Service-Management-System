const executeQuery = require('../../Database/queryIntoDB')
const getRandomId = require('../../Database/idGenerator')

module.exports = function(app){
    app.post('/dashboard/account-details', (req, res)=>{
        console.log('retrieving account details: ', req.body)

        accountDetails = {
            accountInfo: null,
            packageInfo: null,
            fnfInfo: null
        }

        PersonQuery = 
        `
        SELECT NAME, PASSWORD, EMAIL, DOB, GENDER, ADDRESS, PHOTO
        FROM PERSON
        WHERE MOBILE_NUMBER = :mobile_number
        `

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

        personInfo = {}

        executeQuery(AccountQuery, [req.body.mobile_number])
        .then((accRecord)=>{
            console.log(accRecord)
            accountDetails.accountInfo = accRecord.rows[0]

            executeQuery(findPackageQuery, [req.body.mobile_number])
            .then((pkgRecord)=>{
                console.log(pkgRecord)

                accountDetails.packageInfo = pkgRecord.rows[0]

                executeQuery(findFNFQuery, [req.body.mobile_number])
                .then((fnfRecord)=>{
                    console.log(fnfRecord)

                    executeQuery(PersonQuery, [req.body.mobile_number])
                    .then((personRecord)=>{

                        personInfo.name = personRecord.rows[0].NAME
                        personInfo.password = personRecord.rows[0].PASSWORD
                        personInfo.email = personRecord.rows[0].EMAIL
                        personInfo.dob = personRecord.rows[0].DOB
                        personInfo.gender = personRecord.rows[0].GENDER
                        personInfo.address = personRecord.rows[0].ADDRESS
                        personInfo.photo = personRecord.rows[0].PHOTO

                        if(personInfo.dob){
                            var dateStr = personInfo.dob.toString()
                            var timeArr = dateStr.split(' ')
                
                            var dateFmtOracle = timeArr[2] + '-' + timeArr[1] + '-' + timeArr[3]
                            personInfo.dob = dateFmtOracle
                        }

                        accountDetails.personInfo = personInfo

                        if(fnfRecord.rows[0].CURRENT_FNF_PLAN != null){
                            executeQuery(FNFQuery, [fnfRecord.rows[0].CURRENT_FNF_PLAN])
                            .then((data)=>{
                                accountDetails.fnfInfo = data.rows[0]
    
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