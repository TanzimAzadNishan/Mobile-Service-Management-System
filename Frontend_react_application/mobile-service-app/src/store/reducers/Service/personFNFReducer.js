const initState = {
    personFNFList: null,
    personFNFError: null
}

const personFNFReducer = (state = initState, action)=>{
    const personFNFListInStore = localStorage.getItem('personFNFList')

    if(action.type === 'STORE_PERSON_FNF_LIST'){
        console.log('person fnf list stored')
        localStorage.setItem('personFNFList', JSON.stringify(action.personFNFList))
        const personFNFListData = localStorage.getItem('personFNFList')

        return{
            ...state,
            personFNFList: personFNFListData ? JSON.parse(personFNFListData) : null
        }
    }

    else if(action.type === 'PERSON_FNF_ERR'){
        console.log('error stored')

        return{
            ...state,
            personFNFError: action.error
        }
    }
    else if(action.type === 'REFRESH_PERSON_FNF_ERROR'){
        return{
            ...state,
            personFNFError: null
        }
    }

    return{
        ...state,
        personFNFList: personFNFListInStore ? JSON.parse(personFNFListInStore) : null
    }
}

export default personFNFReducer;