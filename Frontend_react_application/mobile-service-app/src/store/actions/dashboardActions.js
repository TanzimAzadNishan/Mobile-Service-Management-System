
import dashboardService from '../../utilities/Services/dashboardService'
//import {socket} from '../../utilities/SocketIOClient'
import {getValidityDate} from '../../utilities/TimeAndDate'

export const retrieveAccountInfo = (personInfo)=>{
    return(dispatch, getState)=>{
        dashboardService.getAccountInfo(personInfo)
        .then((res)=>{
            console.log(res.data.accountDetails)

            res.data.accountDetails.accountInfo.VALIDITY_DATE = getValidityDate(
                res.data.accountDetails.accountInfo.VALIDITY_DATE
            )
            dispatch({type: 'RETRIEVE_ACCOUNT_DETAILS', accountDetails: res.data.accountDetails})
            
            dispatch({type: 'UPDATE_VALIDITY_DATE', 
            validityDate: getValidityDate(res.data.accountDetails.validityDate)})

        }, ()=>{
            console.log('retrieve info failed')
        })
    }
}

export const editPersonDetails = (editInfo)=>{
    return(dispatch, getState)=>{
        dashboardService.onEditPersonDetails(editInfo)
        .then((res)=>{
            console.log(res)

            dispatch({type: 'EDIT_PERSON_DETAILS', personInfo: res.data.personInfo})

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

export const editCurrentPackage = (pkgInfo)=>{
    return(dispatch, getState)=>{
        dashboardService.onEditCurrentPackage(pkgInfo)
        .then((res)=>{
            console.log(res)

            dispatch({type: 'EDIT_CURRENT_PKG', package: res.data.package})

        }, ()=>{
            console.log('edit package failed')
        })
    }
}

export const editCurrentFNFPlan = (fnfInfo)=>{
    return(dispatch, getState)=>{
        dashboardService.onEditCurrentFNFPlan(fnfInfo)
        .then((res)=>{
            console.log(res)

            dispatch({type: 'EDIT_CURRENT_FNF_PLAN', package: res.data.fnfPlan})

        }, ()=>{
            console.log('edit fnf plan failed')
        })
    }
}

export const storeSocketId = (socketId)=>{
    return(dispatch, getState)=>{
        
        /*socket.on('store-socket-id', (socketId)=>{
            console.log('socket id: ', socketId)
            dispatch({type: 'STORE_SOCKET_ID', socketId: socketId.socketId})
        })*/
        dispatch({type: 'STORE_SOCKET_ID', socketId: socketId.socketId})
    }
}

export const updateAccountInfo = (accountInfo)=>{
    return(dispatch, getState)=>{

        dispatch({type: 'UPDATE_ACCOUNT_BALANCE', accountInfo: accountInfo})
    }
}

export const updateValidityDate = (info)=>{
    return(dispatch, getState)=>{

        dispatch({type: 'UPDATE_VALIDITY_DATE', validityDate: info})
    }
}