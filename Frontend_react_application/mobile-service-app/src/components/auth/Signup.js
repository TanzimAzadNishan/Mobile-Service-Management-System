import React, { Component } from 'react'
import { connect } from 'react-redux'
import {createAccount} from '../../store/actions/authActions'

class Signup extends Component{
    bindingVars = {
        Std_Id : 4,
        Std_Name: 'TAN',
        Address: 'Noakhali'
    }

    handleClick = ()=>{
        this.props.createAccount(this.bindingVars)
        //this.props.history.push('/')
    }

    render() {
        return (
            <div>
                <button onClick={this.handleClick}>
                    Signup
                </button>
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