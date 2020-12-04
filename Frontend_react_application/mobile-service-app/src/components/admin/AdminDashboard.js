import React, { Component } from 'react'
import { connect } from 'react-redux'
import {Redirect} from 'react-router-dom'
import Modal from 'react-modal'
import NProgress from 'nprogress'
import {validateMobileNumber} from '../../utilities/Validators/AuthValidator'
import { 
    retrieveAdminInfo,setNewPackage,editPackage,deletePackage,setNewfnf,editFnf,
    deletefnf,setNewOffer,editOffer,deleteOffer, storeAdminSocketId,
    receiveAllFeedback
} from '../../store/actions/adminDashboardActions'

import '../../styles/admin/AdminDashboardStyle.css'
import {socket} from '../../utilities/SocketIOClient'
import {sendReplyOfFeedback} from '../../store/actions/service/feedbackAction'


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
    feeedbackSender: '',
    feedbackReplyBody: '',
    newPkg: {
        new_pkg_name: '',
        new_pkg_callrate: '',
        new_pkg_fnfno: '',
        new_pkg_setter: ''
    },
    editPkg: {
        edit_pkg_name: '',
        edit_pkg_callrate: '',
        edit_pkg_smsrate: '',
        edit_pkg_fnfno: '',
        edit_pkg_setter: ''
    },
    newfnf: {
        new_fnf_type: '',
        new_fnf_callrate: '',
        new_fnf_smsrate: ''
    },
    editfnf: {
        edit_fnf_type: '',
        edit_fnf_callrate: '',
        edit_fnf_smsrate: ''
    },
    newOffer: {
        new_offer_ID: '',
        new_offer_money: '',
        new_offer_validity: '',
        new_offer_pts: '',
        new_offer_bns_pts: '',
        new_offer_int: '',
        new_offer_bns_int: '',
        new_offer_talktime: '',
        new_offer_bns_talktime: '',
        new_offer_sms: '',
        new_offer_bns_sms: '',
        new_offer_setter: ''
    },
    editedOffer: {
        edited_offer_ID: '',
        edited_offer_money: '',
        edited_offer_validity: '',
        edited_offer_pts: '',
        edited_offer_bns_pts: '',
        edited_offer_int: '',
        edited_offer_bns_int: '',
        edited_offer_talktime: '',
        edited_offer_bns_talktime: '',
        edited_offer_sms: '',
        edited_offer_bns_sms: '',
        edited_offer_setter: ''
    }
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
        console.log('before admin auth mounting ', this.props.auth)
        if (this.props.auth != null){
            this.setState({newPkg: {...this.state.newPkg,new_pkg_setter: this.props.auth.NID}})
            this.setState({editPkg: {...this.state.editPkg,edit_pkg_setter: this.props.auth.NID}})
            this.setState({newOffer: {...this.state.newOffer,new_offer_setter: this.props.auth.NID}})
            this.setState({editedOffer: {...this.state.editedOffer,edited_offer_setter: this.props.auth.NID}})
            
            socket.emit('admin-socket-connection', {adminAuth: this.props.auth})
            
            socket.on('store-admin-socket-id', (socketId)=>{
                console.log('socket id: ', socketId)
                this.props.storeAdminSocketId(socketId)
                var info = {
                    NID: this.props.auth.NID
                }
                this.props.receiveAllFeedback(info)
            })

            this.props.retrieveAdminInfo(this.props.auth)
        }
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

    openEditPkgModal() {
        this.setState(
            {activeModal:'edit-pkg',
            editPkg: {...this.state.editPkg,
                edit_pkg_name: this.state.packageName,
                edit_pkg_callrate: this.state.pkgCallRate,
                edit_pkg_smsrate: this.state.pkgSMSRate,
                edit_pkg_fnfno: this.state.pkgFNFNo
                }
            }
            ); 
        }

    closeEditPkgModal() {
        this.setState({activeModal:''})
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
    
    openEditfnfModal() {
        this.setState(
            {activeModal:'edit-fnf',
            editfnf: {...this.state.editfnf,
                edit_fnf_type: this.state.fnfName,
                edit_fnf_callrate: this.state.fnfCallRate,
                edit_fnf_smsrate: this.state.fnfSMSRate
                }
            }
        ); 
    }
    closeEditfnfModal() {
        this.setState({activeModal:''})
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

    openEditOfferModal() {
        this.setState(
            {activeModal:'edit-offer',
            editedOffer: {...this.state.editedOffer,
                edited_offer_ID: this.state.offerID,
                edited_offer_money: this.state.offerAmount,
                edited_offer_validity: this.state.offerValidity,
                edited_offer_pts: this.state.offerPoints,
                edited_offer_bns_pts: this.state.offerBonusPoints,
                edited_offer_int: this.state.offerInternet,
                edited_offer_bns_int: this.state.offerBonusInternet,
                edited_offer_talktime: this.state.offerTalktime,
                edited_offer_bns_talktime: this.state.offerBonusTalktime,
                edited_offer_sms: this.state.offerSms,
                edited_offer_bns_sms: this.state.offerBonusSms
                }
            }
        ); 
    }
    closeEditOfferModal() {
        this.setState({activeModal:''})
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
            window.location.reload(false);
        }

    openSetPkgModal() {
        this.setState(
            {activeModal: 'set-package'}
        );
    }

    closeSetPkgModal() {
        this.setState(
            {activeModal: ''}
        );
    }

    openSetfnfModal() {
        this.setState(
            {activeModal: 'set-fnf'}
        );
    }

    closeSetfnfModal() {
        this.setState(
            {activeModal: ''}
        );
    }

    openSetOfferModal() {
        this.setState(
            {activeModal: 'set-offer'}
        );
    }

    closeSetOfferModal() {
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

    handleNewPkgSubmit = (e)=>{
        e.preventDefault();
        //this.state.newPkg.new_pkg_setter = this.state.auth.NID
        //console.log(this.state.newPkg)
        
        this.props.setNewPackage(this.state.newPkg)
        this.setState(
            {activeModal:'',
            newPkg: {...this.state.newPkg,
                new_pkg_name: '',
                new_pkg_callrate: '',
                new_pkg_smsrate: '',
                new_pkg_fnfno: ''
                }
            }
            ); 
            this.props.retrieveAdminInfo(this.props.auth)
    }

    handleNewPkgChange = (e)=>{
        const field = e.target.id
        const fieldVal = e.target.value;
        this.setState({newPkg: {...this.state.newPkg,[field]: fieldVal}})
    }

    handleEditPkgSubmit = (e)=>{
        e.preventDefault();
        //this.state.newPkg.new_pkg_setter = this.state.auth.NID
        //console.log(this.state.newPkg)
        console.log(this.state.editPkg)
        this.props.editPackage(this.state.editPkg)
        this.setState(
            {activeModal:'',
            editPkg: {...this.state.editPkg,
                edit_pkg_name: '',
                edit_pkg_callrate: '',
                edit_pkg_smsrate: '',
                edit_pkg_fnfno: ''
                }
            }
            ); 
            this.props.retrieveAdminInfo(this.props.auth)
    }

    handleEditPkgChange = (e)=>{
        const field = e.target.id
        const fieldVal = e.target.value;
        this.setState({editPkg: {...this.state.editPkg,[field]: fieldVal}})
    }

    deletePkg(){
        this.props.deletePackage(this.state.editPkg)
        this.setState(
            {activeModal:'',
            editPkg: {...this.state.editPkg,
                edit_pkg_name: '',
                edit_pkg_callrate: '',
                edit_pkg_smsrate: '',
                edit_pkg_fnfno: ''
                }
            }
            );
            this.props.retrieveAdminInfo(this.props.auth)
    }

    handleNewfnfSubmit = (e)=>{
        e.preventDefault();
        //this.state.newPkg.new_pkg_setter = this.state.auth.NID
        //console.log(this.state.newPkg)
        this.props.setNewfnf(this.state.newfnf)
        this.setState(
            {activeModal:'',
            newfnf: {...this.state.newfnf,
                new_fnf_type: '',
                new_fnf_callrate: '',
                new_fnf_smsrate: ''
                }
            }
            ); 
            this.props.retrieveAdminInfo(this.props.auth)
    }

    handleNewfnfChange = (e)=>{
        const field = e.target.id
        const fieldVal = e.target.value;
        this.setState({newfnf: {...this.state.newfnf,[field]: fieldVal}})
    }

    handleEditfnfSubmit = (e)=>{
        e.preventDefault();
        //this.state.newPkg.new_pkg_setter = this.state.auth.NID
        console.log(this.state.editfnf)
        this.props.editFnf(this.state.editfnf)
        this.setState(
            {activeModal:'',
            editfnf: {...this.state.editfnf,
                edit_fnf_type: '',
                edit_fnf_callrate: '',
                edit_fnf_smsrate: ''
                }
            }
            ); 
            this.props.retrieveAdminInfo(this.props.auth)
    }

    handleEditfnfChange = (e)=>{
        const field = e.target.id
        const fieldVal = e.target.value;
        this.setState({editfnf: {...this.state.editfnf,[field]: fieldVal}})
    }

    deletefnf(){
        console.log(this.state.editfnf)
        this.props.deletefnf(this.state.editfnf)
        this.setState(
            {activeModal:'',
            editfnf: {...this.state.editfnf,
                edit_fnf_type: '',
                edit_fnf_callrate: '',
                edit_fnf_smsrate: ''
                }
            }
            );
            this.props.retrieveAdminInfo(this.props.auth)
    }

    handleNewOfferSubmit = (e)=>{
        e.preventDefault();
        //this.state.newPkg.new_pkg_setter = this.state.auth.NID
        //console.log(this.state.newPkg)
        
        this.props.setNewOffer(this.state.newOffer)
        this.setState(
            {activeModal:'',
            newOffer: {...this.state.newOffer,
                new_offer_ID: '',
                new_offer_money: '',
                new_offer_validity: '',
                new_offer_pts: '',
                new_offer_bns_pts: '',
                new_offer_int: '',
                new_offer_bns_int: '',
                new_offer_talktime: '',
                new_offer_bns_talktime: '',
                new_offer_sms: '',
                new_offer_bns_sms: ''
                }
            }
            ); 
            this.props.retrieveAdminInfo(this.props.auth)
    }

    handleNewOfferChange = (e)=>{
        const field = e.target.id
        const fieldVal = e.target.value;
        this.setState({newOffer: {...this.state.newOffer,[field]: fieldVal}})
    }

    handleEditOfferSubmit = (e)=>{
        e.preventDefault();
        //this.state.newPkg.new_pkg_setter = this.state.auth.NID
        //console.log(this.state.newPkg)
        console.log(this.state.editedOffer)
        this.props.editOffer(this.state.editedOffer)
        this.setState(
            {activeModal:'',
            editedOffer: {...this.state.editedOffer,
                edited_offer_ID: '',
                edited_offer_money: '',
                edited_offer_validity: '',
                edited_offer_pts: '',
                edited_offer_bns_pts: '',
                edited_offer_int: '',
                edited_offer_bns_int: '',
                edited_offer_talktime: '',
                edited_offer_bns_talktime: '',
                edited_offer_sms: '',
                edited_offer_bns_sms: ''
                }
            }
            ); 
            this.props.retrieveAdminInfo(this.props.auth)
    }

    handleEditOfferChange = (e)=>{
        const field = e.target.id
        const fieldVal = e.target.value;
        this.setState({editedOffer: {...this.state.editedOffer,[field]: fieldVal}})
    }

    deleteOffer(){
        this.props.deleteOffer(this.state.editedOffer)
        this.setState(
            {activeModal:'',
            editedOffer: {...this.state.editedOffer,
                edited_offer_ID: '',
                edited_offer_money: '',
                edited_offer_validity: '',
                edited_offer_pts: '',
                edited_offer_bns_pts: '',
                edited_offer_int: '',
                edited_offer_bns_int: '',
                edited_offer_talktime: '',
                edited_offer_bns_talktime: '',
                edited_offer_sms: '',
                edited_offer_bns_sms: ''
                }
            }
            );
            this.props.retrieveAdminInfo(this.props.auth)
    }

    disableButton = ()=>{
        if(this.state.feedbackReplyBody.length < 20 ){
            return true
        }
        else{
            return false
        }
    }

    feedbackReplyChange = (evt)=>{
        const fieldVal = evt.target.value;
        this.setState({
            feedbackReplyBody: fieldVal
        })
    }

    sendReplyOfFeedback = (evt)=>{
        evt.preventDefault();
        var info = {
            subject: this.props.adminFeedInfo,
            reviewer: this.state.feeedbackSender,
            body: this.state.feedbackReplyBody,
            NID: this.props.auth.NID 
        }
        this.props.sendReplyOfFeedback(info)
    }

    render() {
        const {
            auth, adminFeedInfo, packageInfo, fnfInfo, offerInfo
        } = this.props

        if(this.props.userAuth != null){
            console.log('redirected')
            return <Redirect to='/dashboard' />
        }

        else if (this.props.auth == null){
        //if (0){
            console.log('redirected')
            return <Redirect to='/admin/login' />
        } 

        else if(auth == null || adminFeedInfo == null){
        //else if(0){
            return(
                <>
                </>
            )
        }
        else{
            NProgress.done()
            //this.state.newPkg.new_pkg_setter= auth.NID
            //console.log(auth.NID)
            var packages = []
            var obj = packageInfo
            for(var i in obj)
                packages.push(obj[i]);
            const packageList = packages.map(pkg => {

                return(
                    <>
                    <div className="details" key={pkg.PKG_NAME}>
                        <p style={{color: "#FF5733"}}>
                            <span className="pkg-name" onClick = {() => this.openPkgModal(pkg.PKG_NAME,pkg.CALL_RATE,pkg.SMS_RATE,pkg.FNF_NUM)}>
                                {pkg.PKG_NAME}
                            </span>
                        </p>
                    </div>
                    </>
                )
            })

            var fnfs = []
            obj = fnfInfo
            for(i in obj)
                fnfs.push(obj[i]);

            const fnfList = fnfs.map(fnf => {

                return(
                    <>
                    <div className="details" key = {fnf.FNF_TYPE}>
                        <p style={{color: "#FF5733"}}>
                            <span className="fnf-name" onClick = {() => this.openfnfModal(fnf.FNF_TYPE,fnf.CALL_RATE,fnf.SMS_RATE)}>
                                {fnf.FNF_TYPE}
                            </span>
                        </p>
                    </div>
                    </>
                )
            })

            var offers = []
            obj = offerInfo
            for(i in obj)
                offers.push(obj[i]);

            const offerList = offers.map(offer => {

                return(
                    <>
                     <div className="details" key = {offer.OFFER_ID}>
                        <p style={{color: "#FF5733"}}>
                            <span className="offer-name" onClick = {() => this.openOfferModal(offer.OFFER_ID, offer.MONEY, offer.VALIDITY, offer.EARNED_PTS, offer.BONUS_PTS, offer.INT_BAL, offer.BONUS_INT_BAL, offer.MIN_BAL, offer.BONUS_MIN_BAL, offer.SMS_BAL, offer.BONUS_SMS)}>
                                {offer.OFFER_ID}
                            </span>
                        </p>
                    </div>
                    </>
                )
            })
            var feedbackList;
            if(this.props.adminFeedbackList!=null)
            {feedbackList = this.props.adminFeedbackList.map((item, index)=>{
                return(
                    <div 
                        className="feedback-details" 
                        style={{color: "black"}}
                        key={index}
                    >
                        <div className="container feedback-body" 
                            onClick = {
                                () => this.openFeedbackModal(item.FEEDBACK_ID,
                                item.FEEDBACK_BODY ,
                                item.REVIEWER)}>
                                    
                            <p>ID:{item.FEEDBACK_ID}</p>
                        </div>
                    </div>
                )
            })}
            else {feedbackList = null}

            console.log('feedback list: ', feedbackList)

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
                                {auth.NID}
                            </div>
                            <div className = "feedback-sub">
                                {adminFeedInfo}
                            </div>
                        </div>

                    </div>

                    <div className="pkg">
                        <div className="card ">
                            <div className="card-content">
                                <div className="card-title">
                                    Packages
                                </div>
                                {packageList}
                            </div>
                            <div className = "card-action">
                                <span className="set-pkg"  onClick = {() => this.openSetPkgModal()}>
                                    SET NEW PACKAGE
                                </span>
                            </div>
                            <Modal className="set-pkg-modal" isOpen={this.state.activeModal === 'set-package'} ariaHideApp={false}>
                                <div className="set-pkg-title">
                                    Set New Package                        
                                </div>
                                <form onSubmit={this.handleNewPkgSubmit}>
                                        <div className= "input-field">
                                        <input type = "text" id = "new_pkg_name"
                                        value={this.state.newPkg.new_pkg_name}
                                        onChange={(e)=>{this.handleNewPkgChange(e)}}
                                        />
                                        <label htmlFor = "new-pkg-name">Package Name</label>
                                        </div>
                                        <div className= "input-field">
                                        <input type = "text" id = "new_pkg_callrate" 
                                        value={this.state.newPkg.new_pkg_callrate}
                                        onChange={(e)=>{this.handleNewPkgChange(e)}}
                                        />
                                        <label htmlFor = "new-pkg-callrate">Call Rate</label>
                                        </div>
                                        <div className= "input-field">
                                        <input type = "text" id = "new_pkg_smsrate" 
                                        value={this.state.newPkg.new_pkg_smsrate}
                                        onChange={(e)=>{this.handleNewPkgChange(e)}}
                                        />
                                        <label htmlFor = "new-pkg-smsrate">SMS Rate</label>
                                        </div>
                                        <div className= "input-field">
                                        <input type = "text" id = "new_pkg_fnfno" 
                                        value={this.state.newPkg.new_pkg_fnfno}
                                        onChange={(e)=>{this.handleNewPkgChange(e)}}
                                        />
                                        <label htmlFor = "new-pkg-fnfno">Number of FNF(max)</label>
                                        </div>
                                        <div><button type="submit" className='btn green pkg-submit'>
                                            Confirm
                                        </button>              
                                        <button className="btn red" onClick = {() => this.closeSetPkgModal()}>Cancel</button></div>
                                </form>
                            </Modal>
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
                                    <button className = "btn green" onClick = {() => this.openEditPkgModal()}>edit</button>
                                </span>
                            </Modal>
                            <Modal className="set-pkg-modal" isOpen={this.state.activeModal === 'edit-pkg'} ariaHideApp={false}>
                                <div className="set-pkg-title">
                                    {this.state.packageName}                       
                                </div>
                                <form onSubmit={this.handleEditPkgSubmit}>
                                        <div className= "input-field">
                                        <input type = "text" id = "edit_pkg_callrate" 
                                        value={this.state.editPkg.edit_pkg_callrate}
                                        onChange={(e)=>{this.handleEditPkgChange(e)}}
                                        />
                                        <label htmlFor = "edit-pkg-callrate">Call Rate</label>
                                        </div>
                                        <div className= "input-field">
                                        <input type = "text" id = "edit_pkg_smsrate" 
                                        value={this.state.editPkg.edit_pkg_smsrate}
                                        onChange={(e)=>{this.handleEditPkgChange(e)}}
                                        />
                                        <label htmlFor = "edit-pkg-smsrate">SMS Rate</label>
                                        </div>
                                        <div className= "input-field">
                                        <input type = "text" id = "edit_pkg_fnfno" 
                                        value={this.state.editPkg.edit_pkg_fnfno}
                                        onChange={(e)=>{this.handleEditPkgChange(e)}}
                                        />
                                        <label htmlFor = "edit-pkg-fnfno">Number of FNF(max)</label>
                                        </div>
                                        <div><button type="submit" className='btn green pkg-edit-submit'>
                                            Confirm
                                        </button>              
                                        <button className="btn red pkg-edit-submit" onClick = {() => this.deletePkg()}>Delete</button>
                                        <button className="btn blue pkg-edit-submit" onClick = {() => this.closeEditPkgModal()}>Exit</button>
                                        </div>
                                        
                                </form>
                            </Modal>
                        </div>
                        
                    </div>

                    <div className="fnf">
                        <div className="card ">
                            <div className="card-content">
                                <div className="card-title">
                                    FNF
                                </div>
                                {fnfList}
                            </div>
                            <div className = "card-action">
                            <span className="set-fnf"  onClick = {() => this.openSetfnfModal()}>
                                    SET NEW FNF
                                </span>
                            </div>
                        </div>
                        <Modal className="set-fnf-modal" isOpen={this.state.activeModal === 'set-fnf'} ariaHideApp={false}>
                                <div className="set-fnf-title">
                                    Set New FNF                        
                                </div>
                                <form onSubmit={this.handleNewfnfSubmit}>
                                        <div className= "input-field">
                                        <input type = "text" id = "new_fnf_type"
                                        value={this.state.newfnf.new_fnf_type}
                                        onChange={(e)=>{this.handleNewfnfChange(e)}}
                                        />
                                        <label htmlFor = "new-fnf-name">FNF Type</label>
                                        </div>
                                        <div className= "input-field">
                                        <input type = "text" id = "new_fnf_callrate" 
                                        value={this.state.newfnf.new_fnf_callrate}
                                        onChange={(e)=>{this.handleNewfnfChange(e)}}
                                        />
                                        <label htmlFor = "new-fnf-callrate">Call Rate</label>
                                        </div>
                                        <div className= "input-field">
                                        <input type = "text" id = "new_fnf_smsrate" 
                                        value={this.state.newfnf.new_fnf_smsrate}
                                        onChange={(e)=>{this.handleNewfnfChange(e)}}
                                        />
                                        <label htmlFor = "new-fnf-smsrate">SMS Rate</label>
                                        </div>
                                        <div><button type="submit" className='btn green fnf-submit'>
                                            Confirm
                                        </button>              
                                        <button className="btn red" onClick = {() => this.closeSetfnfModal()}>Cancel</button></div>
                                </form>
                            </Modal>
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
                                    <button className = "btn green" onClick = {() => this.openEditfnfModal()}>edit</button>
                                </span>
                        </Modal>
                        <Modal className="set-fnf-modal" isOpen={this.state.activeModal === 'edit-fnf'} ariaHideApp={false}>
                                <div className="set-fnf-title">
                                    {this.state.fnfName}                       
                                </div>
                                <form onSubmit={this.handleEditfnfSubmit}>
                                        <div className= "input-field">
                                        <input type = "text" id = "edit_fnf_callrate" 
                                        value={this.state.editfnf.edit_fnf_callrate}
                                        onChange={(e)=>{this.handleEditfnfChange(e)}}
                                        />
                                        <label htmlFor = "edit-fnf-callrate">Call Rate</label>
                                        </div>
                                        <div className= "input-field">
                                        <input type = "text" id = "edit_fnf_smsrate" 
                                        value={this.state.editfnf.edit_fnf_smsrate}
                                        onChange={(e)=>{this.handleEditfnfChange(e)}}
                                        />
                                        <label htmlFor = "edit-fnf-smsrate">SMS Rate</label>
                                        </div>
                                        <div><button type="submit" className='btn green fnf-edit-submit'>
                                            Confirm
                                        </button>              
                                        <button className="btn red fnf-edit-submit" onClick = {() => this.deletefnf()}>Delete</button>
                                        <button className="btn blue fnf-edit-submit" onClick = {() => this.closeEditfnfModal()}>Exit</button>
                                        </div>
                                        
                                </form>
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
                                    {feedbackList}
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
                                            <input 
                                                type = "text" 
                                                id = "feed-reply" 
                                                style = {({color : "red "})}
                                                value={this.state.feedbackReplyBody}
                                                onChange={(e)=>{this.feedbackReplyChange(e)}}
                                            />
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
                                <span className = "feed-send" 
                                onClick = {() => (this.closeFeedbackModalOpenSentModal())}>
                                    <button 
                                        className="btn green"
                                        disabled={this.disableButton()}
                                        onClick={(e)=>{this.sendReplyOfFeedback(e)}}
                                    >
                                        Send
                                    </button>
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
                               {offerList}
                            </div>
                            <div className = "card-action">
                                <span className="set-offer"  onClick = {() => this.openSetOfferModal()}>
                                    SET NEW OFFER
                                </span>
                            </div>
                            <Modal className="set-offer-modal" isOpen={this.state.activeModal === 'set-offer'} ariaHideApp={false}>
                                <div className="set-offer-title">
                                    Set New Offer                        
                                </div>
                                <form onSubmit={this.handleNewOfferSubmit}>
                                        <div className= "input-field">
                                        <input type = "text" id = "new_offer_ID"
                                        value={this.state.newOffer.new_offer_ID}
                                        onChange={(e)=>{this.handleNewOfferChange(e)}}
                                        />
                                        <label htmlFor = "new-offer-ID">Offer ID</label>
                                        </div>
                                        <div className= "input-field">
                                        <input type = "text" id = "new_offer_money"
                                        value={this.state.newOffer.new_offer_money}
                                        onChange={(e)=>{this.handleNewOfferChange(e)}}
                                        />
                                        <label htmlFor = "new-offer-money">Amount</label>
                                        </div>
                                        <div className= "input-field">
                                        <input type = "text" id = "new_offer_validity"
                                        value={this.state.newOffer.new_offer_validity}
                                        onChange={(e)=>{this.handleNewOfferChange(e)}}
                                        />
                                        <label htmlFor = "new-offer-validity">validity</label>
                                        </div>
                                        <div className= "input-field">
                                        <input type = "text" id = "new_offer_pts"
                                        value={this.state.newOffer.new_offer_pts}
                                        onChange={(e)=>{this.handleNewOfferChange(e)}}
                                        />
                                        <label htmlFor = "new-offer-pts">Points</label>
                                        </div>
                                        <div className= "input-field">
                                        <input type = "text" id = "new_offer_bns_pts"
                                        value={this.state.newOffer.new_offer_bns_pts}
                                        onChange={(e)=>{this.handleNewOfferChange(e)}}
                                        />
                                        <label htmlFor = "new-offer-bns-pts">Bonus Points</label>
                                        </div>
                                        <div className= "input-field">
                                        <input type = "text" id = "new_offer_int"
                                        value={this.state.newOffer.new_offer_int}
                                        onChange={(e)=>{this.handleNewOfferChange(e)}}
                                        />
                                        <label htmlFor = "new-offer-int">Internet Volume</label>
                                        </div>
                                        <div className= "input-field">
                                        <input type = "text" id = "new_offer_bns_int"
                                        value={this.state.newOffer.new_offer_bns_int}
                                        onChange={(e)=>{this.handleNewOfferChange(e)}}
                                        />
                                        <label htmlFor = "new-offer-bns-int">Bonus Internet Volume</label>
                                        </div>
                                        <div className= "input-field">
                                        <input type = "text" id = "new_offer_talktime"
                                        value={this.state.newOffer.new_offer_talktime}
                                        onChange={(e)=>{this.handleNewOfferChange(e)}}
                                        />
                                        <label htmlFor = "new-offer-talktime">Talktime</label>
                                        </div>
                                        <div className= "input-field">
                                        <input type = "text" id = "new_offer_bns_talktime"
                                        value={this.state.newOffer.new_offer_bns_talktime}
                                        onChange={(e)=>{this.handleNewOfferChange(e)}}
                                        />
                                        <label htmlFor = "new-offer-bns-talktime">Bonus Talktime</label>
                                        </div>
                                        <div className= "input-field">
                                        <input type = "text" id = "new_offer_sms"
                                        value={this.state.newOffer.new_offer_sms}
                                        onChange={(e)=>{this.handleNewOfferChange(e)}}
                                        />
                                        <label htmlFor = "new-offer-bns-sms">SMS</label>
                                        </div>
                                        <div className= "input-field">
                                        <input type = "text" id = "new_offer_bns_sms"
                                        value={this.state.newOffer.new_offer_bns_sms}
                                        onChange={(e)=>{this.handleNewOfferChange(e)}}
                                        />
                                        <label htmlFor = "new-offer-bns-sms">Bonus SMS</label>
                                        </div>

                                        <div><button type="submit" className='btn green offer-submit'>
                                            Confirm
                                        </button>              
                                        <button className="btn red" onClick = {() => this.closeSetOfferModal()}>Cancel</button></div>
                                </form>
                            </Modal>
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
                                <button className = "btn green" onClick = {() => this.openEditOfferModal()}>edit</button>
                                </span>
                        </Modal>
                        <Modal className="set-offer-modal" isOpen={this.state.activeModal === 'edit-offer'} ariaHideApp={false}>
                                <div className="set-offer-title">
                                    {this.state.offerID}                       
                                </div>
                                <form onSubmit={this.handleEditOfferSubmit}>
                                <div className= "input-field">
                                        <input type = "text" id = "edited_offer_money"
                                        value={this.state.editedOffer.edited_offer_money}
                                        onChange={(e)=>{this.handleEditOfferChange(e)}}
                                        />
                                        <label htmlFor = "edited-offer-money">Amount</label>
                                        </div>
                                        <div className= "input-field">
                                        <input type = "text" id = "edited_offer_validity"
                                        value={this.state.editedOffer.edited_offer_validity}
                                        onChange={(e)=>{this.handleEditOfferChange(e)}}
                                        />
                                        <label htmlFor = "edited-offer-validity">validity</label>
                                        </div>
                                        <div className= "input-field">
                                        <input type = "text" id = "edited_offer_pts"
                                        value={this.state.editedOffer.edited_offer_pts}
                                        onChange={(e)=>{this.handleEditOfferChange(e)}}
                                        />
                                        <label htmlFor = "edited-offer-pts">Points</label>
                                        </div>
                                        <div className= "input-field">
                                        <input type = "text" id = "edited_offer_bns_pts"
                                        value={this.state.editedOffer.edited_offer_bns_pts}
                                        onChange={(e)=>{this.handleEditOfferChange(e)}}
                                        />
                                        <label htmlFor = "edited-offer-bns-pts">Bonus Points</label>
                                        </div>
                                        <div className= "input-field">
                                        <input type = "text" id = "edited_offer_int"
                                        value={this.state.editedOffer.edited_offer_int}
                                        onChange={(e)=>{this.handleEditOfferChange(e)}}
                                        />
                                        <label htmlFor = "edited-offer-int">Internet Volume</label>
                                        </div>
                                        <div className= "input-field">
                                        <input type = "text" id = "edited_offer_bns_int"
                                        value={this.state.editedOffer.edited_offer_bns_int}
                                        onChange={(e)=>{this.handleEditOfferChange(e)}}
                                        />
                                        <label htmlFor = "edited-offer-bns-int">Bonus Internet Volume</label>
                                        </div>
                                        <div className= "input-field">
                                        <input type = "text" id = "edited_offer_talktime"
                                        value={this.state.editedOffer.edited_offer_talktime}
                                        onChange={(e)=>{this.handleEditOfferChange(e)}}
                                        />
                                        <label htmlFor = "edited-offer-talktime">Talktime</label>
                                        </div>
                                        <div className= "input-field">
                                        <input type = "text" id = "edited_offer_bns_talktime"
                                        value={this.state.editedOffer.edited_offer_bns_talktime}
                                        onChange={(e)=>{this.handleEditOfferChange(e)}}
                                        />
                                        <label htmlFor = "edited-offer-bns-talktime">Bonus Talktime</label>
                                        </div>
                                        <div className= "input-field">
                                        <input type = "text" id = "edited_offer_sms"
                                        value={this.state.editedOffer.edited_offer_sms}
                                        onChange={(e)=>{this.handleEditOfferChange(e)}}
                                        />
                                        <label htmlFor = "edited-offer-bns-sms">SMS</label>
                                        </div>
                                        <div className= "input-field">
                                        <input type = "text" id = "edited_offer_bns_sms"
                                        value={this.state.editedOffer.edited_offer_bns_sms}
                                        onChange={(e)=>{this.handleEditOfferChange(e)}}
                                        />
                                        <label htmlFor = "edited-offer-bns-sms">Bonus SMS</label>
                                        </div>
                                        <div><button type="submit" className='btn green offer-edit-submit'>
                                            Confirm
                                        </button>              
                                        <button className="btn red offer-edit-submit" onClick = {() => this.deleteOffer()}>Delete</button>
                                        <button className="btn blue offer-edit-submit" onClick = {() => this.closeEditOfferModal()}>Exit</button>
                                        </div>
                                        
                                </form>
                            </Modal>
                        <br></br><br></br><br></br>
                    </div>
                    
                </div>
            </div> 
            
        )

        }
             
        
    }
}

const mapStateToProps = (state) => {
    return {
      auth: state.admin.auth,
      adminFeedInfo : state.adminDashboard.adminFeedInfo,
      packageInfo : state.adminDashboard.packageInfo,
      fnfInfo : state.adminDashboard.fnfInfo,
      offerInfo : state.adminDashboard.offerInfo,
      userAuth: state.auth.auth,
      adminFeedbackList: state.adminDashboard.adminFeedbackList
    }
}

const mapDispatchtoProps = (dispatch)=>{
    return{
        retrieveAdminInfo: (adminInfo)=>{
            dispatch(retrieveAdminInfo(adminInfo))
        },
        setNewPackage: (newPkg)=>{
            dispatch(setNewPackage(newPkg))
        },
        editPackage: (editPkg)=>{
            dispatch(editPackage(editPkg))
        },
        deletePackage: (editPkg)=>{
            dispatch(deletePackage(editPkg))
        },
        setNewfnf: (newfnf)=>{
            dispatch(setNewfnf(newfnf))
        },
        editFnf: (editfnf)=>{
            dispatch(editFnf(editfnf))
        },
        deletefnf: (editfnf)=>{
            dispatch(deletefnf(editfnf))
        },
        setNewOffer: (newOffer)=>{
            dispatch(setNewOffer(newOffer))
        },
        editOffer: (editedOffer)=>{
            dispatch(editOffer(editedOffer))
        },
        deleteOffer: (editedOffer)=>{
            dispatch(deleteOffer(editedOffer))
        },
        storeAdminSocketId: (id)=>{
            dispatch(storeAdminSocketId(id))
        },
        receiveAllFeedback: (info)=>{
            dispatch(receiveAllFeedback(info))
        },
        sendReplyOfFeedback: (info)=>{
            dispatch(sendReplyOfFeedback(info))
        }
    }
}


export default connect(mapStateToProps, mapDispatchtoProps)(AdminDashboard)