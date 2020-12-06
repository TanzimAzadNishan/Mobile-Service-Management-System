import personFNFService from '../../../utilities/Services/Service/personFNFService'

export const getPersonFNF = (info) => {
    return(dispatch, getState) => {
        personFNFService.onGetPersonFNF(info)
        .then((res)=> {
            console.log(res)

            if(res.data.serverMsg === 'PERSON FNF List Retrieved Succesfully!'){
                dispatch({type: 'STORE_PERSON_FNF_LIST', personFNFList: res.data.personFNFList})
            }
            
        }, ()=>{
            console.log('retrieve PERSON FNF list failed')
        })
    }
}

export const addPersonFNF = (info) => {
    return(dispatch, getState) => {
        personFNFService.onAddPersonFNF(info)
        .then((res)=> {
            console.log(res)

            if(res.data.serverMsg === 'PERSON FNF List Retrieved Succesfully!'){
                dispatch({type: 'STORE_PERSON_FNF_LIST', personFNFList: res.data.personFNFList})
            }
            else if(res.data.serverMsg === 'This mobile number is already in your fnf list!'){
                dispatch({type: 'PERSON_FNF_ERR', error: res.data.serverMsg})

                setTimeout(()=>{
                    dispatch({type: 'REFRESH_PERSON_FNF_ERROR'})
                }, 3000)
            }
            else if(res.data.serverMsg === 'This Mobile Number is not found!'){
                dispatch({type: 'PERSON_FNF_ERR', error: res.data.serverMsg})

                setTimeout(()=>{
                    dispatch({type: 'REFRESH_PERSON_FNF_ERROR'})
                }, 3000)
            }
            else if(res.data.serverMsg === 'Your total fnf number has reached max fnf number!'){
                dispatch({type: 'PERSON_FNF_ERR', error: res.data.serverMsg})

                setTimeout(()=>{
                    dispatch({type: 'REFRESH_PERSON_FNF_ERROR'})
                }, 3000)
            }
            
        }, ()=>{
            console.log('add PERSON FNF failed')
        })
    }
}

export const deletePersonFNF = (info) => {
    return(dispatch, getState) => {
        personFNFService.onDeletePersonFNF(info)
        .then((res)=> {
            console.log(res)

            if(res.data.serverMsg === 'PERSON FNF List Retrieved Succesfully!'){
                dispatch({type: 'STORE_PERSON_FNF_LIST', personFNFList: res.data.personFNFList})
            }
            
        }, ()=>{
            console.log('delete PERSON FNF failed')
        })
    }
}