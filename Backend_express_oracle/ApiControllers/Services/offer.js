const insertOperation = require('../../Database/insertOperation')
const executeQuery = require('../../Database/queryIntoDB')

module.exports = function(app){
    app.post('/offer/popular', (req, res)=>{
        console.log('retrieving popular offer details: ', req.body)

        popular = {offers: null}

        popularofferDetailsQuery =
        `
        SELECT * 
        FROM OFFER
        WHERE OFFER_ID IN(
            SELECT OFFER_ID FROM PERSON_OFFER GROUP BY OFFER_ID HAVING COUNT(*) = 
            (SELECT MAX(c) FROM
                (SELECT COUNT(OFFER_ID) AS c
                    FROM PERSON_OFFER
                    GROUP BY OFFER_ID)))
        `
        executeQuery(popularofferDetailsQuery,[])
        .then((popularofferRecord)=>{
            console.log(popularofferRecord)
            console.log('popular offer Information Retrieved')
            res.json({serverMsg: 'popular offer Information Retrieved', 
            popular: popularofferRecord.rows})

        })
        
    })

    app.post('/offer', (req, res)=>{
        console.log('retrieving offer details: ', req.body)

        offerInfo = {offers: null}

        offerDetailsQuery =
        `
        SELECT *
        FROM OFFER
        `
        executeQuery(offerDetailsQuery,req.body)
        .then((offerRecord)=>{
            console.log(offerRecord)
            console.log('offer Information Retrieved')
            res.json({serverMsg: 'offer Information Retrieved', 
            offerInfo: offerRecord.rows})

        })
        
    })

    app.post('/offer/get-balance', (req,res)=>{
        console.log(req.body)
        personBalance = {
            balance: null,
            points: null
        }
    getBalanceQuery = 
    `
    SELECT ACCOUNT_BALANCE,POINTS FROM ACCOUNT
    WHERE MOBILE_NUMBER = :mobile_number
    `

    executeQuery(getBalanceQuery,[req.body.mobile_number])
    .then((record)=>{
        console.log(record)
        personBalance.balance = record.rows[0].ACCOUNT_BALANCE;
        personBalance.points = record.rows[0].POINTS;
        res.json({serverMsg: 'account balance retrieved', 
                    personInfo:personBalance})
    })
})


    app.post('/offer/buy', (req,res)=>{
        personOfferDetails = {
            offer_name : req.body.name,
            mobile_number : req.body.mobile_number
        }

        offerDetails = {
            amount: req.body.amount,
            pts: req.body.pts,
            bonus_pts : req.body.bonus_pts,
            int: req.body.int,
            bonus_int: req.body.bonus_int,
            talktime: req.body.talktime,
            bonus_talktime: req.body.bonus_talktime,
            sms: req.body.sms,
            bonus_sms: req.body.bonus_sms,
            mobile_number : req.body.mobile_number
        }

        personOfferQuery = 
        `
        INSERT INTO PERSON_OFFER
        VALUES(:mobile_number, :offer_name, SYSDATE)
        `

        updateAccountwithBalance = 
        `
        UPDATE ACCOUNT
        SET
        ACCOUNT_BALANCE = ACCOUNT_BALANCE - :amount,
        POINTS = POINTS + (:pts + :bonus_pts),
        INTERNET_BALANCE = INTERNET_BALANCE + (:int + :bonus_int),
        TALKTIME = TALKTIME + (:talktime + :bonus_talktime),
        SMS_BALANCE = SMS_BALANCE + (:sms + :bonus_sms)
        WHERE MOBILE_NUMBER = :mobile_number
        `

        updateAccountwithPoints = 
        `
        UPDATE ACCOUNT
        SET
        POINTS =  POINTS - :amount + :pts + :bonus_pts,
        INTERNET_BALANCE = INTERNET_BALANCE + :int + :bonus_int,
        TALKTIME = TALKTIME + :talktime + :bonus_talktime,
        SMS_BALANCE = SMS_BALANCE + :sms + :bonus_sms
        WHERE MOBILE_NUMBER = :mobile_number
        `

        insertOperation(personOfferQuery,personOfferDetails)
        .then((err)=>{
            if(!err){
                console.log('offer entried');
                if(req.body.type === 'B'){
                    executeQuery(updateAccountwithBalance,offerDetails)
                    .then(()=>{
                        console.log('offer bought with balance');
                        res.json({serverMsg: 'offer bought with balance'})
                    })
                }

                else if(req.body.type === 'P'){
                    executeQuery(updateAccountwithPoints,offerDetails)
                    .then(()=>{
                        console.log('offer bought with points');
                        res.json({serverMsg: 'offer bought with points'})
                    })
                }
            }
            else{
                res.json({serverMsg: 'offer couldnt  be bought'})
            }
        })
    })
    
}