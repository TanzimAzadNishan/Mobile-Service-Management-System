
import dashboardService from '../../utilities/Services/dashboardService'

export const retrieveAccountInfo = ()=>{
    return(dispatch, getState)=>{
        dashboardService.onAccountInfo()
        .then((res)=>{
            console.log(res)

            dispatch({type: 'RETRIEVE_ACCOUNT_INFO', accountInfo: res.data.accountInfo})

        }, ()=>{
            console.log('retrieve info failed')
        })
    }
}

export const editProfileDetails = (editInfo)=>{
    return(dispatch, getState)=>{
        dashboardService.onEditInfo(editInfo)
        .then((res)=>{
            console.log(res)

            dispatch({type: 'EDIT_PROFILE_DETAILS', personInfo: res.data.personInfo})

        }, ()=>{
            console.log('edit profile failed')
        })
    }
}

export const editProfilePic = (profilePicInfo)=>{
    return(dispatch, getState)=>{
        dashboardService.onEditProfilePic(profilePicInfo)
        .then((res)=>{
            console.log(res)

            dispatch({type: 'EDIT_PROFILE_PIC', profilePic: res.data.profilePic})

        }, ()=>{
            console.log('upload profile pic failed')
        })
    }
}