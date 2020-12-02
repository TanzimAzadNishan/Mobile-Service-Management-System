import connectionService from '../../../utilities/Services/Service/connectionService'
import {socket} from '../../../utilities/SocketIOClient'

export const retrieveConnectionList = (info) => {
    return(dispatch, getState) => {
        connectionService.onRetrieveConnectionList(info)
        .then((res)=> {
            console.log(res)

            if(res.data.serverMsg === 'Retrieved Connection List Successfully!'){
                dispatch({type: 'STORE_ALL_CONNECTIONS', connectionInfo: res.data.connectionInfo})
            }
            
        }, ()=>{
            console.log('connect with others failed')
        })
    }
}

export const createNewConnection = (info) => {
    return(dispatch, getState) => {
        connectionService.onCreateNewConnection(info)
        .then((res)=> {

            if(res.data.serverMsg === 'Retrieved Connection List Successfully!'){
                dispatch({type: 'STORE_ALL_CONNECTIONS', connectionInfo: res.data.connectionInfo})
            }
            else if(res.data.serverMsg === 'You have already requested for this link!'){
                dispatch({type: 'CONNECTION_LINK_ERR', error: res.data.serverMsg})

                setTimeout(()=>{
                    dispatch({type: 'REFRESH_LINK_ERROR'})
                }, 3000)
            }
            else if(res.data.serverMsg === 'This Mobile Number is not found'){
                dispatch({type: 'CONNECTION_LINK_ERR', error: res.data.serverMsg})

                setTimeout(()=>{
                    dispatch({type: 'REFRESH_LINK_ERROR'})
                }, 3000)
            }
            
        }, ()=>{
            console.log('create new connection failed')
        })
    }
}

export const receiveNewConnection = () => {
    return(dispatch, getState) => {            
        socket.on('send-new-connection', (res)=>{
            dispatch({type: 'STORE_ALL_CONNECTIONS', connectionInfo: res.connectionInfo})
        }) 
    }
}

export const acceptLinkRequest = (info) => {
    return(dispatch, getState) => {
        connectionService.onAcceptLinkRequest(info)
        .then((res)=>{
            dispatch({type: 'STORE_ALL_CONNECTIONS', connectionInfo: res.data.connectionInfo})
        })            
    
    }
}
export const discardLinkRequest = (info) => {
    return(dispatch, getState) => {
        connectionService.onDiscardLinkRequest(info)
        .then((res)=>{
            dispatch({type: 'STORE_ALL_CONNECTIONS', connectionInfo: res.data.connectionInfo})
        })            
    
    }
}
export const sendPointRequest = (info) => {
    return(dispatch, getState) => {
        connectionService.onSendPointRequest(info)
        .then((res)=>{
            console.log(res.data.connectionInfo)
            dispatch({type: 'STORE_ALL_CONNECTIONS', connectionInfo: res.data.connectionInfo})
        })            
    
    }
}
export const transferPoint = (info) => {
    return(dispatch, getState) => {
        connectionService.onTransferPoint(info)
        .then((res)=>{
            //console.log(res.data.connectionInfo)
            dispatch({type: 'STORE_ALL_CONNECTIONS', connectionInfo: res.data.connectionInfo})
        })            
    
    }
}

export const deleteAcceptedLink = (info) => {
    return(dispatch, getState) => {
        connectionService.onDeleteAcceptedLink(info)
        .then((res)=>{
            dispatch({type: 'STORE_ALL_CONNECTIONS', connectionInfo: res.data.connectionInfo})
        })            
    
    }
}