
const initstate = {
    adminFeedInfo: null,
    packageInfo: null,
    fnfInfo: null,
    offerInfo: null
}

const adminDashboardReducer = (state = initstate, action)=>{
    
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
    return state
}

export default adminDashboardReducer;