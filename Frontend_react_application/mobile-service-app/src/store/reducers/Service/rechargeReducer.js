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
    return state
}

export default rechargeReducer;