const initstate = {
    balance: null
}

const flexiplanReducer = (state = initstate, action)=>{
    
    if(action.type === 'RETRIEVE_PERSON_BALANCE'){
        console.log('account balance retrieved')

        localStorage.setItem('acc_balance', JSON.stringify(action.personInfo.balance))
        
        
        const accBalanceData = localStorage.getItem('acc_balance')

        return{
            ...state,
            balance: accBalanceData ? JSON.parse(accBalanceData) : null,
        }
    }
    return state
}

export default flexiplanReducer;