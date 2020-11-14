import React, { Component } from 'react'
import { connect } from 'react-redux'
import {Redirect, NavLink} from 'react-router-dom'
import {createAccount} from '../../store/actions/authActions'
import '../../styles/auth/SignupStyle.css'
import {
    validateName, validateMobileNumber, validatePassword, validateConfirmPassword
} from '../../utilities/Validators/AuthValidator'
import NProgress from 'nprogress'
import hashing from '../../utilities/hashing'


const initialState = {
    Mobile_Number: {
        value: '',
        validateOnChange: false,
        error: ''
    },
    Name: {
        value: '',
        validateOnChange: false,
        error: ''
    },
    Password: {
        value: '',
        validateOnChange: false,
        error: ''
    },
    Confirm_Password: {
        value: '',
        validateOnChange: false,
        error: ''
    },
    submitCalled: false,
    allFieldsValidated: false
}


class Signup extends Component{
    constructor(props){
        super(props);
        NProgress.start();
        NProgress.configure({ ease: 'ease', speed: 500 });
        //NProgress.configure({trickleSpeed: 800 });
    }
    componentDidMount(){
        NProgress.done()
    }

    /*handleClick = ()=>{
        this.props.createAccount(this.bindingVars)
        //this.props.history.push('/')
    }*/

    state = initialState

    handleChange = (evt, validationFunc)=>{
        const field = evt.target.id
        const fieldVal = evt.target.value;
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

    handleSubmit = (evt)=>{
        evt.preventDefault();
        // validate all fields
        const { Mobile_Number, Name, Password, Confirm_Password } = this.state;
        const mobNumError = validateMobileNumber(Mobile_Number.value);
        const nameError = validateName(Name.value);
        const passwordError = validatePassword(Password.value)
        const conPassError = validateConfirmPassword(Confirm_Password.value)
        if ([mobNumError, nameError, passwordError, conPassError].every(e => e === false)) {
          // no errors submit the form
          console.log('form submitted successfully');

          hashing.hashPassword(Password.value, 12)
          .then((hashedPassword)=>{
            var signupInfo = {
                mobile_number : Mobile_Number.value,
                name: Name.value,
                password: hashedPassword
            }

            this.props.createAccount(signupInfo)
            this.setState({...initialState})
          })
          
          // clear state and show all fields are validated
          //this.setState({ ...initialState, allFieldsValidated: true });
        } else {
          console.log(mobNumError)
          console.log(nameError)
          console.log(passwordError)
          console.log(conPassError)
          // update the state with errors
          this.setState(state => ({
            Mobile_Number: {
              ...state.Mobile_Number,
              validateOnChange: true,
              error: mobNumError
            },
            Name: {
                ...state.Name,
                validateOnChange: true,
                error: nameError
              },
            Password: {
              ...state.Password,
              validateOnChange: true,
              error: passwordError
            },
            Confirm_Password: {
                ...state.Confirm_Password,
                validateOnChange: true,
                error: conPassError
            }
          }));
        }
    }

    render() {
        //const { auth } = this.props;
        if (this.props.auth != null){
            console.log('redirected')
            return <Redirect to='/dashboard' />
        } 

        return (
            <div className="signup">
                <div className="title">
                    Signup Form
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
                           style={this.state.Name.error ? ({color: "red"}):(null)}
                        >
                            account_circle
                        </i>
                        <input type="text" id="Name"
                            className="validate"
                            style={this.state.Name.error ? ({color: "red"}):(null)}
                            value={this.state.Name.value} 
                            onChange={(e)=>{this.handleChange(e, validateName)}}
                            onBlur={(e)=>{this.handleBlur(e, validateName)}}
                        />
                        <label htmlFor="name"
                               style={this.state.Name.error ? ({color: "red"}):(null)}
                        > 
                            Name 
                        </label>
                        <div style={{color: "red"}}>
                            {this.state.Name.error}
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

                    <div className="input-field">
                        <i className="material-icons prefix"
                           style={this.state.Confirm_Password.error ? ({color: "red"}):(null)}
                        >
                             vpn_key 
                        </i>
                        <input type="password" id="Confirm_Password"
                            className="validate"
                            style={this.state.Confirm_Password.error ? ({color: "red"}):(null)}
                            value={this.state.Confirm_Password.value} 
                            onChange={(e)=>{this.handleChange(e, validateConfirmPassword)}}
                            onBlur={(e)=>{this.handleBlur(e, validateConfirmPassword)}}
                        />
                        <label htmlFor="Confirm_Password"
                               style={this.state.Confirm_Password.error ? ({color: "red"}):(null)}
                        >
                             Confirm Password 
                        </label>
                        <div style={{color: "red"}}>
                            {this.state.Confirm_Password.error}
                        </div>
                    </div>

                    <div className="input-field loginText">
                        <button type="submit" className='btn waves-effect waves-light'>
                            Sign Up
                        </button>

                        Already Have an Account?
                        <NavLink to="/login" className="loginLink"> Login </NavLink>
                    </div>

                    <div style={{color: "red"}}>
                            {this.props.authError}
                    </div>
                </form>
                {/*<button onClick={this.handleClick}>
                    Signup
        </button>*/}
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
        createAccount: (signupInfo)=>{
            dispatch(createAccount(signupInfo))
        }
    }
}

export default connect(mapStateToProps, mapDispatchtoProps)(Signup)