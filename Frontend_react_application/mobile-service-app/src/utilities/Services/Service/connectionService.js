import {baseApi} from '../../ApiControllers/apiCaller'

export default{
    onRetrieveConnectionList(info){
        return baseApi.post('/connection-list', info)
    },
    onCreateNewConnection(info){
        return baseApi.post('/create-new-connection', info)
    },
    onAcceptLinkRequest(info){
        return baseApi.post('/accept-link-request', info)
    },
    onDiscardLinkRequest(info){
        return baseApi.post('/discard-link-request', info)
    },
    onSendPointRequest(info){
        return baseApi.post('/send-point-request', info)
    },
    onTransferPoint(info){
        return baseApi.post('/transfer-point', info)
    },
    onDeleteAcceptedLink(info){
        return baseApi.post('/delete-accepted-link', info)
    }
}