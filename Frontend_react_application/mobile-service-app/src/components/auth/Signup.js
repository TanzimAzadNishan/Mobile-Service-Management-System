import React, { Component } from 'react'
import { connect } from 'react-redux'
import {createAccount} from '../../store/actions/authActions'

class Signup extends Component{
    render() {
        return (
            <div>
                
            </div>
        )
    }
}


/*const mapStateToProps = (state) =>{

}*/

const mapDispatchtoProps = (dispatch)=>{
    return{
        createAccount: (signupInfo)=>{
            dispatch(createAccount(signupInfo))
        }
    }
}

export default connect(null, mapDispatchtoProps)(Signup)