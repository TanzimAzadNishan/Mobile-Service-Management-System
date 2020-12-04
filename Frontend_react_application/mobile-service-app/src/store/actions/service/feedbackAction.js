import feedbackService from '../../../utilities/Services/Service/feedbackService'
//import {socket} from '../../../utilities/SocketIOClient'

export const sendFeedback = (info) => {
    return(dispatch, getState) => {
        feedbackService.onSendFeedback(info)
        .then((res)=> {
            console.log(res)

            if(res.data.serverMsg === 'Retrieved Feedback List Successfully!'){
                dispatch({type: 'STORE_ALL_FEEDBACK_REPLIES', replyInfo: res.data.feedbackInfo})
            }
            
        }, ()=>{
            console.log('retrieve feedback list failed')
        })
    }
}

export const sendReplyOfFeedback = (info) => {
    return(dispatch, getState) => {
        feedbackService.onAdminReply(info)
        .then((res)=> {
            console.log(res)

            /*socket.on('receive-admin-reply', (res)=>{
                dispatch({type: 'STORE_ALL_FEEDBACK_REPLIES', replyInfo: res.feedbackInfo})
            })*/
            
        }, ()=>{
            console.log('retrieve reply list failed')
        })
    }
}

export const receiveReply = (info) => {
    return(dispatch, getState) => {
        dispatch({type: 'STORE_ALL_FEEDBACK_REPLIES', replyInfo: info})
    }
}

export const getFeedbackList = (info) => {
    return(dispatch, getState) => {
        feedbackService.onGetFeedbackList(info)
        .then((res)=> {
            console.log(res)

            if(res.data.serverMsg === 'Retrieved Feedback List Successfully!'){
                dispatch({type: 'STORE_ALL_FEEDBACK_REPLIES', replyInfo: res.data.feedbackInfo})
            }
            
        }, ()=>{
            console.log('retrieve feedback list failed')
        })
    }
}