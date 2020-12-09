const executeQuery = require('../Database/queryIntoDB')

var emitToReceiverQuery = 
`
SELECT SOCKET_ID
FROM ACCOUNT
WHERE MOBILE_NUMBER = :mobile_number
`

module.exports = function(sio){
    sio.on("connection", (socket) => {
        console.log('made socket connection ',socket.id)

        socket.on('socket-connection', (data)=>{
            console.log('establisihing connection...', data.userAuth)

            SocketQuery = 
            `
            UPDATE ACCOUNT
            SET SOCKET_ID = :socket_id
            WHERE MOBILE_NUMBER = :mobile_number
            `

            SocketInfo = {
                socket_id : socket.id,
                mobile_number: data.userAuth.mobile_number
            }

            executeQuery(SocketQuery, SocketInfo)
            .then(()=>{
                socket.emit('store-socket-id', {socketId: SocketInfo.socket_id})
            })
        })
    
        socket.on('admin-socket-connection', (data)=>{
            console.log('establisihing admin connection...', data.adminAuth)

            SocketQuery = 
            `
            UPDATE ADMIN
            SET SOCKET_ID = :socket_id
            WHERE ADMIN_NID = :nid
            `

            SocketInfo = {
                socket_id : socket.id,
                nid: data.adminAuth.NID
            }

            executeQuery(SocketQuery, SocketInfo)
            .then(()=>{
                socket.emit('store-admin-socket-id', {socketId: SocketInfo.socket_id})
            })
        })

        /*socket.on('waiting-call', (res)=>{
            console.log('waiting call.........: ', res.waitingInfo)
            executeQuery(emitToReceiverQuery, [res.waitingInfo.user1])
            .then((socketData)=>{
                var socketId = socketData.rows[0].SOCKET_ID
        
                sio.to(socketId).emit('receiver-is-engaged')
            })
    
        })*/
    });
}