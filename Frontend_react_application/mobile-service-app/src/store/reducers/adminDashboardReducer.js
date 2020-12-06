
const initstate = {
    adminFeedInfo: null,
    packageInfo: null,
    fnfInfo: null,
    offerInfo: null,
    adminSocketId: null,
    adminFeedbackList: null,
    msg: null
}

const adminDashboardReducer = (state = initstate, action)=>{
    const socketIdInStore = localStorage.getItem('adminSocketId')
    const adminFeedbackListInStore = localStorage.getItem('adminFeedbackList')
    const feedSubDataInStore = localStorage.getItem('feed_sub')
    const packageDataInStore = localStorage.getItem('packages')
    const fnfDataInStore = localStorage.getItem('fnfs')
    const offerDataInStore = localStorage.getItem('offers')
    
    if(action.type === 'RETRIEVE_ADMIN_ACCOUNT_DETAILS'){
        console.log('admin details retrieved')

        localStorage.setItem('feed_sub', JSON.stringify(action.adminInfo.feedback_sub))
        localStorage.setItem('packages', JSON.stringify(action.adminInfo.packageInfo))
        localStorage.setItem('fnfs', JSON.stringify(action.adminInfo.fnfInfo))
        localStorage.setItem('offers', JSON.stringify(action.adminInfo.offerInfo))
        
        const feedSubData = localStorage.getItem('feed_sub')
        const packageData = localStorage.getItem('packages')
        const fnfData = localStorage.getItem('fnfs')
        const offerData = localStorage.getItem('offers')

        return{
            ...state,
            adminFeedInfo: feedSubData ? JSON.parse(feedSubData) : null,
            packageInfo: packageData ? JSON.parse(packageData) : null,
            fnfInfo: fnfData ? JSON.parse(fnfData) : null,
            offerInfo: offerData ? JSON.parse(offerData) : null,
        }
    }
    else if(action.type === 'STORE_ADMIN_SOCKET_ID'){
        console.log('admin socket id stored')
        localStorage.setItem('adminSocketId', JSON.stringify(action.socketId))
        const socketIdData = localStorage.getItem('adminSocketId')

        return{
            ...state,
            adminSocketId: socketIdData ? JSON.parse(socketIdData) : null
        }
    }

    else if(action.type === 'STORE_ADMIN_FEEDBACKS'){
        console.log('feedback list to admin stored')
        localStorage.setItem('adminFeedbackList', JSON.stringify(action.feedbackInfo))
        const listData = localStorage.getItem('adminFeedbackList')

        return{
            ...state,
            adminFeedbackList: listData ? JSON.parse(listData) : null
        }
    }

    else if( action.type === 'SET_NEW_PACKAGE' || 
            action.type === 'EDIT_PACKAGE' ||
            action.type === 'DELETE_PACKAGE' ||
            action.type === 'SET_NEW_FNF' ||
            action.type === 'EDIT_FNF' ||
            action.type === 'DELETE_FNF' ||
            action.type === 'SET_NEW_OFFER' ||
            action.type === 'EDIT_OFFER' ||
            action.type === 'DELETE_OFFER'){
        return{
            ...state,
            msg: action.msg
        }
    }

    return{
        ...state,
        msg: null,
        adminFeedInfo: feedSubDataInStore ? JSON.parse(feedSubDataInStore) : null,
        packageInfo: packageDataInStore ? JSON.parse(packageDataInStore) : null,
        fnfInfo: fnfDataInStore ? JSON.parse(fnfDataInStore) : null,
        offerInfo: offerDataInStore ? JSON.parse(offerDataInStore) : null,
        adminSocketId: socketIdInStore ? JSON.parse(socketIdInStore) : null,
        adminFeedbackList: adminFeedbackListInStore ? 
            JSON.parse(adminFeedbackListInStore) : null,

    }
}

export default adminDashboardReducer;