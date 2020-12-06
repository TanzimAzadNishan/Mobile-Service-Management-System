const executeQuery = require('../../Database/queryIntoDB')
const insertOperation = require('../../Database/insertOperation')
const oracledb = require('oracledb')


function getFNFList(req, res){
    var getQuery = 
    `
    SELECT PERSON_FNF_ID, SENDER, RECEIVER, NAME
    FROM PERSON_FNF JOIN PERSON
    ON (PERSON.MOBILE_NUMBER = PERSON_FNF.RECEIVER)
    WHERE SENDER = :sender
    `
    
    executeQuery(getQuery, [req.body.sender])
    .then((record)=>{
        res.json({serverMsg: 'PERSON FNF List Retrieved Succesfully!', 
        personFNFList: record.rows})
    })
}

module.exports = function(app){
    app.post('/retrieve-person-fnf', (req, res)=>{
        console.log(req.body)
        getFNFList(req, res)
    })

    app.post('/add-person-fnf', (req, res)=>{
        console.log(req.body)
        var addQuery = 
        `
        INSERT INTO PERSON_FNF (PERSON_FNF_ID, SENDER, RECEIVER)
        VALUES (PERSON_FNF_ID_SEQ.NEXTVAL, :sender, :receiver)
        `
        var addInfo = {
            sender: req.body.sender,
            receiver: req.body.receiver
        }

        var existQuery =
        `
        BEGIN
            :ret := IS_MOBILE_NUMBER_EXIST(:receiver);
        END;
        `
        var personfnfexistQuery = 
        `
        BEGIN
            :ret := IS_PERSON_FNF_EXIST(:from_num, :to_num);
        END;
        `
        var exceededQuery = 
        `
        BEGIN
            IS_FNF_NUMBER_EXCEEDED(:sender, :msg);
        END;
        `
        var exceededInfo = {
            sender: req.body.sender,
            msg: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 100 }
        }
        var info1 = {
            receiver: req.body.receiver,
            ret: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 100 }
        }
        var info2 = {
            from_num: req.body.sender,
            to_num: req.body.receiver,
            ret: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 100 }
        }

        executeQuery(existQuery, info1)
        .then((result)=>{
            console.log(result.outBinds);
            if(result.outBinds.ret === 'True'){

                executeQuery(personfnfexistQuery, info2)
                .then((data)=>{
                    if(data.outBinds.ret === 'False'){

                        executeQuery(exceededQuery, exceededInfo)
                        .then((isExceeded)=>{
                            if(isExceeded.outBinds.msg === 'False'){
                                insertOperation(addQuery, addInfo)
                                .then((hasErr)=>{
                                    if(!hasErr){
                                        getFNFList(req, res)
                                    }
                                    else{
                                        console.log('error while inserting into person fnf')
                                    }
                                })
                            }
                            else if(isExceeded.outBinds.msg === 'True'){
                                console.log('Fnf number exceeded')
                                res.json({serverMsg: 'Your total fnf number has reached max fnf number!'})
                            }
                            else{
                                console.log('other exceeded query error')
                            }
                        })
                    }
                    else if(data.outBinds.ret === 'True'){
                        console.log('This person fnf already exists')
                        res.json({serverMsg: 'This mobile number is already in your fnf list!'})
                    }
                    else{
                        console.log('other data error')
                    }
                })
            }
            else if(result.outBinds.ret === 'False'){
                console.log('The mob num does not exist')
                res.json({serverMsg: 'This Mobile Number is not found!'})
            }
            else{
                console.log('other record error')
            }
        })
    })

    app.post('/delete-person-fnf', (req, res)=>{
        console.log(req.body)

        var deleteQuery = 
        `
        DELETE FROM PERSON_FNF
        WHERE SENDER = :sender
        AND RECEIVER = :receiver
        `
        var deleteInfo = {
            sender: req.body.sender,
            receiver: req.body.receiver
        }

        executeQuery(deleteQuery, deleteInfo)
        .then(()=>{
            getFNFList(req, res)
        })
    })
}