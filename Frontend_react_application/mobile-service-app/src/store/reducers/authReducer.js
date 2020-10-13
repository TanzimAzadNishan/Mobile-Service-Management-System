//import validator from 'validator'

const initState = {
    userAccount: null
}

const authReducer = (state = initState, action)=>{
    if(action.type === 'CREATE_ACCOUNT'){
        console.log('account created')
        localStorage.setItem('userAccount', JSON.stringify(action.userAccount))
        return{
            ...state,
            userAccount: action.userAccount
        }
    }
    return state
}

export default authReducer;