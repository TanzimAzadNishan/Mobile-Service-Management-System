import rechargeService from '../../../utilities/Services/Service/rechargeService'

export const sendRecharge = (info) => {
    return(dispatch, getState) => {
        rechargeService.onSendRecharge(info)
        .then((res)=> {
            console.log(res)

            if(res.data.serverMsg === 'Your account does not have sufficient balance'){
                dispatch({type: 'RECHARGE_FAILED', error: res.data.serverMsg})
                setTimeout(()=>{
                    dispatch({type: 'REFRESH_RECHARGE_ERROR'})
                }, 3000)
            }

            if(res.data.serverMsg === 'This Mobile Number is not found!'){
                dispatch({type: 'RECHARGE_FAILED', error: res.data.serverMsg})
                setTimeout(()=>{
                    dispatch({type: 'REFRESH_RECHARGE_ERROR'})
                }, 3000)
            }

            if(res.data.serverMsg === 'Validity Date Over!'){
                dispatch({type: 'RECHARGE_FAILED', error: res.data.serverMsg})
                setTimeout(()=>{
                    dispatch({type: 'REFRESH_RECHARGE_ERROR'})
                }, 3000)
            }


            
        }, ()=>{
            console.log('retrieve feedback list failed')
        })
    }
}