import {baseApi} from '../../ApiControllers/apiCaller'

export default{
    onSendFeedback(info){
        return baseApi.post('/send-feedback', info)
    },
    onAdminReply(info){
        return baseApi.post('/feedback-reply', info)
    },
    onGetFeedbackList(info){
        return baseApi.post('/get-feedback-list', info)
    }
}