import React, { Component } from 'react'
import { connect } from 'react-redux'
import {NavLink} from 'react-router-dom'
import NProgress from 'nprogress'
import Modal from 'react-modal'
import {updateAccountInfo, retrieveAccountBalance} from '../../store/actions/service/flexiplanActions'
import '../../styles/service/FlexiplanStyle.css'

const initialState = {
    internetBalance: '0MB',
    talktimeBalance: '0 Min',
    SMSBalance: '0 SMS',
    validity: '0 Days',
    internetAmount: 0,
    talktimeAmount: 0,
    smsAmount: 0,
    //totalAmount: 0,
    planDetails: {
        internet: 0,
        talktime: 0,
        sms: 0,
        validity: 0,
        mobile_number: '',
        amount: 0
    },
    activeModal: ''
}

class Flexiplan extends Component{
    constructor(props){
        super(props);
        NProgress.start();
        NProgress.configure({ ease: 'ease', speed: 500 });
        this.updateAccount = this.updateAccount.bind(this);
        this.openConfirmationModal = this.openConfirmationModal.bind(this);
        this.closeConfirmationModal = this.closeConfirmationModal.bind(this);
    }

    state = initialState

    componentDidMount(){
        NProgress.done();
        if (this.props.auth != null){
            this.setState({
                planDetails: {
                    ...this.state.planDetails,
                    mobile_number: this.props.auth.mobile_number
                }
            })
        }
        this.props.retrieveAccountBalance(this.props.auth)
        
    }

    getInternetBalance = (e) => {
        this.setState({internetBalance: e.target.innerHTML});
        if(parseInt(e.target.innerHTML)<30){
            this.setState({internetAmount: parseInt(e.target.innerHTML)*1000*.08})
        }
        else{
            this.setState({internetAmount: parseInt(e.target.innerHTML)*.25})
        }
        //this.setState({totalAmount: this.state.internetAmount+this.state.talktimeAmount+this.state.smsAmount})
        //this.state.totalAmount = this.state.internetAmount+this.state.talktimeAmount+this.state.smsAmount
    }

    getTalktimeBalance = (e) => {
        this.setState({talktimeBalance: e.target.innerHTML});
        if(parseInt(e.target.innerHTML)<200){
            this.setState({talktimeAmount: parseInt(e.target.innerHTML)*.9})
        }
        else{
            this.setState({talktimeAmount: parseInt(e.target.innerHTML)*.2})
        }
    }

    getSMSBalance = (e) => {
        this.setState({SMSBalance: e.target.innerHTML});
        if(parseInt(e.target.innerHTML)<1000){
            this.setState({smsAmount: parseInt(e.target.innerHTML)*.5})
        }
        else{
            this.setState({smsAmount: parseInt(e.target.innerHTML)*1})
        }
    }

    getValidity = (e) => {
        this.setState({validity: e.target.innerHTML});
    }

    openConfirmationModal = (e)=> {
        if(parseInt(this.state.internetBalance)>15){
            this.setState({
                activeModal: 'plan-confirm',
                planDetails: {
                    ...this.state.planDetails,
                    internet: parseInt(this.state.internetBalance),
                    talktime: parseInt(this.state.talktimeBalance),
                    sms: parseInt(this.state.SMSBalance),
                    validity: parseInt(this.state.validity),
                    amount: this.state.internetAmount+this.state.smsAmount+this.state.talktimeAmount
                }
            }
        );}
        else{
            this.setState({
                activeModal: 'plan-confirm',
                planDetails: {
                    ...this.state.planDetails,
                    internet: parseInt(this.state.internetBalance)*1024,
                    talktime: parseInt(this.state.talktimeBalance),
                    sms: parseInt(this.state.SMSBalance),
                    validity: parseInt(this.state.validity),
                    amount: this.state.internetAmount+this.state.smsAmount+this.state.talktimeAmount
                }
            }
        );
        }
        
        //console.log(this.state.planDetails)
    }

    updateAccount =(e)=>{
        if(this.state.planDetails.amount>this.props.balance){
            this.setState({activeModal: 'plan-denied'})
        }
        else if(this.state.planDetails.amount<=this.props.balance){
            this.setState({activeModal: 'plan-bought'});
            this.props.updateAccountInfo(this.state.planDetails);
        }
        
    }

    closeConfirmationModal(){
        this.setState({
            activeModal: ''
        });
        window.location.reload(false);
    }

    render() {
        if(this.props.auth == null){
            return(
                <>
                <div >
                    <div className = "no-show">
                        You need to <NavLink to='/login'>Login</NavLink> or <NavLink to='/signup'>SignUp</NavLink> to select a Flexiplan.<br></br><NavLink to='/'>Return Home</NavLink>
                    </div>
                </div>
                </>
            )
        }
        else{
            

        return(
            <>
                <div className = "plan-title">
                    Flexiplan
                </div>
                <div className = "part">
                    <div className = "plan-internet-part">
                        <div className = "internet-upper">
                            <i className="material-icons prefix internet-icon" 
                                style={{color: "red",fontSize: "50px", padding: "15px"}}
                            >
                                language
                            </i>
                            <div className = "plan-internet-title">
                                Internet
                            </div>
                            <div className = "internet-textbox">
                                {this.state.internetBalance}
                            </div>
                        </div>
                        <div className = "internet-lower">
                            <button className = "option-button-internet" onClick = {(e)=> this.getInternetBalance(e)}>0MB</button>
                            <button className = "option-button-internet" onClick = {(e)=> this.getInternetBalance(e)}>30MB</button>
                            <button className = "option-button-internet" onClick = {(e)=> this.getInternetBalance(e)}>50MB</button>
                            <button className = "option-button-internet" onClick = {(e)=> this.getInternetBalance(e)}>100MB</button>
                            <button className = "option-button-internet" onClick = {(e)=> this.getInternetBalance(e)}>500MB</button>
                            <button className = "option-button-internet" onClick = {(e)=> this.getInternetBalance(e)}>750MB</button>
                            <button className = "option-button-internet" onClick = {(e)=> this.getInternetBalance(e)}>1GB</button>
                            <button className = "option-button-internet" onClick = {(e)=> this.getInternetBalance(e)}>2GB</button>
                            <button className = "option-button-internet" onClick = {(e)=> this.getInternetBalance(e)}>5GB</button>
                            <button className = "option-button-internet" onClick = {(e)=> this.getInternetBalance(e)}>10GB</button>
                        </div>
                    </div>
                    <div className = "plan-details">
                        <div className = "plan-amount">
                            Tk. {this.state.internetAmount+this.state.smsAmount+this.state.talktimeAmount}
                        </div>
                        <div className = "plan-info">
                            {this.state.internetBalance}<br></br>
                            {this.state.talktimeBalance}<br></br>
                            {this.state.SMSBalance}<br></br>
                            {this.state.validity}<br></br>
                        </div>
                        <div>
                            <button className = "buy-plan" onClick = {this.openConfirmationModal}>Buy Now!</button>
                        </div>
                    </div>
                    <Modal className = "confirmation-modal" isOpen={this.state.activeModal === 'plan-confirm'} ariaHideApp={false}>
                         <div>
                            Please Confirm Purchase
                        </div>
                        <button className ='btn green waves-effect waves-light close-confirmation-modal' onClick={this.updateAccount}>Confirm</button>
                        <button className ='btn red waves-effect waves-light close-confirmation-modal' onClick={this.closeConfirmationModal}>Exit</button>
                    </Modal> 
                    <Modal className = "confirmation-modal" isOpen={this.state.activeModal === 'plan-bought'} ariaHideApp={false}>
                         <div>
                            Congrats! You have successfully availed your chosen plan!
                        </div>
                        <button className ='btn red waves-effect waves-light close-confirmation-modal' onClick={this.closeConfirmationModal}>Exit</button>
                    </Modal> 
                    <Modal className = "confirmation-modal" isOpen={this.state.activeModal === 'plan-denied'} ariaHideApp={false}>
                         <div>
                            Sorry! You don't have sufficient balance to avail this plan
                        </div>
                        <button className ='btn red waves-effect waves-light close-confirmation-modal' onClick={this.closeConfirmationModal}>Exit</button>
                    </Modal> 
                </div>
                
                <div className = "part">
                    <div className = "plan-talktime-part">
                        <div className = "talktime-upper">
                            <i className="material-icons prefix talktime-icon" 
                                style={{color: "red",fontSize: "50px", padding: "15px"}}
                            >
                                settings_phone
                            </i>
                            <div className = "plan-talktime-title">
                                Talktime
                            </div>
                            <div className = "talktime-textbox">
                                {this.state.talktimeBalance}
                            </div>
                        </div>
                        <div className = "talktime-lower">
                            <button className = "option-button-talktime" onClick = {(e)=> this.getTalktimeBalance(e)}>0 Mins</button>
                            <button className = "option-button-talktime" onClick = {(e)=> this.getTalktimeBalance(e)}>10 Mins</button>
                            <button className = "option-button-talktime" onClick = {(e)=> this.getTalktimeBalance(e)}>20 Mins</button>
                            <button className = "option-button-talktime" onClick = {(e)=> this.getTalktimeBalance(e)}>50 Mins</button>
                            <button className = "option-button-talktime" onClick = {(e)=> this.getTalktimeBalance(e)}>75 Mins</button>
                            <button className = "option-button-talktime" onClick = {(e)=> this.getTalktimeBalance(e)}>100 Mins</button>
                            <button className = "option-button-talktime" onClick = {(e)=> this.getTalktimeBalance(e)}>300 Mins</button>
                            <button className = "option-button-talktime" onClick = {(e)=> this.getTalktimeBalance(e)}>500 Mins</button>
                        </div>
                    </div>
                </div>

                <div className = "part">
                    <div className = "plan-sms-part">
                        <div className = "sms-upper">
                            <i className="material-icons prefix sms-icon" 
                                style={{color: "red",fontSize: "50px", padding: "15px"}}
                            >
                                email
                            </i>
                            <div className = "plan-sms-title">
                                SMS
                            </div>
                            <div className = "sms-textbox">
                                {this.state.SMSBalance}
                            </div>
                        </div>
                        <div className = "sms-lower">
                            <button className = "option-button-sms" onClick = {(e)=> this.getSMSBalance(e)}>0 SMS</button>
                            <button className = "option-button-sms" onClick = {(e)=> this.getSMSBalance(e)}>30 SMS</button>
                            <button className = "option-button-sms" onClick = {(e)=> this.getSMSBalance(e)}>50 SMS</button>
                            <button className = "option-button-sms" onClick = {(e)=> this.getSMSBalance(e)}>100 SMS</button>
                            <button className = "option-button-sms" onClick = {(e)=> this.getSMSBalance(e)}>200 SMS</button>
                            <button className = "option-button-sms" onClick = {(e)=> this.getSMSBalance(e)}>500 SMS</button>
                            <button className = "option-button-sms" onClick = {(e)=> this.getSMSBalance(e)}>1000 SMS</button>
                            <button className = "option-button-sms" onClick = {(e)=> this.getSMSBalance(e)}>2000 SMS</button>
                        </div>
                    </div>
                </div>

                <div className = "part">
                    <div className = "plan-validity-part">
                        <div className = "validity-upper">
                            <i className="material-icons prefix validity-icon" 
                                style={{color: "red",fontSize: "50px", padding: "15px"}}
                            >
                                more_time
                            </i>
                            <div className = "plan-validity-title">
                                Validity
                            </div>
                            <div className = "validity-textbox">
                                {this.state.validity}
                            </div>
                        </div>
                        <div className = "validity-lower">
                            <button className = "option-button-validity" onClick = {(e)=> this.getValidity(e)}>1 Day</button>
                            <button className = "option-button-validity" onClick = {(e)=> this.getValidity(e)}>3 Days</button>
                            <button className = "option-button-validity" onClick = {(e)=> this.getValidity(e)}>5 Days</button>
                            <button className = "option-button-validity" onClick = {(e)=> this.getValidity(e)}>10 Days</button>
                            <button className = "option-button-validity" onClick = {(e)=> this.getValidity(e)}>15 Days</button>
                            <button className = "option-button-validity" onClick = {(e)=> this.getValidity(e)}>30 Days</button>
                        </div>
                    </div>
                </div>
            </>        
        )}

    }
}

const mapStateToProps = (state) => {
    return {
        auth: state.auth.auth,
        balance: state.flexiplan.balance
    }
}

const mapDispatchtoProps = (dispatch)=>{
    return{
        retrieveAccountBalance: (personInfo)=>{
            dispatch(retrieveAccountBalance(personInfo))
        },
        updateAccountInfo: (planDetails)=>{
            dispatch(updateAccountInfo(planDetails))
        }
    }
}


export default connect(mapStateToProps, mapDispatchtoProps)(Flexiplan)