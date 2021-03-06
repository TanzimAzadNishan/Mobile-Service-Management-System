
const initState = {
    connectionList: null,
    connectionErr: null,
    pointTransferErr: null
}

const connectionReducer = (state = initState, action)=>{
    const conListInStore = localStorage.getItem('connectionList')

    if(action.type === 'STORE_ALL_CONNECTIONS'){
        console.log('connection list stored')
        localStorage.setItem('connectionList', JSON.stringify(action.connectionInfo))
        const conListData = localStorage.getItem('connectionList')

        return{
            ...state,
            connectionList: conListData ? JSON.parse(conListData) : null
        }
    }

    else if(action.type === 'CONNECTION_LINK_ERR'){
        return{
            ...state,
            connectionErr: action.error
        }
    }   
    else if(action.type === 'REFRESH_LINK_ERROR'){
        return{
            ...state,
            connectionErr: null
        }
    }

    else if(action.type === 'POINT_TRANSFER_ERR'){
        return{
            ...state,
            pointTransferErr: action.error
        }
    } 
    else if(action.type === 'REFRESH_POINT_TRANSFER_ERROR'){
        return{
            ...state,
            pointTransferErr: null
        }
    } 

    return{
        ...state,
        connectionList: conListInStore ? JSON.parse(conListInStore) : null
    }
}

export default connectionReducer