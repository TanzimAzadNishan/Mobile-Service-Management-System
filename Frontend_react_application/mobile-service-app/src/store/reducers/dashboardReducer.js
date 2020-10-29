
const initState = {
    personInfo: null,
    accountInfo: null,
    profilePic: null
}

const dashboardReducer = (state = initState, action)=>{
    if(action.type === 'RETRIEVE_ACCOUNT_INFO'){
        console.log('account info retrieved')
        localStorage.setItem('accountInfo', JSON.stringify(action.accountInfo))
        const accountData = localStorage.getItem('accountInfo')
        return{
            ...state,
            accountInfo: accountData ? JSON.parse(accountData) : null
        }
    }
    else if(action.type === 'EDIT_PROFILE_DETAILS'){
        console.log('profile details edited')
        localStorage.setItem('personInfo', JSON.stringify(action.personInfo))
        const personData = localStorage.getItem('personInfo')
        return{
            ...state,
            personInfo: personData ? JSON.parse(personData) : null
        }
    }
    else if(action.type === 'EDIT_PROFILE_PIC'){
        console.log('profile pic uploaded')
        localStorage.setItem('profilePic', JSON.stringify(action.profilePic))
        const profilePicData = localStorage.getItem('profilePic')
        return{
            ...state,
            profilePic: profilePicData ? JSON.parse(profilePicData) : null
        }
    }

    return state
}

export default dashboardReducer