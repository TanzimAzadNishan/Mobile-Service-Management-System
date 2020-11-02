import React, { Component } from 'react'
import { connect } from 'react-redux'
import {Redirect, NavLink} from 'react-router-dom'
import { loginUser } from '../../store/actions/authActions'
import '../../styles/auth/LoginStyle.css'
import {
    validateMobileNumber, validatePassword
} from '../../utilities/Validators/AuthValidator'
import NProgress from 'nprogress'

const initialState = {
    Mobile_Number: {
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

class Login extends Component {
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
        const { Mobile_Number, Password } = this.state;
        const mobNumError = validateMobileNumber(Mobile_Number.value);
        const passwordError = validatePassword(Password.value)
        if ([mobNumError, passwordError].every(e => e === false)) {
          // no errors submit the form
          console.log('form submitted successfully');

          var signupInfo = {
            mobile_number : Mobile_Number.value,
            password: Password.value
          }
          this.props.loginUser(signupInfo)
          this.setState({...initialState})
          
          // clear state and show all fields are validated
          //this.setState({ ...initialState, allFieldsValidated: true });
        } else {
          console.log(mobNumError)
          console.log(passwordError)
          // update the state with errors
          this.setState(state => ({
            Mobile_Number: {
              ...state.Mobile_Number,
              validateOnChange: true,
              error: mobNumError
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
            return <Redirect to='/dashboard' />
        } 

        return (
            <div className="login">
                <div className="title">
                    Login Form
                </div>
                <form onSubmit={this.handleSubmit}>

                    <div className="input-field">
                        <i className="material-icons prefix"
                           style={this.state.Mobile_Number.error ? ({color: "red"}):(null)}
                        >
                             settings_cell 
                        </i>
                        <input type="text" id="Mobile_Number"
                            className="validate"
                            style={this.state.Mobile_Number.error ? ({color: "red"}):(null)}
                            value={this.state.Mobile_Number.value} 
                            onChange={(e)=>{this.handleChange(e, validateMobileNumber)}}
                            onBlur={(e)=>{this.handleBlur(e, validateMobileNumber)}}
                        />
                        <label htmlFor="mobile-number"
                               style={this.state.Mobile_Number.error ? ({color: "red"}):(null)}
                        >
                             Mobile Number 
                        </label>
                        <div style={{color: "red"}}>
                            {this.state.Mobile_Number.error}
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
                        Don't Have an Account?
                        <NavLink to="/signup" className="loginLink"> Signup </NavLink>
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
      auth: state.auth.auth,
      authError: state.auth.authError
    }
}

const mapDispatchtoProps = (dispatch)=>{
    return{
        loginUser: (loginInfo)=>{
            dispatch(loginUser(loginInfo))
        }
    }
}

export default connect(mapStateToProps, mapDispatchtoProps)(Login)
