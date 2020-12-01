//const connectToOracle = require('../../Database/oracleSetup')
//const oracleConfig = require('../../Database/oracleSetup')
const insertOperation = require('../../Database/insertOperation')
const getRandomId = require('../../Database/idGenerator')
const oracledb = require('oracledb')

module.exports = function(app){
    app.post('/signup', async (req, res)=>{
        console.log(req.body)

        message = {
            successMsg: 'Account Created Succesfully!',
            errorMsg: 'User Already Exists'
        }

        PersonQuery =
        `
        INSERT INTO PERSON (MOBILE_NUMBER, NAME, PASSWORD, CURRENT_PKG)
        VALUES (:mobile_number, :name, :password, :current_pkg)
        `
        PersonInfo = {
            mobile_number : req.body.mobile_number,
            name: req.body.name,
            password: req.body.password,
            current_pkg: 'Default'
        }

        /*AccountQuery = 
        `
        INSERT INTO ACCOUNT (ACCOUNT_TRACKING_ID, ACCOUNT_BALANCE, INTERNET_BALANCE, 
            TALKTIME, SMS_BALANCE, POINTS, MOBILE_NUMBER)
        VALUES (:acc_track_id, :acc_bal, :int_bal, :talktime, :sms_bal, :points, :mob_num)
        `
        AccountInfo = {
            acc_track_id: getRandomId(15),
            acc_bal: 0.0,
            int_bal: 0.0,
            talktime: 0,
            sms_bal: 0,
            points: 0,
            mob_num: req.body.mobile_number
        }*/

        insertOperation(PersonQuery, PersonInfo)
        .then((hasPersonErr)=>{

            if(!hasPersonErr){
                /*insertOperation(AccountQuery, AccountInfo)
                .then((hasAccErr)=>{

                    if(!hasAccErr){*/
                        res.json({serverMsg: 'Account Created Succesfully!', 
                        userAccount: PersonInfo})
                
                }
            
            else{
                res.json({serverMsg: 'User Already Exists'})   
            }
        })


        //insertQuery(PersonQuery, PersonInfo)
        //.then(()=>{

            //insertQuery(AccountQuery, AccountInfo)
            //.then(()=>{

                //res.json({serverMsg: 'Account Created Succesfully!', 
                //userAccount: PersonInfo})
            //})
        //})
            /*else{
                console.log('user already exists')
                res.json({serverMsg: 'User Already Exists'})
            }*/
    })
}