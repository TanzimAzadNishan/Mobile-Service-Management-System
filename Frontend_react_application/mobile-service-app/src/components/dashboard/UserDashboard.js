import React, { Component } from 'react'
import { connect } from 'react-redux'
import {NavLink, Redirect} from 'react-router-dom'
import NProgress from 'nprogress'
import { retrieveAccountInfo,storeSocketId } from '../../store/actions/dashboardActions'
import '../../styles/dashboard/UserDashbaordStyle.css'
import {socket} from '../../utilities/SocketIOClient'
import Modal from 'react-modal'
import {
    validateMobileNumber
} from '../../utilities/Validators/RechargeValidator.js'
import { 
    addPersonFNF, deletePersonFNF, getPersonFNF
} from '../../store/actions/service/personFNFAction'
import { 
    sendSMS, startSession, updateSession, startCall, onGoingCall, clearError
} from '../../store/actions/service/intcallsmsAction'


//var intervalId;

class UserDashboard extends Component{
    constructor(props){
        super(props);
        NProgress.start();
        NProgress.configure({ ease: 'ease', speed: 500 });

        this.state = {
            Mobile_Number: {
                value: '',
                error: ''
            },
            activeModal: '',
            turnOnOff: false
        }
        this.openModal = this.openModal.bind(this)
        this.closeModal = this.closeModal.bind(this)
    }

    openModal = (name)=>{
        this.setState({
            activeModal: name
        })
    }
    closeModal = ()=>{
        this.setState({
            Mobile_Number: {
                value: '',
                error: ''
            },
            activeModal: ''
        })
    }

    componentDidMount(){  
        console.log('before mounting ', this.props.auth)
        if (this.props.auth != null){
            var fnflistinfo = {
                sender: this.props.auth.mobile_number
            }
            localStorage.setItem('inacall', 'false')
            localStorage.setItem('turnOnOff', 'false')
            this.props.getPersonFNF(fnflistinfo)
            
            socket.emit('socket-connection', {userAuth: this.props.auth})
            
            socket.on('store-socket-id', (socketId)=>{
                console.log('socket id: ', socketId)
                this.props.storeSocketId(socketId)
            })
            this.props.retrieveAccountInfo(this.props.auth)
        }
    }

    handleMobNumChange = (evt)=>{
        var fieldval = evt.target.value

        this.setState({
            Mobile_Number: {
                value: fieldval,
                error: ''
            }
        })
    }

    addFNF = (evt)=>{
        evt.preventDefault();
        const { Mobile_Number } = this.state;
        var mobErr = validateMobileNumber(Mobile_Number.value)

        if(this.props.auth.mobile_number === this.state.Mobile_Number.value){
            mobErr = 'This is your mobile number!'
        }

        if ([mobErr].every(e => e === false)){
            console.log('add fnf form submitted successfully')

            var addInfo = {
                sender: this.props.auth.mobile_number,
                receiver: Mobile_Number.value
            }
            this.props.addPersonFNF(addInfo)
            console.log(addInfo)
            this.setState(state => ({
                Mobile_Number: {
                    value: '',
                    error: ''
                },
                activeModal: 'add-fnf-modal',
                turnOnOff: false
            }))
        }

        else{
            console.log(mobErr)
            this.setState(state => ({
                Mobile_Number: {
                    value: '',
                    error: mobErr
                },
                activeModal: 'add-fnf-modal',
                turnOnOff: false
            }))
        }
    }
    deleteFNF = (evt, receiver)=>{
        var deleteInfo = {
            sender: this.props.auth.mobile_number,
            receiver: receiver
        }
        this.props.deletePersonFNF(deleteInfo) 
    }

    sendSMS = (evt)=>{
        evt.preventDefault();
        const { Mobile_Number } = this.state;
        var mobErr = validateMobileNumber(Mobile_Number.value)

        if(this.props.auth.mobile_number === this.state.Mobile_Number.value){
            mobErr = 'This is your mobile number!'
        }

        if ([mobErr].every(e => e === false)){
            console.log('sms form submitted successfully')

            var smsInfo = {
                sender: this.props.auth.mobile_number,
                receiver: Mobile_Number.value
            }
            this.props.sendSMS(smsInfo)
            //this.props.retrieveAccountInfo(this.props.auth)

            console.log(smsInfo)
            this.setState(state => ({
                Mobile_Number: {
                    value: '',
                    error: ''
                },
                activeModal: 'send-sms-modal',
                turnOnOff: false
            }))
        }

        else{
            console.log(mobErr)
            this.setState(state => ({
                Mobile_Number: {
                    value: '',
                    error: mobErr
                },
                activeModal: 'send-sms-modal',
                turnOnOff: false
            }))
        }
    }

    handleTurnOnOff = (evt)=>{

        evt.preventDefault();
        if(localStorage.getItem('turnOnOff') != null && 
        localStorage.getItem('turnOnOff') === 'true'){
            //clearInterval(intervalId)

            var intInfo = {
                sender: this.props.auth.mobile_number,
                history_id: this.props.lastSessionHistoryId
            }
            this.props.updateSession(intInfo)

            console.log('update session called')
            localStorage.setItem('turnOnOff', 'false')

            this.setState({
                turnOnOff: false
            })
        }
        else{
            console.log('start session called')
            localStorage.setItem('turnOnOff', 'true')
            this.setState({
                turnOnOff: true
            })

            var sessionInfo = {
                sender: this.props.auth.mobile_number
            }
            this.props.startSession(sessionInfo)
            /*var intInfo = {
                sender: this.props.auth.mobile_number,
                history_id: this.props.lastSessionHistoryId
            }*/

            /*intervalId =  setInterval(()=>{
                var intInfo = {
                    sender: this.props.auth.mobile_number,
                    history_id: this.props.lastSessionHistoryId
                }
                console.log('session update: ', intInfo)
                if(this.props.intcallsmsError != null){
                    clearInterval(intervalId)
                    console.log('interval cleared')
                    localStorage.setItem('turnOnOff', 'false')
                    this.setState({
                        turnOnOff: false
                    })
                    this.props.clearError()
                }
                else{
                    this.props.updateSession(intInfo)
                }
            }, 5000)*/
        }
        //this.closeModal()
    }

    startCall = (evt)=>{
        evt.preventDefault();
        console.log('call button clicked...........')
        const { Mobile_Number } = this.state;
        var mobErr = validateMobileNumber(Mobile_Number.value)

        if(this.props.auth.mobile_number === this.state.Mobile_Number.value){
            mobErr = 'This is your mobile number!'
        }

        if(localStorage.getItem('inacall') === null || 
            localStorage.getItem('inacall') === 'false'){

        console.log('call is allowed !')
        if ([mobErr].every(e => e === false)){
            console.log('call form submitted successfully')

            var callInfo = {
                sender: this.props.auth.mobile_number,
                receiver: Mobile_Number.value
            }
            this.props.startCall(callInfo)
            localStorage.setItem('inacall', 'true')

            console.log(callInfo)
            this.setState(state => ({
                Mobile_Number: {
                    value: '',
                    error: ''
                },
                activeModal: '',
                turnOnOff: false
            }))
        }

        else{
            console.log(mobErr)
            this.setState(state => ({
                Mobile_Number: {
                    value: '',
                    error: mobErr
                },
                activeModal: 'call-modal',
                turnOnOff: false
            }))
        }
        }
    }

    render() {
        const {
            auth, current_pkg, current_fnf_plan, profilePic
        } = this.props

        if (this.props.auth == null){
            console.log('redirected')
            return <Redirect to='/' />
        } 

        else if(auth == null || this.props.accountInfo == null || current_pkg == null){
            return(
                <>
                </>
            )
        }

        
        else{
            NProgress.done()
            /*if(this.props.intcallsmsError != null){
                this.openModal('call-modal')
            }*/

            const proPic = (profilePic) ? (
                <img className="profile-pic" 
                    src={`http://localhost:4000/${profilePic}`} alt="user chosen"
                />
            ) : (
                <i className="material-icons prefix" 
                style={{color: "red",fontSize: "120px"}}
                >
                    account_circle
                </i>
            )

            var personfnflist = null
            if(this.props.personFNFList != null && this.props.personFNFList.length > 0){
                personfnflist = this.props.personFNFList.map((item, index)=>{
                    return(
                        <div 
                            className="single-item"
                            key={index}
                        >
                            <div className="mob-num">
                                {item.RECEIVER}
                            </div>
                            <div className="name">
                                ({item.NAME})
                            </div>
    
                            <button
                                className="btn-small delete-btn"
                                onClick={(e)=>{this.deleteFNF(e, item.RECEIVER)}}
                            >
                                Delete
                            </button>
                        </div>
                    )
                })
            }
            else{
                personfnflist = (
                    <div className="no-fnf">
                        You have not added any FNF
                    </div>
                )
            }

            const addshowfnf = (current_fnf_plan != null) ? (
                <div className="card-action">
                    <button 
                        className="add-fnf"
                        onClick={(e)=>{this.openModal('add-fnf-modal')}}
                    >
                        Add FNF
                    </button>

                    <button
                        className="show-fnf"
                        onClick={(e)=>{this.openModal('show-fnf-modal')}}
                    >
                        FNF List
                    </button>
                </div>
            ) : null

            const rechargeValidity = (
                <>
                    <p className="remainder">
                        Valid Till
                    </p>
                    <p className="remainder">
                        {this.props.validityDate ? (
                            this.props.validityDate
                        ) : (
                            this.props.accountInfo ? (
                                this.props.accountInfo.VALIDITY_DATE
                            ) : (
                                null
                            )
                        )}
                    </p>
                </>
            )

        return (
            <>
                <div className="dashboard-title">
                    User Dashboard
                </div>

                <div className="three-btn">
                    <span 
                        className="material-icons sms-btn"
                        onClick={(e)=>{this.openModal('send-sms-modal')}}
                    >
                        sms
                    </span>
                    <span 
                        className="material-icons call-btn"
                        onClick={(e)=>{this.openModal('call-modal')}}
                    >
                        local_phone
                    </span>
                    <span 
                        className="material-icons int-btn"
                        onClick={(e)=>{this.openModal('internet-modal')}}
                        style={(localStorage.getItem('turnOnOff') != null && 
                            localStorage.getItem('turnOnOff') === 'true')
                            ? ({color: "green"}): (null)
                        }
                    >
                        network_wifi
                    </span>
                </div>

                <Modal
                    className = "send-sms-modal"
                    isOpen={this.state.activeModal === 'send-sms-modal'} 
                    ariaHideApp={false} 
                >
                    
                    <div className="modal-title">
                        SMS
                    </div>

                    <div className="input-field">

                        <i 
                            className="material-icons prefix"
                            style={this.state.Mobile_Number.error ? ({color: "red"}):(null)}  
                        >
                            settings_cell
                        </i>
                        <input type="text"
                            className="validate"
                            style={this.state.Mobile_Number.error ? ({color: "red"}):(null)}
                            value={this.state.Mobile_Number.value}
                            onChange={(e)=>{this.handleMobNumChange(e)}}  
                        />

                        <label 
                            htmlFor="mobile_number"
                            style={this.state.Mobile_Number.error ? ({color: "red"}):(null)}  
                        > 
                            Mobile Number
                        </label>

                        <div style={{color: "red"}}>
                            {this.state.Mobile_Number.error}
                        </div>
                        <div style={{color: "red"}}>
                            {this.props.intcallsmsError}
                        </div>
                    </div>

                    <div className="btn-part">

                        <button 
                            className ='btn-small send-sms-btn' 
                            onClick={(e)=>{this.sendSMS(e)}}
                        >
                            Send
                        </button>

                        <button 
                        className ='btn-small exit-btn' 
                        onClick={this.closeModal}
                        >
                            Exit
                        </button>
                    </div>
                </Modal>

                <Modal
                    className = "internet-modal"
                    isOpen={this.state.activeModal === 'internet-modal'} 
                    ariaHideApp={false} 
                >
                    
                    <div className="modal-title">
                        Internet
                    </div>
                    
                    <div style={{color: "red"}}>
                            {this.props.intcallsmsError}
                    </div>

                    <div className="btn-part">

                        <button 
                            className ='btn-small turn-btn' 
                            onClick={(e)=>{this.handleTurnOnOff(e)}}
                        >
                            {(localStorage.getItem('turnOnOff') != null && 
                            localStorage.getItem('turnOnOff') === 'true') 
                            ? `Turn Off` : `Turn On`}
                        </button>

                        <button 
                        className ='btn-small exit-btn' 
                        onClick={this.closeModal}
                        >
                            Exit
                        </button>
                    </div>
                </Modal>

                <Modal
                    className = "call-modal"
                    isOpen={this.state.activeModal === 'call-modal'} 
                    ariaHideApp={false} 
                >
                    
                    <div className="modal-title">
                        Call
                    </div>

                    <div className="input-field">

                        <i 
                            className="material-icons prefix"
                            style={this.state.Mobile_Number.error ? ({color: "red"}):(null)}  
                        >
                            settings_cell
                        </i>
                        <input type="text"
                            className="validate"
                            style={this.state.Mobile_Number.error ? ({color: "red"}):(null)}
                            value={this.state.Mobile_Number.value}
                            onChange={(e)=>{this.handleMobNumChange(e)}}  
                        />

                        <label 
                            htmlFor="mobile_number"
                            style={this.state.Mobile_Number.error ? ({color: "red"}):(null)}  
                        > 
                            Mobile Number
                        </label>

                        <div style={{color: "red"}}>
                            {this.state.Mobile_Number.error}
                        </div>
                        <div style={{color: "red"}}>
                            {this.props.intcallsmsError}
                        </div>
                    </div>

                    <div className="btn-part">

                        <button 
                            className ='btn-small call-btn' 
                            onClick={(e)=>{this.startCall(e)}}
                        >
                            Call
                        </button>

                        <button 
                        className ='btn-small exit-btn' 
                        onClick={this.closeModal}
                        >
                            Exit
                        </button>
                    </div>
                </Modal>

                <div className="user-dashboard">
                    <div className="user-details-part">
                        <div className="account-icon">
                            {proPic}
                        </div>

                        <div className="person-info">
                            <div className="person-name">
                                {auth.name}
                            </div>
                            <div className="person-mob-num">
                                {auth.mobile_number}
                            </div>
                        </div>

                        <div className="right-side">
                            <div className="points-info">
                                <div className="points-header">
                                    Points
                                </div>
                                <div className="points">
                                    {this.props.accountInfo.POINTS}
                                </div>
                            </div>

                            <NavLink to="/dashboard/edit" className="edit-info">
                                Edit Info
                            </NavLink>
                        </div>
                    </div>

                    <div className="pkg-part">
                        <div className="card">
                            <div className="card-content">
                                <div className="card-title">
                                    Current Package
                                    <div className="card-subtitle">
                                        {current_pkg.PKG_NAME}
                                    </div>
                                </div>
                                <div className="details">
                                    <p style={{color: "#FF5733"}}>
                                        Call Rate: {current_pkg.CALL_RATE} 
                                    </p>
                                    <p style={{color: "#675923"}}>
                                        SMS Rate: {current_pkg.SMS_RATE} 
                                    </p>
                                    <p style={{color: "#007F7A"}}>
                                        FNF Number(Max): {current_pkg.FNF_NUM} 
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="fnf-part">
                        <div className="card">
                            <div className="card-content">
                                <div className="card-title">
                                    Current FNF Plan
                                    <div className="card-subtitle">
                                        {current_fnf_plan ? (current_fnf_plan.FNF_TYPE)
                                        : 'Not Chosen'}
                                    </div>
                                </div>
                                <div className="details">
                                    <p style={{color: "#FF5733"}}>
                                        Call Rate: 
                                        {current_fnf_plan ? (current_fnf_plan.CALL_RATE)
                                        : 'Empty'} 
                                    </p>
                                    <p style={{color: "#675923"}}>
                                        SMS Rate:
                                        {current_fnf_plan ? (current_fnf_plan.SMS_RATE)
                                        : 'Empty'} 
                                    </p>
                                </div>

                                {addshowfnf}
                            </div>
                        </div>
                    
                    <Modal
                        className = "add-fnf-modal"
                        isOpen={this.state.activeModal === 'add-fnf-modal'} 
                        ariaHideApp={false} 
                    >
                    
                        <div className="modal-title">
                            Add New FNF
                        </div>

                        <div className="input-field">

                            <i 
                                className="material-icons prefix"
                                style={this.state.Mobile_Number.error ? ({color: "red"}):(null)}  
                            >
                                settings_cell
                            </i>
                            <input type="text"
                                className="validate"
                                style={this.state.Mobile_Number.error ? ({color: "red"}):(null)}
                                value={this.state.Mobile_Number.value}
                                onChange={(e)=>{this.handleMobNumChange(e)}}  
                            />

                            <label 
                                htmlFor="mobile_number"
                                style={this.state.Mobile_Number.error ? ({color: "red"}):(null)}  
                            > 
                                Mobile Number
                            </label>

                            <div style={{color: "red"}}>
                                {this.state.Mobile_Number.error}
                            </div>
                            <div style={{color: "red"}}>
                                {this.props.personFNFError}
                            </div>
                        </div>

                        <div className="btn-part">

                            <button 
                                className ='btn-small add-btn' 
                                onClick={(e)=>{this.addFNF(e)}}
                            >
                                Add
                            </button>

                            <button 
                            className ='btn-small exit-btn' 
                            onClick={this.closeModal}
                        >
                            Exit
                        </button>
                        </div>
                    </Modal>

                    <Modal
                        className = "show-fnf-modal"
                        isOpen={this.state.activeModal === 'show-fnf-modal'} 
                        ariaHideApp={false} 
                    >
                    
                        <div className="modal-title">
                            Your FNF List
                        </div>
                        
                        <div className="fnf-list">
                            {personfnflist}
                        </div>

                        <br/>
                        <br/>
                        <div className="fnf-num-reminder">
                                You can add another {
                                    (this.props.personFNFList) ? 
                                    this.props.current_pkg.FNF_NUM - this.props.personFNFList.length
                                    : this.props.current_pkg.FNF_NUM
                                } numbers to fnf list
                        </div>

                        <div className="btn-part">
                            <button 
                                className ='btn-small exit-btn' 
                                onClick={this.closeModal}
                            >
                                Exit
                            </button>
                        </div>
                    </Modal>
                    
                    </div>

                </div>

                <div className="summary">

                    <div className="balance-part">
                        <div className="balance-title">
                            Account Summary
                        </div>

                        <div className="card">
                            <div className="card-content">
                                <div className="red-circle">
                                    <div className="balance-details">
                                        <p className="header">
                                            Current Balance
                                        </p>

                                        <p className="amount">
                                            {(this.props.accountInfo.ACCOUNT_BALANCE).toFixed(2)} TK
                                        </p>

                                        {rechargeValidity}

                                    </div>
                                </div>

                                <div className="balance-actions">
                                    <NavLink to="/recharge" className="recharge">
                                        Recharge
                                    </NavLink>
                                    {/*
                                    <NavLink to="/dashboard/details" className="details">
                                        Details
                                    </NavLink>
                                     */}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="internet-part">
                        <div className="internet-title">
                            Internet
                        </div>

                        <div className="card">
                            <div className="card-content">
                                <div className="internet-circle">
                                </div>

                                <div className="internet-details">
                                    <p className="header">
                                        Internet Balance
                                    </p>

                                    <p className="amount">
                                        {(this.props.accountInfo.INTERNET_BALANCE).toFixed(2)} MB
                                    </p>
                                    <p className="remainder">
                                     
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="talktime-part">
                        <div className="talktime-title">
                            Talktime
                        </div>

                        <div className="card">
                            <div className="card-content">
                                <div className="talktime-circle">
                                </div>

                                <div className="talktime-details">
                                    <p className="header">
                                        Minutes
                                    </p>

                                    <p className="amount">
                                        {this.props.accountInfo.TALKTIME.toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="sms-part">
                        <div className="sms-title">
                            SMS
                        </div>

                        <div className="card">
                            <div className="card-content">
                                <div className="sms-circle">
                                </div>

                                <div className="sms-details">
                                    <p className="header">
                                        SMS
                                    </p>

                                    <p className="amount">
                                        {this.props.accountInfo.SMS_BALANCE}
                                    </p>
                                </div>
                            </div>
                        </div>
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
        personInfo: state.dashboard.personInfo,
        accountInfo: state.dashboard.accountInfo,
        profilePic: state.dashboard.profilePic,
        current_pkg: state.dashboard.current_pkg,
        current_fnf_plan: state.dashboard.current_fnf_plan,
        personFNFList: state.personFNF.personFNFList,
        personFNFError: state.personFNF.personFNFError,
        lastSessionHistoryId: state.intcallsms.lastSessionHistoryId,
        intcallsmsError: state.intcallsms.intcallsmsError,
        validityDate: state.dashboard.validityDate
    }
}

const mapDispatchtoProps = (dispatch)=>{
    return{
        retrieveAccountInfo: (personInfo)=>{
            dispatch(retrieveAccountInfo(personInfo))
        },
        storeSocketId: (id)=>{
            dispatch(storeSocketId(id))
        },
        addPersonFNF: (info)=>{
            dispatch(addPersonFNF(info))
        },
        deletePersonFNF: (info)=>{
            dispatch(deletePersonFNF(info))
        },
        getPersonFNF: (info)=>{
            dispatch(getPersonFNF(info))
        },
        sendSMS: (info)=>{
            dispatch(sendSMS(info))
        },
        startSession: (info)=>{
            dispatch(startSession(info))
        },
        updateSession: (info)=>{
            dispatch(updateSession(info))
        },
        startCall: (info)=>{
            dispatch(startCall(info))
        },
        onGoingCall: (info)=>{
            dispatch(onGoingCall(info))
        },
        clearError: ()=>{
            dispatch(clearError())
        }
    }
}

export default connect(mapStateToProps, mapDispatchtoProps)(UserDashboard)