
const initState = {
    personInfo: null,
    accountInfo: null,
    profilePic: null,
    current_pkg: null,
    current_fnf_plan: null
}

const dashboardReducer = (state = initState, action)=>{
    if(action.type === 'RETRIEVE_ACCOUNT_DETAILS'){
        console.log('account details retrieved')

        localStorage.setItem('accountInfo', JSON.stringify(action.accountDetails.accountInfo))
        localStorage.setItem('current_pkg', JSON.stringify(action.accountDetails.packageInfo))
        localStorage.setItem('current_fnf_plan', JSON.stringify(action.accountDetails.fnfInfo))
        
        const accountData = localStorage.getItem('accountInfo')
        const packageData = localStorage.getItem('current_pkg')
        const fnfData = localStorage.getItem('current_fnf_plan')

        return{
            ...state,
            accountInfo: accountData ? JSON.parse(accountData) : null,
            current_pkg: packageData ? JSON.parse(packageData) : null,
            current_fnf_plan: fnfData ? JSON.parse(fnfData) : null
        }
    }

    else if(action.type === 'EDIT_PERSON_DETAILS'){
        console.log('person details edited')
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

    else if(action.type === 'EDIT_CURRENT_PKG'){
        console.log('current pkg edited')
        localStorage.setItem('currentPKG', JSON.stringify(action.package))
        const currentPKGData = localStorage.getItem('currentPKG')
        return{
            ...state,
            current_pkg: currentPKGData ? JSON.parse(currentPKGData) : null
        }
    }
    
    else if(action.type === 'EDIT_CURRENT_FNF_PLAN'){
        console.log('current fnf plan edited')
        localStorage.setItem('currentFNF', JSON.stringify(action.fnfPlan))
        const currentFNFData = localStorage.getItem('currentFNF')
        return{
            ...state,
            current_fnf_plan: currentFNFData ? JSON.parse(currentFNFData) : null
        }
    }

    return state
}

export default dashboardReducer