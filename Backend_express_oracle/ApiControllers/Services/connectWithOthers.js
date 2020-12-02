const executeQuery = require('../../Database/queryIntoDB')
//const plSqlOperation = require('../../Database/plSqlOperation')
const oracledb = require('oracledb')
const insertOperation = require('../../Database/insertOperation')

const getRandomId = require('../../Database/idGenerator')


var RetrieveLinkQuery =
`
SELECT LINKED_MOBILE_NUMBER, LINK_TYPE, NAME
FROM LINK JOIN PERSON 
ON (LINK.LINKED_MOBILE_NUMBER = PERSON.MOBILE_NUMBER)
WHERE LINK_CREATOR = :fromNum
`
var OtherLinkQuery =
`
SELECT LINK_CREATOR, LINK_TYPE, NAME, LINK.POINTS AS LP
FROM LINK JOIN PERSON
ON (LINK.LINK_CREATOR = PERSON.MOBILE_NUMBER) 
WHERE LINKED_MOBILE_NUMBER = :fromNum
`
var RetrieveSocketQuery = 
`
SELECT SOCKET_ID
FROM ACCOUNT
WHERE MOBILE_NUMBER = :mobile_number
`

function retrieveAllTypesOfLinks(req, res){
    var list = []
    var pendingList = []
    var item = {}
    executeQuery(RetrieveLinkQuery, [req.body.from])
    .then((links)=>{

        console.log('in function link...... ', links.rows)

        for(var i = 0; i < links.rows.length; i++){
            item = {}
            item.linkedName = links.rows[i].NAME
            item.linkedNumber = links.rows[i].LINKED_MOBILE_NUMBER
            item.linkType = links.rows[i].LINK_TYPE

            if(item.linkType === 'A'){
                list.push(item)
            }
        }

        executeQuery(OtherLinkQuery, [req.body.from])
        .then((record)=>{
            console.log('in function record...... ', record.rows)
            for(var i = 0; i < record.rows.length; i++){
                item = {}
                item.linkedName = record.rows[i].NAME
                item.linkedNumber = record.rows[i].LINK_CREATOR
                item.linkType = record.rows[i].LINK_TYPE

                if(item.linkType === 'A'){
                    list.push(item)
                }
                if(item.linkType === 'P'){
                    pendingList.push(item)
                }
                if(item.linkType === 'PR'){
                    item.points = record.rows[i].LP
                    pendingList.push(item)
                }

                if(i+1 === record.rows.length){
                    console.log('list is : ', list)
                    console.log('pending list is : ', pendingList)
                    console.log('Retrieved Connection List Successfully!')

                    res.json({serverMsg: 'Retrieved Connection List Successfully!', 
                    connectionInfo: {list: list, pendingList: pendingList}})
                }
            }

            if(record.rows.length === 0){
                res.json({serverMsg: 'Retrieved Connection List Successfully!', 
                connectionInfo: {list: list, pendingList: pendingList}})
            }
        }) 
    })
}

function emitAfterRetrieving(req, sio){
    var list = []
    var pendingList = []
    var item = {}

    executeQuery(RetrieveSocketQuery, [req.body.to])
    .then((socRecord)=>{
        list = []
        console.log(socRecord.rows[0])

        executeQuery(RetrieveLinkQuery, [req.body.to])
        .then((links)=>{

            for(var i = 0; i < links.rows.length; i++){
                item = {}
                item.linkedName = links.rows[i].NAME
                item.linkedNumber = links.rows[i].LINKED_MOBILE_NUMBER
                item.linkType = links.rows[i].LINK_TYPE

                if(item.linkType === 'A'){
                    list.push(item)
                }
            }

            executeQuery(OtherLinkQuery, [req.body.to])
            .then((record)=>{
                for(var i = 0; i < record.rows.length; i++){
                    item = {}
                    item.linkedName = record.rows[i].NAME
                    item.linkedNumber = record.rows[i].LINK_CREATOR
                    item.linkType = record.rows[i].LINK_TYPE

                    if(item.linkType === 'A'){
                        list.push(item)
                    }
                    if(item.linkType === 'P'){
                        pendingList.push(item)
                    }
                    if(item.linkType === 'PR'){
                        item.points = record.rows[i].LP
                        pendingList.push(item)
                    }

                    if(i+1 === record.rows.length){
                        console.log('before emitting..........')
                        console.log('list is : ', list)
                        console.log('pending list is : ', pendingList)

                        sio.to(socRecord.rows[0].SOCKET_ID)
                        .emit('send-new-connection', 
                        {connectionInfo: {list: list, pendingList: pendingList}})
                    }
                }

                if(record.rows.length === 0){
                    sio.to(socRecord.rows[0].SOCKET_ID)
                    .emit('send-new-connection', 
                    {connectionInfo: {list: list, pendingList: pendingList}})
                }
            }) 
        })
    })
}

module.exports = function(app, sio){
    app.post('/accept-link-request', (req, res)=>{
        console.log('------accepting link request-----------')
        console.log(req.body)

        var UpdateLinkQuery = 
        `
        UPDATE LINK
        SET LINK_TYPE = :link_type
        WHERE LINK_CREATOR = :toNum
        AND LINKED_MOBILE_NUMBER = :fromNum
        AND LINK_TYPE = :prev
        `

        var UpdateInfo = {
            link_type: 'A',
            fromNum: req.body.from,
            toNum: req.body.to,
            prev: req.body.prev,
        }

        executeQuery(UpdateLinkQuery, UpdateInfo)
        .then((links)=>{
            retrieveAllTypesOfLinks(req, res)
            emitAfterRetrieving(req, sio)
        })
    })

    app.post('/discard-link-request', (req, res)=>{
        console.log(req.body)
        var DeleteQuery = 
        `
        DELETE FROM LINK
        WHERE LINK_CREATOR = :toNum
        AND LINKED_MOBILE_NUMBER = :fromNum
        AND LINK_TYPE = :link_type
        `

        var DeleteInfo = {
            fromNum: req.body.from,
            toNum: req.body.to,
            link_type: req.body.type
        }

        executeQuery(DeleteQuery, DeleteInfo)
        .then((data)=>{
            console.log(data)
            retrieveAllTypesOfLinks(req, res)
            emitAfterRetrieving(req, sio)
        })
    })

    app.post('/send-point-request', (req, res)=>{
        console.log(req.body)

        var LinkQuery =
        `
        INSERT INTO LINK (LINK_ID, LINK_CREATOR, LINKED_MOBILE_NUMBER, LINK_TYPE, POINTS)
        VALUES (LINK_ID_SEQ.NEXTVAL, :fromNum, :toNum, :link_type, :points)
        `
        var LinkInfo = {
            fromNum: req.body.from,
            toNum: req.body.to,
            link_type: req.body.link_type,
            points: req.body.points
        }
        insertOperation(LinkQuery, LinkInfo)
        .then((hasError)=>{
            if(!hasError){

                retrieveAllTypesOfLinks(req, res)
                emitAfterRetrieving(req, sio)
            }
            else{
               console.log('connect with others failed')    
            }
        })
    })

    app.post('/transfer-point', (req, res)=>{
        console.log(req.body)
        var UpdateQuery = 
        `
        UPDATE LINK
        SET POINTS = :points
        WHERE LINK_CREATOR = :toNum
        AND LINKED_MOBILE_NUMBER = :fromNum
        AND LINK_TYPE = :link_type
        `
        var UpdateInfo = {
            fromNum: req.body.from,
            toNum: req.body.to,
            link_type: req.body.link_type,
            points: req.body.points
        }
        var DeleteQuery = 
        `
        DELETE FROM LINK
        WHERE LINK_CREATOR = :toNum
        AND LINKED_MOBILE_NUMBER = :fromNum
        AND LINK_TYPE = :link_type
        `
        var DeleteInfo = {
            fromNum: req.body.from,
            toNum: req.body.to,
            link_type: req.body.link_type
        }

        executeQuery(UpdateQuery, UpdateInfo)
        .then(()=>{
            executeQuery(DeleteQuery, DeleteInfo)
            .then(()=>{
                retrieveAllTypesOfLinks(req, res)
            })
        })
        
    })

    app.post('/connection-list', (req, res)=>{
        console.log('------- connection-list --------')
        console.log(req.body)
        retrieveAllTypesOfLinks(req, res)
    })

    app.post('/create-new-connection', (req, res)=>{
        console.log('retrieving new connection from details: ', req.body)

        var LinkToDB =
        `
        BEGIN
            :ret := IS_LINK_EXIST(:from_num, :to_num);
        END;
        `
        var linktodbinfo = {
            from_num: req.body.from,
            to_num: req.body.to,
            ret: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 100 }
        }
        var LinkQuery =
        `
        INSERT INTO LINK (LINK_ID, LINK_CREATOR, LINKED_MOBILE_NUMBER, LINK_TYPE)
        VALUES (LINK_ID_SEQ.NEXTVAL, :fromNum, :toNum, :link_type)
        `
        var LinkInfo = {
            fromNum: req.body.from,
            toNum: req.body.to,
            link_type: req.body.link_type
        }

        executeQuery(LinkToDB, linktodbinfo)
        .then((result)=>{
            console.log('pl sql console..........')
            console.log(result.outBinds);

            if(result.outBinds.ret === 'False'){
                insertOperation(LinkQuery, LinkInfo)
                .then((hasError)=>{
                    if(!hasError){
        
                        retrieveAllTypesOfLinks(req, res)
                        emitAfterRetrieving(req, sio)
                    }
                    else{
                       console.log('connect with others failed')
                       res.json({serverMsg: 'This Mobile Number is not found'})     
                    }
                })
            }
            else if(result.outBinds.ret === 'True'){
                console.log('This link already exists')
                res.json({serverMsg: 'You have already requested for this link!'})
            }
            else{
                console.log('other error')
            }
        })

    })

    app.post('/delete-accepted-link', (req, res)=>{
        console.log(req.body)
        var DeleteQuery = 
        `
        DELETE FROM LINK
        WHERE LINK_TYPE = :link_type
        AND (
        (
            LINK_CREATOR = :toNum
            AND LINKED_MOBILE_NUMBER = :fromNum
        ) OR
        (
            LINK_CREATOR = :fromNum
            AND LINKED_MOBILE_NUMBER = :toNum
        )
        )
        `

        var DeleteInfo = {
            fromNum: req.body.from,
            toNum: req.body.to,
            link_type: req.body.type
        }

        executeQuery(DeleteQuery, DeleteInfo)
        .then((data)=>{
            console.log(data)
            retrieveAllTypesOfLinks(req, res)
            emitAfterRetrieving(req, sio)
        })
    })

}