import {baseApi} from '../../ApiControllers/apiCaller'

export default{
    onSendSMS(info){
        return baseApi.post('/send-sms', info)
    },
    onStartSession(info){
        return baseApi.post('/start-internet-session', info)
    },
    onUpdateSession(info){
        return baseApi.post('/update-internet-session', info)
    },
    onStartCall(info){
        return baseApi.post('/start-call', info)
    },
    onOnGoingCall(info){
        return baseApi.post('/ongoing-call', info)
    },
    onDiscardCall(info){
        return baseApi.post('/discard-call', info)
    },
    onCutCall(info){
        return baseApi.post('/cut-call', info)
    },
    onWaitingCall(info){
        return baseApi.post('/waiting-call', info)
    }
}