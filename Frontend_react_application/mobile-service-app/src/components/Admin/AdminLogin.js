import React, { Component } from 'react'
import { connect } from 'react-redux'
import {Redirect} from 'react-router-dom'
import { loginAdmin } from '../../store/actions/adminAction'
import '../../styles/auth/LoginStyle.css'
import {
    validateNID, validatePassword
} from '../../utilities/Validators/AdminValidator'
import NProgress from 'nprogress'

const initialState = {
    NID: {
        value: '',
        validateOnChange: false,
        error: ''
    },
    Password: {
        value: '',
        validateOnChange: false,
        error: ''
    },
    submitCalled: false,
    allFieldsValidated: false
}

class AdminLogin extends Component {
    constructor(props){
        super(props);
        NProgress.start();
        NProgress.configure({ ease: 'ease', speed: 500 });
    }

    componentDidMount(){
        NProgress.done();
    }

    state = initialState

    handleChange = (e, validationFunc)=>{
        const field = e.target.id
        const fieldVal = e.target.value;
        this.setState(state => ({
          [field]: {
            ...state[field],
            value: fieldVal,
            error: state[field]['validateOnChange'] ? validationFunc(fieldVal) : ''
          }
        }));
    }

    handleBlur = (e, validationFunc)=>{
        const field = e.target.id
        //console.log(field)
        //console.log(this.state[field]['validateOnChange'])
        if (this.state[field]['validateOnChange'] === false &&
            this.state.submitCalled === false
        ){
            this.setState(state => ({
              [field]: {
                ...state[field],
                validateOnChange: true,
                error: validationFunc(state[field].value)
              }
            }));
        }
    }

    handleSubmit = (e)=>{
        e.preventDefault();
        // validate all fields
        const { NID, Password } = this.state;
        const NIDError = validateNID(NID.value);
        const passwordError = validatePassword(Password.value)
        if ([NIDError, passwordError].every(e => e === false)) {
          // no errors submit the form
          console.log('form submitted successfully');

          var loginInfo = {
            NID : NID.value,
            password: Password.value
          }
          this.props.loginAdmin(loginInfo)
          this.setState({...initialState})
          
          // clear state and show all fields are validated
          //this.setState({ ...initialState, allFieldsValidated: true });
        } else {
          console.log(NIDError)
          console.log(passwordError)
          // update the state with errors
          this.setState(state => ({
            NID: {
              ...state.NID,
              validateOnChange: true,
              error: NIDError
            },
            Password: {
              ...state.Password,
              validateOnChange: true,
              error: passwordError
            }
          }));
        }
    }

    render(){
        if (this.props.auth != null){
            console.log('redirected')
            return <Redirect to='/admin/dashboard' />
        } 

        return (
            <div className="login">
                <div className="title">
                    Admin Login Form
                </div>
                <form onSubmit={this.handleSubmit}>

                    <div className="input-field">
                        <i className="material-icons prefix"
                           style={this.state.NID.error ? ({color: "red"}):(null)}
                        >
                             person_pin 
                        </i>
                        <input type="text" id="NID"
                            className="validate"
                            style={this.state.NID.error ? ({color: "red"}):(null)}
                            value={this.state.NID.value} 
                            onChange={(e)=>{this.handleChange(e, validateNID)}}
                            onBlur={(e)=>{this.handleBlur(e, validateNID)}}
                        />
                        <label htmlFor="NID"
                               style={this.state.NID.error ? ({color: "red"}):(null)}
                        >
                             NID
                        </label>
                        <div style={{color: "red"}}>
                            {this.state.NID.error}
                        </div>
                    </div>

                    <div className="input-field">
                        <i className="material-icons prefix"
                           style={this.state.Password.error ? ({color: "red"}):(null)}
                        >
                             lock 
                        </i>
                        <input type="password" id="Password"
                            className="validate"
                            style={this.state.Password.error ? ({color: "red"}):(null)}
                            value={this.state.Password.value} 
                            onChange={(e)=>{this.handleChange(e, validatePassword)}}
                            onBlur={(e)=>{this.handleBlur(e, validatePassword)}}
                        />
                        <label htmlFor="password"
                               style={this.state.Password.error ? ({color: "red"}):(null)}
                        >
                             Password 
                        </label>
                        <div style={{color: "red"}}>
                            {this.state.Password.error}
                        </div>
                    </div>

                    <div className="input-field loginText">
                        <button type="submit" className='btn waves-effect waves-light'>
                            Log In
                        </button>
                    </div>


                    <div style={{color: "red"}}>
                            {this.props.authError}
                    </div>
                </form>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
      auth: state.admin.auth,
      authError: state.admin.authError
    }
}

const mapDispatchtoProps = (dispatch)=>{
    return{
        loginAdmin: (loginInfo)=>{
            dispatch(loginAdmin(loginInfo))
        }
    }
}

export default connect(mapStateToProps, mapDispatchtoProps)(AdminLogin)
