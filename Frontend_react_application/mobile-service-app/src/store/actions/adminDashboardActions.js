
import adminDashboardService from '../../utilities/Services/adminDashboardService'
import {socket} from '../../utilities/SocketIOClient'

export const retrieveAdminInfo = (adminInfo)=>{
    return(dispatch, getState)=>{
        adminDashboardService.getAdminInfo(adminInfo)
        .then((res)=>{
            dispatch({type: 'RETRIEVE_ADMIN_ACCOUNT_DETAILS', adminInfo: res.data.adminInfo})
        }, ()=>{
            console.log('retrieve admin info failed')
        })
    }
}

export const setNewPackage = (newPkg)=>{
    return(dispatch, getState)=>{
        adminDashboardService.setNewPackage(newPkg)
        .then((res)=>{
            dispatch({type: 'SET_NEW_PACKAGE', msg: res.data.serverMsg})
        }, ()=>{
            console.log('SET NEW PACKAGE FAILED')
        })
    }
}

export const editPackage = (editPkg)=>{
    return(dispatch, getState)=>{
        adminDashboardService.editPackage(editPkg)
        .then((res)=>{
            dispatch({type: 'EDIT_PACKAGE', msg: res.data.serverMsg})
        }, ()=>{
            console.log('EDIT NEW PACKAGE FAILED')
        })
    }  
}

export const deletePackage = (editPkg)=>{
    return(dispatch, getState)=>{
        adminDashboardService.deletePackage(editPkg)
        .then((res)=>{
            dispatch({type: 'DELETE_PACKAGE', msg: res.data.serverMsg})
        }, ()=>{
            console.log('DELETE PACKAGE FAILED')
        })
    }  
}

export const setNewfnf = (newfnf)=>{
    return(dispatch, getState)=>{
        adminDashboardService.setNewfnf(newfnf)
        .then((res)=>{
            dispatch({type: 'SET_NEW_FNF', msg: res.data.serverMsg})
        }, ()=>{
            console.log('SET NEW FNF FAILED')
        })
    }
}

export const editFnf = (editfnf)=>{
    return(dispatch, getState)=>{
        adminDashboardService.editFnf(editfnf)
        .then((res)=>{
            dispatch({type: 'EDIT_FNF', msg: res.data.serverMsg})
        }, ()=>{
            console.log('EDIT FNF FAILED')
        })
    }  
}

export const deletefnf = (editfnf)=>{
    return(dispatch, getState)=>{
        adminDashboardService.deletefnf(editfnf)
        .then((res)=>{
            dispatch({type: 'DELETE_FNF', msg: res.data.serverMsg})
        }, ()=>{
            console.log('DELETE FNF FAILED')
        })
    }  
}

export const setNewOffer = (newOffer)=>{
    return(dispatch, getState)=>{
        adminDashboardService.setNewOffer(newOffer)
        .then((res)=>{
            dispatch({type: 'SET_NEW_OFFER', msg: res.data.serverMsg})
        }, ()=>{
            console.log('SET NEW OFFER FAILED')
        })
    }
}

export const editOffer = (editedOffer)=>{
    return(dispatch, getState)=>{
        adminDashboardService.editOffer(editedOffer)
        .then((res)=>{
            dispatch({type: 'EDIT_OFFER', msg: res.data.serverMsg})
        }, ()=>{
            console.log('EDIT OFFER FAILED')
        })
    }  
}

export const deleteOffer = (editedOffer)=>{
    return(dispatch, getState)=>{
        adminDashboardService.deleteOffer(editedOffer)
        .then((res)=>{
            dispatch({type: 'DELETE_OFFER', msg: res.data.serverMsg})
        }, ()=>{
            console.log('DELETE OFFER FAILED')
        })
    }  
}

export const storeAdminSocketId = (socketId)=>{
    return(dispatch, getState)=>{
        
        dispatch({type: 'STORE_ADMIN_SOCKET_ID', socketId: socketId.socketId})
    }
}

export const receiveNewFeedback = () => {
    return(dispatch, getState) => {            
        socket.on('send-new-feedback', (res)=>{
            dispatch({type: 'STORE_ADMIN_FEEDBACKS', feedbackInfo: res.feedbackInfo})
        }) 
    }
}
export const receiveAllFeedback = (info) => {
    return(dispatch, getState) => {
        adminDashboardService.onRetrieveFeedbackList(info)
        .then((res)=>{
            dispatch({type: 'STORE_ADMIN_FEEDBACKS', feedbackInfo: res.data.feedbackInfo})
        })            
    }
}