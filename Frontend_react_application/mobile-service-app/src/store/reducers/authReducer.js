//import validator from 'validator'

const initState = {
    auth: null,
    authError: null
}

const authReducer = (state = initState, action)=>{
    if(action.type === 'SIGNUP_SUCCESS'){
        console.log('account created')
        console.log(action.userAccount)
        localStorage.setItem('userAccount', JSON.stringify(action.userAccount))
        const userData = localStorage.getItem('userAccount')
        console.log(JSON.parse(userData))
        return{
            ...state,
            auth: userData ? JSON.parse(userData) : null
        }
    }
    else if(action.type === 'SIGNUP_FAILED'){
        return{
            ...state,
            authError: action.error
        }
    }
    if(action.type === 'LOGIN_SUCCESS'){
        console.log('User Logged In')
        console.log(action.userAccount)
        localStorage.setItem('userAccount', JSON.stringify(action.userAccount))
        const userData = localStorage.getItem('userAccount')
        console.log(JSON.parse(userData))
        return{
            ...state,
            auth: userData ? JSON.parse(userData) : null
        }
    }

    else if(action.type === 'LOGIN_FAILED'){
        return{
            ...state,
            authError: action.error
        }
    }

    else if(action.type === 'LOGOUT'){
        localStorage.removeItem('userAccount')
        //location.reload()
        return{
            ...state,
            auth: null
        }
    }
    return state
}

export default authReducer;