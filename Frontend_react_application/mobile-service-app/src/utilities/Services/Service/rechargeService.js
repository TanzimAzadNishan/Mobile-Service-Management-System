import {baseApi} from '../../ApiControllers/apiCaller'

export default{
    onSendRecharge(info){
        return baseApi.post('/send-recharge', info)
    }
}