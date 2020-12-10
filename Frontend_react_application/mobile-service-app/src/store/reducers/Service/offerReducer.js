const initstate = {
    offerInfo: null,
    balance: null,
    points: null
}

const offerReducer = (state = initstate, action)=>{

    if (action.type === 'RETRIEVE_POPULAR_OFFER_DETAILS'){
        console.log('popular offer details retrieved')

        localStorage.setItem('popular', JSON.stringify(action.popular))

        const popularData = localStorage.getItem('popular')

        return{
            ...state,
            popular: popularData ? JSON.parse(popularData) : null
        }
    }

    if (action.type === 'RETRIEVE_OFFER_DETAILS'){
        console.log('offer details retrieved')

        localStorage.setItem('offerInfo', JSON.stringify(action.offerInfo))

        const offerData = localStorage.getItem('offerInfo')

        return{
            ...state,
            offerInfo: offerData ? JSON.parse(offerData) : null
        }
    }

    if(action.type === 'RETRIEVE_PERSON_BALANCE_POINTS'){
        console.log('account balance and points retrieved')

        localStorage.setItem('acc_balance', JSON.stringify(action.personInfo.balance))
        localStorage.setItem('acc_points', JSON.stringify(action.personInfo.points))
        
        
        const accBalanceData = localStorage.getItem('acc_balance')
        const accPointsData = localStorage.getItem('acc_points')
        return{
            ...state,
            balance: accBalanceData ? JSON.parse(accBalanceData) : null,
            points: accPointsData ? JSON.parse(accPointsData) : null,
        }
    }

    return state
}

export default offerReducer