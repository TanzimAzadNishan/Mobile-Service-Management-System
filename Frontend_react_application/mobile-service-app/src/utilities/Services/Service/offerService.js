import {baseApi} from '../../ApiControllers/apiCaller'

export default{
    getpopular(popular){
        return baseApi.post('/offer/popular',popular)
    },
    getOffers(OfferInfo){
        return baseApi.post('/offer', OfferInfo)
    },
    getBalance(personInfo){
        return baseApi.post('/offer/get-balance',personInfo)
    },
    updateAccountOffer(offerDetails){
        return baseApi.post('/offer/buy', offerDetails)
    }
}