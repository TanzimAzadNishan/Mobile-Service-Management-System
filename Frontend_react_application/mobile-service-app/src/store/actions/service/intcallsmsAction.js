import intcallsmsService from '../../../utilities/Services/Service/intcallsmsService'

export const sendSMS = (info) => {
    return(dispatch, getState) => {
        intcallsmsService.onSendSMS(info)
        .then((res)=> {
            console.log(res)

            if(res.data.serverMsg === 'Not sufficient balance to send sms'){
                dispatch({type: 'INT_CALL_SMS_ERR', error: res.data.serverMsg})

                setTimeout(()=>{
                    dispatch({type: 'REFRESH_INT_CALL_SMS_ERROR'})
                }, 3000)
            }

            else if(res.data.serverMsg === 'This Mobile Number is not found!' ||
                res.data.serverMsg === 'Validity Date Over!'
            ){
                dispatch({type: 'INT_CALL_SMS_ERR', error: res.data.serverMsg})

                setTimeout(()=>{
                    dispatch({type: 'REFRESH_INT_CALL_SMS_ERROR'})
                }, 3000)
            }
            
        }, ()=>{
            console.log('send sms failed')
        })
    }
}

export const startSession = (info) => {
    return(dispatch, getState) => {
        intcallsmsService.onStartSession(info)
        .then((res)=> {
            console.log(res)

            if(res.data.serverMsg === 'Session Id Retrieved Succesfully!'){
                dispatch({type: 'STORE_SESSION_HISTORY_ID', lastSessionHistoryId: res.data.lastSessionHistoryId})
            }
            else if(res.data.serverMsg === 'Not sufficient balance to start session' ||
                res.data.serverMsg === 'Validity Date Over!'
            ){
                localStorage.setItem('turnOnOff', 'false')
                dispatch({type: 'INT_CALL_SMS_ERR', error: res.data.serverMsg})

                setTimeout(()=>{
                    dispatch({type: 'REFRESH_INT_CALL_SMS_ERROR'})
                }, 5000)
            }
            
        }, ()=>{
            console.log('start session failed')
        })
    }
}
export const updateSession = (info) => {
    return(dispatch, getState) => {
        intcallsmsService.onUpdateSession(info)
        .then((res)=> {
            //console.log(res)
            if(res.data.serverMsg === 'Not sufficient balance to continue session' ||
                res.data.serverMsg === 'Validity Date Over!'
            ){
                localStorage.setItem('turnOnOff', 'false')
                dispatch({type: 'INT_CALL_SMS_ERR', error: res.data.serverMsg})

                setTimeout(()=>{
                    dispatch({type: 'REFRESH_INT_CALL_SMS_ERROR'})
                }, 5000)
            }
            
        }, ()=>{
            console.log('update session failed')
        })
    }
}

export const startCall = (info) => {
    return(dispatch, getState) => {
        intcallsmsService.onStartCall(info)
        .then((res)=> {
            console.log(res)

            if(res.data.serverMsg === 'Talktime Id Retrieved Succesfully!'){
                dispatch({type: 'STORE_TALKTIME_ID', lastTalktimeId: res.data.lastTalktimeId})
            }
            else if(res.data.serverMsg === 'Not sufficient balance to start call' ||
                res.data.serverMsg === 'Validity Date Over!'            
            ){
                dispatch({type: 'INT_CALL_SMS_ERR', error: res.data.serverMsg})
                localStorage.setItem('inacall', 'false')
                setTimeout(()=>{
                    dispatch({type: 'REFRESH_INT_CALL_SMS_ERROR'})
                }, 3000)
            }
            else if(res.data.serverMsg === 'This Mobile Number is not found!'){
                dispatch({type: 'INT_CALL_SMS_ERR', error: res.data.serverMsg})
                localStorage.setItem('inacall', 'false')

                setTimeout(()=>{
                    dispatch({type: 'REFRESH_INT_CALL_SMS_ERROR'})
                }, 3000)
            }
            
        }, ()=>{
            console.log('start call failed')
        })
    }
}

export const onGoingCall = (info) => {
    return(dispatch, getState) => {
        intcallsmsService.onOnGoingCall(info)
        .then((res)=> {
            //console.log(res)
            
            if(res.data.serverMsg === 'Not sufficient balance to continue call' ||
                res.data.serverMsg === 'Validity Date Over!'
            ){
                dispatch({type: 'INT_CALL_SMS_ERR', error: res.data.serverMsg})
                localStorage.setItem('inacall', 'false')
                setTimeout(()=>{
                    dispatch({type: 'REFRESH_INT_CALL_SMS_ERROR'})
                }, 3000)
            }

        }, ()=>{
            console.log('start call failed')
        })
    }
}

export const discardCall = (info) => {
    return(dispatch, getState) => {
        intcallsmsService.onDiscardCall(info)
        .then(()=> {
            //console.log(res)
            
        }, ()=>{
            console.log('discard call failed')
        })
    }
}

export const cutCall = (info) => {
    return(dispatch, getState) => {
        intcallsmsService.onCutCall(info)
        .then(()=> {
            //console.log(res)
            
        }, ()=>{
            console.log('cut call failed')
        })
    }
}

export const clearError = () => {
    return(dispatch, getState) => {
        dispatch({type: 'REFRESH_INT_CALL_SMS_ERROR'})
    }
}

export const waitingCall = (info) => {
    return(dispatch, getState) => {
        intcallsmsService.onWaitingCall(info)
        .then(()=> {
            //console.log(res)
            
        }, ()=>{
            console.log('waiting call failed')
        })
    }
}