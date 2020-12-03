const executeQuery = require('../../Database/queryIntoDB')

module.exports = function(app){
    app.post('/admin/get-info', (req, res)=>{
        //console.log(req.body)
    
        adminInfo = {
            feedback_sub: null,
            packageInfo: null,
            fnfInfo: null,
            offerInfo: null
        }

        FeedbackSubQuery = 
        `
        SELECT ASSIGNED_FEEDBACK_SUB
        FROM ADMIN
        WHERE ADMIN_NID = :NID
        `
        adminPkgQuery = 
        `
        SELECT PKG_NAME, CALL_RATE, SMS_RATE, FNF_NUM
        FROM PACKAGE
        `
        adminFNFQuery = 
        `
        SELECT FNF_TYPE, CALL_RATE, SMS_RATE
        FROM FNF
        `
        adminOfferQuery =
        `
        SELECT OFFER_ID, MONEY, VALIDITY, EARNED_PTS, INT_BAL, BONUS_INT_BAL, BONUS_PTS, MIN_BAL, BONUS_MIN_BAL, SMS_BAL, BONUS_SMS
        FROM OFFER  
        `

        executeQuery(FeedbackSubQuery, [req.body.NID])
        .then((record)=>{
            //console.log(record)
            adminInfo.feedback_sub = record.rows[0].ASSIGNED_FEEDBACK_SUB
            console.log('admin info retrieved')

            executeQuery(adminPkgQuery, [])
            .then((pkgRecord)=>{
                //console.log(pkgRecord)
                adminInfo.packageInfo = pkgRecord.rows
                console.log('package Information Retrieved')

                executeQuery(adminFNFQuery, [])
                .then((fnfRecord)=>{
                //console.log(fnfRecord)
                adminInfo.fnfInfo = fnfRecord.rows
                console.log('fnf Information Retrieved')

                executeQuery(adminOfferQuery, [])
                .then((offerRecord)=>{
                    //console.log(offerRecord)
                    adminInfo.offerInfo = offerRecord.rows
                    console.log('Offer Information Retrieved')
                    res.json({serverMsg: 'admin Information Retrieved', 
                    adminInfo:adminInfo})

                })

            })
        })

        })
    })

    app.post('/admin/set-new-package',(req,res)=>{
        console.log(req.body)
        newPkg = {
            name: req.body.new_pkg_name,
            callrate: req.body.new_pkg_callrate,
            smsrate: req.body.new_pkg_smsrate,
            fnfno: req.body.new_pkg_fnfno,
            NID: req.body.new_pkg_setter
        }

        setNewPackageQuery = 
        `
        INSERT INTO PACKAGE (PKG_NAME,CALL_RATE,SMS_RATE,FNF_NUM,SETTER_ID)
        VALUES(:name, :callrate, :smsrate, :fnfno, :NID)
        `
        executeQuery(setNewPackageQuery,newPkg)
        .then(()=>{
            res.json({serverMsg: 'new package set'})
        })
    })

    app.post('/admin/edit-package',(req,res)=>{
        console.log(req.body)
        editPkg = {
            name: req.body.edit_pkg_name,
            callrate: req.body.edit_pkg_callrate,
            smsrate: req.body.edit_pkg_smsrate,
            fnfno: req.body.edit_pkg_fnfno,
            NID: req.body.edit_pkg_setter
        }

        editPackageQuery = 
        `
        UPDATE PACKAGE
        SET CALL_RATE = :callrate, SMS_RATE = :smsrate, FNF_NUM = :fnfno, SETTER_ID  = :NID
        WHERE PKG_NAME = :name
        `
        executeQuery(editPackageQuery,editPkg)
        .then(()=>{
            res.json({serverMsg: 'package edited'})
        })
    })

    app.post('/admin/delete-package',(req,res)=>{
        console.log(req.body)
        del ={name: req.body.edit_pkg_name}

        deletePackageQuery = 
        `
        DELETE FROM PACKAGE
        WHERE PKG_NAME = :name
        `
        if(req.body.edit_pkg_name == 'Default'){
            console.log('not deleted')
            res.json({serverMsg: 'cannnot delete default package'})
        }
        else{
            executeQuery(deletePackageQuery,del)
            .then(()=>{
                console.log('deleted')
                res.json({serverMsg: 'package deleted'})
            })
        }
        
    })

    app.post('/admin/set-new-fnf',(req,res)=>{
        console.log(req.body)
        newfnf = {
            name: req.body.new_fnf_type,
            callrate: req.body.new_fnf_callrate,
            smsrate: req.body.new_fnf_smsrate
        }

        setNewfnfQuery = 
        `
        INSERT INTO FNF (FNF_TYPE,CALL_RATE,SMS_RATE)
        VALUES(:name, :callrate, :smsrate)
        `
        executeQuery(setNewfnfQuery,newfnf)
        .then(()=>{
            res.json({serverMsg: 'new fnf set'})
        })
    })

    app.post('/admin/edit-fnf',(req,res)=>{
        console.log(req.body)
        editfnf = {
            name: req.body.edit_fnf_type,
            callrate: req.body.edit_fnf_callrate,
            smsrate: req.body.edit_fnf_smsrate
        }

        editfnfQuery = 
        `
        UPDATE FNF
        SET CALL_RATE = :callrate, SMS_RATE = :smsrate
        WHERE FNF_TYPE = :name
        `
        executeQuery(editfnfQuery,editfnf)
        .then(()=>{
            console.log('fnf edited')
            res.json({serverMsg: 'fnf edited'})
        })
    })

    app.post('/admin/delete-fnf',(req,res)=>{
        console.log(req.body)
        del ={name: req.body.edit_fnf_type}

        deletefnfQuery = 
        `
        DELETE FROM FNF
        WHERE FNF_TYPE = :name
        `
        executeQuery(deletefnfQuery,del)
        .then(()=>{
            res.json({serverMsg: 'fnf deleted'})
        })
    })

    app.post('/admin/set-new-offer',(req,res)=>{
        console.log('hello')
        console.log(req.body)
        newOffer = {
            id: req.body.new_offer_ID,
            money: req.body.new_offer_money,
            validity: req.body.new_offer_validity,
            pts: req.body.new_offer_pts,
            bnspts: req.body.new_offer_bns_pts,
            int: req.body.new_offer_int,
            bnsint: req.body.new_offer_bns_int,
            talktime: req.body.new_offer_talktime,
            bnstalktime: req.body.new_offer_bns_talktime,
            sms: req.body.new_offer_sms,
            bnssms: req.body.new_offer_bns_sms,
            setter: req.body.new_offer_setter
        }

        setNewOfferQuery = 
        `
        INSERT INTO OFFER (OFFER_ID, SETTER_ID, MONEY, VALIDITY, EARNED_PTS, INT_BAL, BONUS_INT_BAL, BONUS_PTS, MIN_BAL, BONUS_MIN_BAL, SMS_BAL, BONUS_SMS)
        VALUES(:id, :setter, :money, :validity, :pts, :int, :bnsint, :bnspts, :talktime, :bnstalktime, :sms, :bnssms)
        `
        executeQuery(setNewOfferQuery,newOffer)
        .then(()=>{
            res.json({serverMsg: 'new offer set'})
        })
    })

    app.post('/admin/edit-offer',(req,res)=>{
        console.log(req.body)
        //console.log('hello')
        editedOffer = {
            id: req.body.edited_offer_ID,
            money: req.body.edited_offer_money,
            validity: req.body.edited_offer_validity,
            pts: req.body.edited_offer_pts,
            bnspts: req.body.edited_offer_bns_pts,
            int: req.body.edited_offer_int,
            bnsint: req.body.edited_offer_bns_int,
            talktime: req.body.edited_offer_talktime,
            bnstalktime: req.body.edited_offer_bns_talktime,
            sms: req.body.edited_offer_sms,
            bnssms: req.body.edited_offer_bns_sms,
            setter: req.body.edited_offer_setter
        }

        editOfferQuery = 
        `
        UPDATE OFFER
        SET SETTER_ID = :setter, MONEY = :money, VALIDITY = :validity, EARNED_PTS = :pts, INT_BAL = :int, BONUS_INT_BAL = :bnsint, BONUS_PTS = :bnspts, MIN_BAL = :talktime, BONUS_MIN_BAL = :bnstalktime, SMS_BAL = :sms, BONUS_SMS = :bnssms
        WHERE OFFER_ID = :id
        `
        //console.log('hello')
        executeQuery(editOfferQuery,editedOffer)
        .then(()=>{
            res.json({serverMsg: 'Offer edited'})
        })
    })

    app.post('/admin/delete-offer',(req,res)=>{
        console.log(req.body)
        del ={id: req.body.edited_offer_ID}

        deleteOfferQuery = 
        `
        DELETE FROM OFFER
        WHERE OFFER_ID = :id
        `
        executeQuery(deleteOfferQuery,del)
        .then(()=>{
            res.json({serverMsg: 'offer deleted'})
        })
    })

}

