const initstate = {
    fnfInfo: null
}

const fnfReducer = (state = initstate, action)=>{
    if (action.type === 'RETRIEVE_FNF_DETAILS'){
        console.log('fnf details retrieved')

        localStorage.setItem('fnfInfo', JSON.stringify(action.fnfInfo))

        const fnfData = localStorage.getItem('fnfInfo')

        return{
            ...state,
            fnfInfo: fnfData ? JSON.parse(fnfData) : null
        }
    }

    return state
}

export default fnfReducer