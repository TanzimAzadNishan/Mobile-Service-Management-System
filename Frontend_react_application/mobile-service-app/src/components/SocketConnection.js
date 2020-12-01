import socketIOClient from 'socket.io-client'
import React, { useEffect, useRef } from 'react'

const SOCKET_SERVER_URL = "http://localhost:4000";
//const NEW_CHAT_MESSAGE_EVENT = "newChatMessage";


const SocketConnection = ()=>{
    //const [messages, setMessages] = useState([]);
    const socketRef = useRef();

    useEffect(()=>{
        console.log('use effect')
        socketRef.current = socketIOClient(SOCKET_SERVER_URL, {transports: ['websocket']})

        socketRef.current.on('your id', (message) => {
            console.log(message)
        });
    }, [])

    return (
        <>
            
        </>
    )
    
}

export default SocketConnection