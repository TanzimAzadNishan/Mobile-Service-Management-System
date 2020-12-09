const initState = {
    lastSessionHistoryId: null,
    lastTalktimeId: null,
    intcallsmsError: null
}

const intcallsmsReducer = (state = initState, action)=>{
    const historyidinstore = localStorage.getItem('lastSessionHistoryId')
    //const talktimeidinstore = localStorage.getItem('lastTalktimeId')

    if(action.type === 'STORE_SESSION_HISTORY_ID'){
        console.log('lastSessionHistoryId stored')
        localStorage.setItem('lastSessionHistoryId', JSON.stringify(action.lastSessionHistoryId))
        const historyData = localStorage.getItem('lastSessionHistoryId')

        return{
            ...state,
            lastSessionHistoryId: historyData ? JSON.parse(historyData) : null
        }
    }

    else if(action.type === 'STORE_TALKTIME_ID'){
        console.log('last talktime id stored')
        localStorage.setItem('lastTalktimeId', JSON.stringify(action.lastTalktimeId))
        const talktimeidData = localStorage.getItem('lastTalktimeId')

        return{
            ...state,
            lastTalktimeId: talktimeidData ? JSON.parse(talktimeidData) : null
        }
    }

    else if(action.type === 'INT_CALL_SMS_ERR'){
        console.log('error stored')

        return{
            ...state,
            intcallsmsError: action.error
        }
    }
    else if(action.type === 'REFRESH_INT_CALL_SMS_ERROR'){
        return{
            ...state,
            intcallsmsError: null
        }
    }

    return{
        ...state,
        lastSessionHistoryId: historyidinstore ? JSON.parse(historyidinstore) : null,
        //lastTalktimeId: talktimeidinstore ? JSON.parse(talktimeidinstore) : null
    }
}

export default intcallsmsReducer;