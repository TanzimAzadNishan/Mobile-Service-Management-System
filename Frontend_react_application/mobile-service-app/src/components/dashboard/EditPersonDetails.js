import React, { Component } from 'react'
import { connect } from 'react-redux'
import {Redirect} from 'react-router-dom'
import NProgress from 'nprogress'
import {
    editPersonDetails, editProfilePic
} from '../../store/actions/dashboardActions'
import '../../styles/dashboard/EditPersonDetailsStyle.css'
import default_pic from '../../images/default pic.jpg'
import {
    validateName, validatePassword, validateAddress, validateEmail
} from '../../utilities/Validators/DashboardValidator'
import Calendar from './Calendar'
import hashing from '../../utilities/hashing'


const initialState = {
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
    Email: {
        value: '',
        validateOnChange: false,
        error: ''
    },
    Address: {
        value: '',
        validateOnChange: false,
        error: ''
    },
    Gender: {
        value: '',
        validateOnChange: false,
        error: ''
    },
    DOB: {
        value: '',
        validateOnChange: false,
        error: ''
    },
    submitCalled: false,
    allFieldsValidated: false
}


class EditPersonDetails extends Component{
    constructor(props){
        super(props);
        NProgress.start();
        NProgress.configure({ ease: 'ease', speed: 500 });
        this.state = initialState

        this.state = {
            Name: {
                ...this.state.Name,
                value: this.props.personInfo.name
            },
            Password: {
                ...this.state.Password,
                value: this.props.originalPassword
            },
            Email: {
                ...this.state.Email,
                value: (this.props.personInfo.email) ? this.props.personInfo.email : ''
            },
            Address: {
                ...this.state.Address,
                value: (this.props.personInfo.address) ? this.props.personInfo.email : ''
            },
            Gender: {
                ...this.state.Gender,
                value: (this.props.personInfo.gender) ? this.props.personInfo.gender : ''
            },
            DOB: {
                ...this.state.DOB,
                value: this.props.personInfo.dob ? this.props.personInfo.dob : ''
            },
            submitCalled: false,
            allFieldsValidated: false
        }
    }

    componentDidMount(){       
        //NProgress.done()
        //console.log('mounting edit page : ', this.props.personInfo)
        //console.log('mounting edit page : ', this.props.personInfo.email)
    }

    //state = initialState

    selectFile = (e) => {
        var imgFile = e.target.files[0]
        console.log(imgFile)

        const formData = new FormData()
        formData.append('mobile_number', this.props.auth.mobile_number)
        formData.append('file', imgFile)

        this.props.editProfilePic(formData)
    }
    mapFileInput = ()=>{
        document.getElementById('uploadFile').click()
    }

    getDOBFromDatePicker = (date)=>{
        console.log('parent date : ', date)

        this.setState(state =>({
            DOB:{
                ...state.DOB,
                value: date
            }
        }))
    }

    setGender = (evt)=>{
        const field = evt.target.id
        const fieldVal = evt.target.value;
        console.log(fieldVal)
        this.setState(state => ({
            [field]: {
              ...state[field],
              value: fieldVal
            }
          }));
    }

    disableButton = ()=>{
        if((this.state.Name.value === this.props.personInfo.name ||
                this.state.Name.value === '') && 
            (this.state.Password.value === this.props.originalPassword ||
                this.state.Password.value === '') &&
            (this.state.Email.value === '' ||
                this.state.Email.value === this.props.personInfo.email) &&
            (this.state.DOB.value === '' || 
                this.state.DOB.value === this.props.personInfo.dob) &&
            (this.state.Gender.value === '' || 
                this.state.Gender.value === this.props.personInfo.gender) &&
            (this.state.Address.value === '' ||
                this.state.Address.value === this.props.personInfo.address)){

                return true
        }
        else{
            return false
        }
    }

    handleChange = (evt, validationFunc)=>{
        const field = evt.target.id
        const fieldVal = evt.target.value;
        /*var isEmail = (field === 'Email') ? true : false

        if(isEmail){
            this.setState(state => ({
                Email: {
                    ...state.Email,
                    validateOnChange: false
                }
            }))
        }*/

        this.setState(state => ({
          [field]: {
            ...state[field],
            value: fieldVal,
            error: state[field]['validateOnChange'] ? validationFunc(fieldVal) : ''
            //error: !isEmail ? (state[field]['validateOnChange'] ? validationFunc(fieldVal) : '')
              //             : ''
          }
        }));
    }
    handleBlur = (e, validationFunc)=>{
        const field = e.target.id
        //console.log('debugging : ', this.state[field]['validateOnChange'])
        //console.log('submit ? ', this.state.submitCalled)

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
        const { Name, Password, Email, DOB, Gender, Address } = this.state;
        const nameError = validateName(Name.value);
        const passwordError = validatePassword(Password.value)
        const emailError = validateEmail(Email.value)
        const addressError = validateAddress(Address.value)

        if ([nameError, passwordError, emailError, addressError].every(e => e === false)){
            console.log('details form submitted successfully')
            this.state.submitCalled = true

            document.getElementById('Name').blur()
            document.getElementById('Password').blur()
            document.getElementById('Email').blur()
            document.getElementById('Address').blur()

            var editInfo = {
                name: Name.value,
                password: Password.value,
                email: Email.value,
                dob: DOB.value,
                gender: Gender.value,
                address: Address.value,
                mobile_number: this.props.auth.mobile_number
            }

            //if(Password.value !== this.props.auth.password){
            hashing.hashPassword(Password.value, 12)
            .then((hashedPassword)=>{
                editInfo.password = hashedPassword

                this.props.editPersonDetails(editInfo)

                this.setState(state => ({
                    Name: {
                        value: editInfo.name,
                        validateOnChange: false,
                        error: ''
                    },
                    Password: {
                        value: Password.value,
                        validateOnChange: false,
                        error: ''
                    },
                    Email: {
                        value: editInfo.email,
                        validateOnChange: false,
                        error: ''
                    },
                    Address: {
                        value: editInfo.address,
                        validateOnChange: false,
                        error: ''
                    },
                    Gender: {
                        value: editInfo.gender,
                        validateOnChange: false,
                        error: ''
                    },
                    DOB: {
                        value: editInfo.dob,
                        validateOnChange: false,
                        error: ''
                    },
                    submitCalled: false,
                    allFieldsValidated: false
                }))
            })
            //}

            //this.setState({...initialState})
        }

        else{
            console.log(nameError)
            console.log(passwordError)
            console.log(emailError)
            console.log(addressError)

            // update the state with errors
            this.setState(state => ({
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
                Email: {
                    ...state.Email,
                    validateOnChange: true,
                    error: emailError
                },
                Address: {
                    ...state.Address,
                    validateOnChange: true,
                    error: addressError
                },
                Gender: {
                    ...state.Gender,
                    validateOnChange: true,
                    error: ''
                },
                DOB: {
                    ...state.DOB,
                    validateOnChange: true,
                    error: ''
                },
                submitCalled: false,
                allFieldsValidated: false

            }));
        }
    }


    render() {
        if (this.props.auth == null){
            console.log('redirected')
            return <Redirect to='/' />
        }

        else{
            NProgress.done()
            const {
                auth, personInfo, profilePic
            } = this.props

            const proPic = (profilePic) ? (
                <img className="profile-pic" 
                    src={`http://localhost:4000/${profilePic}`} alt="user chosen"
                />
            ) : (

                <img className="profile-pic" 
                    src={default_pic} alt="default"
                />
                
            )

            //console.log('person info : ', personInfo)

            return(
                <>
                    <div className="edit-page-title">
                        Edit Information
                    </div>

                    <div className="edit-details">
                        <div className="left-section">
                            
                            <div className="profile">
                                <div className="profile-pic-part">
                                
                                    {proPic}

                                    <div 
                                        className="edit-profile-pic"
                                        onClick={this.mapFileInput}
                                    >
                                        <span className="material-icons">
                                            insert_photo
                                        </span>
                                        <h6> Edit </h6>
                                    </div>
                                    <input 
                                        id="uploadFile" 
                                        hidden type="file"
                                        onChange={this.selectFile}
                                    />
                                </div>

                                <div className="person-info">
                                    <div className="person-name">
                                        {personInfo.name}
                                    </div>
                                    <div className="person-mob-num">
                                        {auth.mobile_number}
                                    </div>
                                    <div className="person-email">
                                        {(personInfo.email !== '') ? personInfo.email 
                                        : `Email not added`}
                                    </div>
                                </div>
                            </div>

                            {/** 
                            <NavLink to="/dashboard" className="dashboard">
                                Back To Dashboard
                            </NavLink>
                            */}

                        </div>

                        <div className="right-section">

                            <div className="right-header">
                                Edit Details
                            </div>

                            <form onSubmit={this.handleSubmit}
                                  className="form-section"
                            >
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
                                        className="active"
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
                                        className="active"
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
                                    style={this.state.Email.error ? ({color: "red"}):(null)}
                                    >
                                        email
                                    </i>

                                    <input type="text" id="Email"
                                        className="validate"
                                        style={this.state.Email.error ? ({color: "red"}):(null)}
                                        value={this.state.Email.value} 
                                        onChange={(e)=>{this.handleChange(e, validateEmail)}}
                                        onBlur={(e)=>{this.handleBlur(e, validateEmail)}}
                                    />

                                    <label htmlFor="email"
                                        className="active"
                                        style={this.state.Email.error ? ({color: "red"}):(null)}
                                    > 
                                        Email
                                    </label>

                                    <div style={{color: "red"}}>
                                        {this.state.Email.error}
                                    </div>
                                </div>

                                <div className="dob-gender">
                                    <div className="dob-part">
                                        <i className="material-icons prefix" 
                                            style={{paddingRight: '1rem'}}
                                        >
                                            calendar_today
                                        </i>

                                        <Calendar 
                                            className="calendar"
                                            userDOB={this.state.DOB.value} 
                                            getDOB={this.getDOBFromDatePicker} 
                                        />

                                    </div>

                                    <select 
                                        className="browser-default" 
                                        value={this.state.Gender.value}
                                        onChange={this.setGender}
                                        id="Gender"
                                    >
                                        <option value="" disabled>Gender</option>
                                        <option value="M"> Male </option>
                                        <option value="F"> Female </option>
                                    </select>

                                </div>

                                <div className="input-field">
                                    
                                    <i className="material-icons prefix" 
                                    style={this.state.Address.error ? ({color: "red"}):(null)}
                                    >
                                        home
                                    </i>

                                    <input type="text" id="Address"
                                        className="validate"
                                        style={this.state.Address.error ? ({color: "red"}):(null)}
                                        value={this.state.Address.value} 
                                        onChange={(e)=>{this.handleChange(e, validateAddress)}}
                                        onBlur={(e)=>{this.handleBlur(e, validateAddress)}}
                                    />

                                    <label htmlFor="address"
                                        className="active"
                                        style={this.state.Address.error ? ({color: "red"}):(null)}
                                    > 
                                        Address
                                    </label>

                                    <div style={{color: "red"}}>
                                        {this.state.Address.error}
                                    </div>
                                </div>

                                <div className="input-field save-change-btn">
                                    <button 
                                        type="submit" 
                                        className='btn waves-effect waves-light'
                                        disabled={this.disableButton()}
                                    >
                                        Save Changes
                                    </button>
                                </div>

                            </form>

                        </div>
                    </div>
                </>
            )
        }
    }
}


const mapStateToProps = (state) => {
    return {
      auth: state.auth.auth,
      originalPassword: state.auth.originalPassword, 
      personInfo: state.dashboard.personInfo,
      profilePic: state.dashboard.profilePic
    }
}

const mapDispatchtoProps = (dispatch)=>{
    return{
        editPersonDetails: (personInfo)=>{
            dispatch(editPersonDetails(personInfo))
        },
        editProfilePic: (pic)=>{
            dispatch(editProfilePic(pic))
        }
    }
}

export default connect(mapStateToProps, mapDispatchtoProps)(EditPersonDetails)