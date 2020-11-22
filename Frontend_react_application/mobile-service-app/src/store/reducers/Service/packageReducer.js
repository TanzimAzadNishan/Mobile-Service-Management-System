const initstate = {
    packageInfo: null
}

const packageReducer = (state = initstate, action)=>{
    if (action.type === 'RETRIEVE_PACKAGE_DETAILS'){
        console.log('package details retrieved')

        localStorage.setItem('packageInfo', JSON.stringify(action.packageInfo))

        const packageData = localStorage.getItem('packageInfo')

        return{
            ...state,
            packageInfo: packageData ? JSON.parse(packageData) : null
        }
    }

    return state
}

export default packageReducer