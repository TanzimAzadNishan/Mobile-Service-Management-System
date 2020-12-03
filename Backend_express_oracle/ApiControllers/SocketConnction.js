const executeQuery = require('../Database/queryIntoDB')

module.exports = function(sio){
    sio.on("connection", (socket) => {
        //console.log('made socket connection ',socket.id)

        socket.on('socket-connection', (data)=>{
            //console.log('establisihing connection...', data.userAuth)

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
    });
}