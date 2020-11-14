import React, { Component } from 'react'
//import { connect } from 'react-redux'
import {NavLink} from 'react-router-dom'
import NProgress from 'nprogress'
import {validateMobileNumber
} from '../../utilities/Validators/AuthValidator'
import '../../styles/admin/AdminDashboardStyle.css'

const initialState = {
    Mobile_Number: {
        value: '',
        validateOnChange: false,
        error: ''
    },
    submitCalled: false,
    allFieldsValidated: false
}
class AdminDashboard extends Component {
    constructor(props){
        super(props);
        NProgress.start();
        NProgress.configure({ ease: 'ease', speed: 500 });
    }

    componentDidMount(){       
        NProgress.done()
    }

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
        const { Mobile_Number } = this.state;
        const mobNumError = validateMobileNumber(Mobile_Number.value);
        if ([mobNumError].every(e => e === false)) {
          // no errors submit the form
          console.log('form submitted successfully');

          this.setState({...initialState})
          
          // clear state and show all fields are validated
          //this.setState({ ...initialState, allFieldsValidated: true });
        } else {
          console.log(mobNumError)
          // update the state with errors
          this.setState(state => ({
            Mobile_Number: {
              ...state.Mobile_Number,
              validateOnChange: true,
              error: mobNumError
            }
          }));
        }
    }

    render() {
        return (
            <div className = "main-divs">
                <div className="admin-dashboard-title">
                    Admin Dashboard
                </div> 
                    <div className="find-user">
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
                        </form> 
                        <button type="submit" className='btn waves-effect waves-light'>
                            find User
                        </button>
                    </div>
                <div className="admin-dashboard-upper">
                    <div className="admin-details">
                        <div className="icons">
                            <div className = "admin-icon">
                                <i className="material-icons prefix" 
                                style={{color: "blue",fontSize: "90px"}}
                                >
                                    person_pin
                                </i>
                            </div>
                            
                            <div className = "feedback-sub-icon">
                                <i className="material-icons prefix" 
                                style={{color: "crimson",fontSize: "60px"}}
                                >
                                    dehaze
                                </i>
                            </div>

                        </div>

                        <div className="admin-info">
                            <div className="admin-NID">
                                1234567890
                            </div>
                            <div className = "feedback-sub">
                                Service
                            </div>
                        </div>

                    </div>

                    <div className="pkg">
                        <div className="card ">
                            <div className="card-content">
                                <div className="card-title">
                                    Packages
                                </div>
                                <div className="details">
                                    <p style={{color: "#FF5733"}}>
                                        <NavLink to="/packages/id" className="pkg-name">
                                            package 1
                                        </NavLink>
                                        <NavLink to="/packages/id/edit" className="pkg-edit">
                                            edit
                                        </NavLink>
                                    </p>
                                   
                                </div>
                            </div>
                            <div className = "card-action">
                                <NavLink to="/admin/setpkg" className="set-pkg">
                                    Set New Package
                                </NavLink>
                            </div>
                        </div>
                    </div>

                    <div className="fnf">
                        <div className="card ">
                            <div className="card-content">
                                <div className="card-title">
                                    FNF
                                </div>
                                <div className="details">
                                    <p style={{color: "#FF5733"}}>
                                        <NavLink to="/fnf/id" className="fnf-name">
                                            fnf_name
                                        </NavLink>
                                        <NavLink to="/fnf/id/edit" className="fnf-edit">
                                            edit
                                        </NavLink>
                                    </p>
                                </div>
                            </div>
                            <div className = "card-action">
                                <NavLink to="/admin/setpkg" className="set-fnf">
                                    Set New FNF
                                </NavLink>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="admin-dashboard-lower">
                    
                <div className="feedback">
                        <div className="card ">
                            <div className="card-content">
                                <div className="card-title">
                                    Feedbacks
                                    <div className="card-subtitle">
                                        Service messages
                                    </div>
                                </div>
                                <div className="details">
                                    <div className="feedback-details" style={{color: "#FF5733"}}>
                                        <p className="feeedback-body">
                                        This is a feedback message.This is a feedback message. This is a feedback message.This is a feedback message.This is a feedback message.This is a feedback message.This is a feedback message.This is a feedback message.This is a feedback message.
                                        </p>
                                        <br></br>
                                        <span className="sender">
                                            Sender : 01714356432
                                        </span>
                                        <a className = "btn red reply modal-trigger" href = "#write-reply">
                                            Reply
                                        </a>
                                        <div id="write-reply" className="modal">
                                            <div className="modal-content">
                                                <h4 style = {({color : "black "})}>Reply</h4>
                                                <form>
                                                    <div className = "input-field">
                                                        <i className = "material-icons prefix" style = {({color : "black "})}>
                                                            reply
                                                        </i>
                                                        <input type = "text" id = "reply" style = {({color : "red "})}/>
                                                        <label style = {({color : "red "})}>
                                                            Write a reply
                                                        </label>
                                                    </div>
                                                </form>
                                            </div>
                                            <div className="modal-footer">
                                                <span className = "cancel">
                                                    <button className="modal-close btn red">Cancel</button>
                                                </span>
                                                <span className = "send">
                                                <button className="modal-close btn green">Send</button>
                                                </span> 
                                            </div>
                                        </div>
                                    </div>
                                    
                                    
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="offer">
                        <div className="card ">
                            <div className="card-content">
                                <div className="card-title">
                                    Offer
                                </div>
                                <div className="details">
                                    <p style={{color: "#FF5733"}}>
                                        <NavLink to="/offer/id" className="offer-name">
                                            offer 1
                                        </NavLink>
                                        <NavLink to="/offer/id/edit" className="offer-edit">
                                            edit
                                        </NavLink>
                                    </p>
                                </div>
                            </div>
                            <div className = "card-action">
                                <NavLink to="/admin/setoffer" className="set-offer">
                                    Set New Offer
                                </NavLink>
                            </div>
                        </div>
                    </div>

                </div>
                
                
            </div>
           
        )
    }
}


export default AdminDashboard