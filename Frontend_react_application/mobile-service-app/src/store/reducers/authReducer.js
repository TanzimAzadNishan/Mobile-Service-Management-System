//import validator from 'validator'

const initState = {
    auth: null,
    authError: null,
    originalPassword: null
}

const authReducer = (state = initState, action)=>{
    const userAuth = localStorage.getItem('userAccount')
    const oriPassInStore = localStorage.getItem('originalPassword')
    console.log('userauth: ', userAuth)

    if(action.type === 'SIGNUP_SUCCESS'){
        console.log('account created')
        console.log(action.userAccount)
        localStorage.setItem('userAccount', JSON.stringify(action.userAccount))
        const userData = localStorage.getItem('userAccount')
        const passData = localStorage.getItem('originalPassword')
        console.log(JSON.parse(userData))
        return{
            ...state,
            auth: userData ? JSON.parse(userData) : null,
            originalPassword: passData ? JSON.parse(passData) : null
        }
    }
    else if(action.type === 'SIGNUP_FAILED'){
        return{
            ...state,
            authError: action.error
        }
    }
    else if(action.type === 'LOGIN_SUCCESS'){
        console.log('User Logged In')
        console.log(action.userAccount)
        localStorage.setItem('userAccount', JSON.stringify(action.userAccount))
        const userData = localStorage.getItem('userAccount')
        const passData = localStorage.getItem('originalPassword')
        console.log(JSON.parse(userData))
        return{
            ...state,
            auth: userData ? JSON.parse(userData) : null,
            originalPassword: passData ? JSON.parse(passData) : null
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
        localStorage.removeItem('accountInfo')
        localStorage.removeItem('current_pkg')
        localStorage.removeItem('current_fnf_plan')
        localStorage.removeItem('personInfo')
        localStorage.removeItem('profilePic')        
        localStorage.removeItem('originalPassword')        
        localStorage.removeItem('connectionList')        
        localStorage.removeItem('socketId')        
        localStorage.removeItem('personFNFList')        

        //location.reload()
        return{
            ...state,
            auth: null,
            authError: null,
            originalPassword: null
        }
    }

    else if(action.type === 'REFRESH_AUTH_ERROR'){
        return{
            ...state,
            authError: null
        }
    }
    
    return{
        ...state,
        auth: userAuth ? JSON.parse(userAuth) : null,
        originalPassword: oriPassInStore ? JSON.parse(oriPassInStore) : null
    }
    //return state
}

export default authReducer;