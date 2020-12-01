import socketIOClient from 'socket.io-client'

const SOCKET_SERVER_URL = "http://localhost:4000";

const socket = socketIOClient(SOCKET_SERVER_URL, {transports: ['websocket']})

export {socket}