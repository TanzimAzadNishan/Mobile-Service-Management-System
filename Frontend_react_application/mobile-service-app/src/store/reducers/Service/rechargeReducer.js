const initState = {
    rechargeError: null
}

const rechargeReducer = (state = initState, action)=>{
    if(action.type === 'RECHARGE_FAILED'){
        return{
            ...state,
            rechargeError: action.error
        }
    }
    else if(action.type === 'REFRESH_RECHARGE_ERROR'){
        return{
            ...state,
            rechargeError: null
        }
    }
    return state
}

export default rechargeReducer;