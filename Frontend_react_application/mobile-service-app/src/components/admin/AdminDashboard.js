import React, { Component } from 'react'
//import { connect } from 'react-redux'
import {NavLink} from 'react-router-dom'
import Modal from 'react-modal'
import NProgress from 'nprogress'
import {validateMobileNumber} from '../../utilities/Validators/AuthValidator'
import '../../styles/admin/AdminDashboardStyle.css'

const initialState = {
    Mobile_Number: {
        value: '',
        validateOnChange: false,
        error: ''
    },
    submitCalled: false,
    allFieldsValidated: false,
    activeModal: '',
    packageName: '',
    pkgCallRate: 0,
    pkgSMSRate: 0,
    pkgFNFNo: 0,
    fnfName: '',
    fnfCallRate: 0,
    fnfSMSRate: 0,
    offerID: '',
    offerAmount: 0,
    offerValidity: 0,
    offerPoints: 0,
    offerBonusPoints: 0,
    offerInternet: 0,
    offerBonusInternet: 0,
    offerTalktime: 0,
    offerBonusTalktime: 0,
    offerSms: 0,
    offerBonusSms: 0,
    feedbackID: '',
    feedbackBody: '',
    feeedbackSender: ''
}

class AdminDashboard extends Component {
    constructor(props){
        super(props);
        NProgress.start();
        NProgress.configure({ ease: 'ease', speed: 500 });
        this.openPkgModal = this.openPkgModal.bind(this);
        this.closePkgModal = this.closePkgModal.bind(this);
        this.openfnfModal = this.openfnfModal.bind(this);
        this.closefnfModal = this.closefnfModal.bind(this);
        this.openOfferModal = this.openOfferModal.bind(this);
        this.closeOfferModal = this.closeOfferModal.bind(this);
        this.openFeedbackModal = this.openFeedbackModal.bind(this);
        this.closeFeedbackModal = this.closeFeedbackModal.bind(this);
        this.closeFeedbackModalOpenSentModal = this.closeFeedbackModalOpenSentModal.bind(this);
        this.closeSentModal = this.closeSentModal.bind(this);
    }

    componentDidMount(){       
        NProgress.done()
    }

    state = initialState

    openPkgModal (name,callRate,SMSRate,fnfno) {
        this.setState(
            {activeModal:'package-details',
            packageName: name,
            pkgCallRate: callRate,
            pkgSMSRate: SMSRate,
            pkgFNFNo: fnfno}
            ); 
        }
    closePkgModal () {
        this.setState(
            {activeModal:'',
            packageName: '',
            pkgCallRate: 0,
            pkgSMSRate: 0,
            pkgFNFNo: 0}
            ); 
        }

    openfnfModal (name,callRate,SMSRate) {
        this.setState(
            {activeModal:'fnf-details',
            fnfName: name,
            fnfCallRate: callRate,
            fnfSMSRate: SMSRate}
            ); 
        }
    closefnfModal () {
        this.setState(
            {activeModal:'',
            fnfName: '',
            fnfCallRate: 0,
            fnfSMSRate: 0}
            ); 
        }
    
     openOfferModal (name, amount, validity,points,bonusPoints,internet,bonusInternet,
     talktime,bonusTalktime,sms,bonusSms) {
        this.setState(
            {activeModal:'offer-details',
            offerID: name,
            offerAmount: amount,
            offerValidity: validity,
            offerPoints: points,
            offerBonusPoints: bonusPoints,
            offerInternet: internet,
            offerBonusInternet: bonusInternet,
            offerTalktime: talktime,
            offerBonusTalktime: bonusTalktime,
            offerSms: sms,
            offerBonusSms: bonusSms}
            ); 
        }
    closeOfferModal () {
        this.setState(
            {activeModal:'',
            offerID: '',
            offerAmount: 0,
            offerValidity: 0,
            offerPoints: 0,
            offerBonusPoints: 0,
            offerInternet: 0,
            offerBonusInternet: 0,
            offerTalktime: 0,
            offerBonusTalktime: 0,
            offerSms: 0,
            offerBonusSms: 0}
            ); 
        }

    openFeedbackModal (ID, body, sender) {
        this.setState(
            {activeModal:'feedback-details',
            feedbackID: ID,
            feedbackBody: body,
            feeedbackSender: sender}
            ); 
        }
    closeFeedbackModal () {
        this.setState(
            {activeModal:'',
            feedbackID: '',
            feedbackBody: '',
            feeedbackSender: ''}
            ); 
        }
    closeFeedbackModalOpenSentModal () {
        this.setState(
            {activeModal: 'feedback-sent'}
            );
        }

    closeSentModal () {
        this.setState(
            {activeModal: ''}
            );
        }

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
                        <button type="submit" className='btn red'>
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
                                        <span className="pkg-name" onClick = {() => this.openPkgModal('Package 1',2.34,2.34,20)}>
                                            Package 1
                                        </span>
                                    </p>
                                </div>
                            </div>
                            <div className = "card-action">
                                <NavLink to="/admin/setpkg" className="set-pkg">
                                    Set New Package
                                </NavLink>
                            </div>
                        </div>
                        <Modal className = "pkg-info" isOpen={this.state.activeModal === 'package-details'} ariaHideApp={false} >
                                <div className = "pkg-details">
                                    <br></br><span className = "pkg-details-title">{this.state.packageName}</span><br></br>
                                    Call Rate : {this.state.pkgCallRate}<br></br>
                                    SMS Rate : {this.state.pkgSMSRate}<br></br>
                                    FNF Number(Max) : {this.state.pkgFNFNo}<br></br>
                                </div>
                                <span className = "pkg-cancel">
                                    <button className="btn red" onClick = {() => this.closePkgModal()}>Cancel</button>
                                </span>
                                <span className = "pkg-edit">
                                    <NavLink className = "btn green" to="/packages/id/edit">
                                        edit
                                    </NavLink>
                                </span>
                        </Modal>
                    </div>

                    <div className="fnf">
                        <div className="card ">
                            <div className="card-content">
                                <div className="card-title">
                                    FNF
                                </div>
                                <div className="details">
                                    <p style={{color: "#FF5733"}}>
                                        <span className="fnf-name" onClick = {() => this.openfnfModal('fnf 1',2.34,2.34)}>
                                            FNF 1
                                        </span>
                                    </p>
                                </div>
                            </div>
                            <div className = "card-action">
                                <NavLink to="/admin/setfnf" className="set-fnf">
                                    Set New FNF
                                </NavLink>
                            </div>
                        </div>
                        <Modal className = "fnf-info" isOpen={this.state.activeModal === 'fnf-details'} ariaHideApp={false} >
                                <div className = "fnf-details">
                                    <br></br><span className = "fnf-details-title">{this.state.fnfName}</span><br></br>
                                    Call Rate : {this.state.fnfCallRate}<br></br>
                                    SMS Rate : {this.state.fnfSMSRate}<br></br>
                                </div>
                                <span className = "fnf-cancel">
                                    <button className="btn red" onClick = {() => this.closefnfModal()}>Cancel</button>
                                </span>
                                <span className = "fnf-edit">
                                    <NavLink className = "btn green" to="/fnf/id/edit">
                                        edit
                                    </NavLink>
                                </span>
                        </Modal>
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
                                    <div className="feedback-details" style={{color: "black"}}>
                                        <span className="container feedback-body" onClick = {() => this.openFeedbackModal('7653372578','This is a feedback message.This is a feedback message. This is a feedback message.This is a feedback message.This is a feedback message.This is a feedback message.This is a feedback message.This is a feedback message.This is a feedback message.','01714356432')}>
                                            ID: 7653372578
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Modal className = "feedback-info" isOpen={this.state.activeModal === 'feedback-details'} ariaHideApp={false} >
                                <div>
                                    <p className = "feed-body">
                                        {this.state.feedbackBody}
                                    </p>
                                    <br></br>
                                    <span className="sender">
                                        Sender : {this.state.feeedbackSender}
                                    </span>
                                    <br></br>  <br></br>
                                    <h4 style = {({color : "black ", paddingLeft: "5%"})}>Reply</h4>
                                    <form>
                                        <div className = "input-field" style = {({ paddingRight: "5%"})}>
                                            <i className = "material-icons prefix" style = {({color : "black "})}>
                                                reply
                                            </i>
                                            <input type = "text" id = "feed-reply" style = {({color : "red "})}/>
                                                <label style = {({color : "red "})}>
                                                    Write a reply
                                                </label>
                                        </div>
                                    </form>
                                </div>
                                <div>
                                <span className = "feed-cancel" onClick = {() => (this.closeFeedbackModal())}>
                                    <button className="btn red">Close</button>
                                </span>
                                <span className = "feed-send" onClick = {() => (this.closeFeedbackModalOpenSentModal())}>
                                    <button className="btn green">Send</button>
                                </span>
                                </div>
                        </Modal>
                        <Modal className = "feedback-sent" isOpen={this.state.activeModal === 'feedback-sent'} ariaHideApp={false}>
                            Your reply has been sent to the  user!
                            <div className = "sent-close" onClick = {() => (this.closeSentModal())}>
                                <button className="btn red">Exit</button>
                            </div>
                        </Modal>
                    </div>

                    <div className="offer">
                        <div className="card ">
                            <div className="card-content">
                                <div className="card-title">
                                    Offer
                                </div>
                                <div className="details">
                                    <p style={{color: "#FF5733"}}>
                                        <span className="offer-name" onClick = {() => this.openOfferModal('Offer 1',99,7,30,5,1024,200,30,5,50,10)}>
                                            Offer 1
                                        </span>
                                    </p>
                                </div>
                            </div>
                            <div className = "card-action">
                                <NavLink to="/admin/setoffer" className="set-offer">
                                    Set New Offer
                                </NavLink>
                            </div>
                        </div>
                        <Modal className = "offer-info" isOpen={this.state.activeModal === 'offer-details'} ariaHideApp={false} >
                                <div className = "offer-details">
                                    <br></br><span className = "offer-details-title">{this.state.offerID}</span><br></br>
                                    Amount : {this.state.offerAmount} Bdt<br></br>
                                    Validity : {this.state.offerValidity} days<br></br>
                                    Points : {this.state.offerPoints}<br></br>
                                    Bonus Points : {this.state.offerBonusPoints}<br></br>
                                    Internet : {this.state.offerInternet} MB<br></br>
                                    Bonus Internet : {this.state.offerBonusInternet} MB<br></br>
                                    Talktime : {this.state.offerTalktime} minutes<br></br>
                                    Bonus Talktime : {this.state.offerBonusTalktime} minutes<br></br>
                                    SMS : {this.state.offerSms}<br></br>
                                    Bonus SMS : {this.state.offerBonusSms}<br></br>
                                </div>
                                <span className = "offer-cancel">
                                    <button className="btn red" onClick = {() => this.closeOfferModal()}>Cancel</button>
                                </span>
                                <span className = "offer-edit">
                                    <NavLink className = "btn green" to="/offer/id/edit">
                                        edit
                                    </NavLink>
                                </span>
                        </Modal>
                    </div>
                </div>
            </div> 
        )
    }
}


export default AdminDashboard