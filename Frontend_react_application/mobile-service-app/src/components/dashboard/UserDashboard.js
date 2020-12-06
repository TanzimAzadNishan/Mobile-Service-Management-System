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
            activeModal: ''
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
                activeModal: 'add-fnf-modal'
            }))
        }

        else{
            console.log(mobErr)
            this.setState(state => ({
                Mobile_Number: {
                    value: '',
                    error: mobErr
                },
                activeModal: 'add-fnf-modal'
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

    render() {
        const {
            auth, accountInfo, current_pkg, current_fnf_plan, profilePic
        } = this.props

        if (this.props.auth == null){
            console.log('redirected')
            return <Redirect to='/' />
        } 

        else if(auth == null || accountInfo == null || current_pkg == null){
            return(
                <>
                </>
            )
        }

        
        else{
            NProgress.done()

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


        return (
            <>
                <div className="dashboard-title">
                    User Dashboard
                </div>                
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
                                    {accountInfo.POINTS}
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
                                            {accountInfo.ACCOUNT_BALANCE} TK
                                        </p>
                                        <p className="remainder">
                                            Valid Till
                                        </p>
                                        <p className="remainder">
                                            Thursday, January 9, 2020
                                        </p>
                                    </div>
                                </div>

                                <div className="balance-actions">
                                    <NavLink to="/recharge" className="recharge">
                                        Recharge
                                    </NavLink>
                                    <NavLink to="/dashboard/details" className="details">
                                        Details
                                    </NavLink>
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
                                        {accountInfo.INTERNET_BALANCE} MB
                                    </p>
                                    <p className="remainder">
                                        of {accountInfo.INTERNET_BALANCE} MB remaining
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
                                        {accountInfo.TALKTIME}
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
                                        {accountInfo.SMS_BALANCE}
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
        personFNFError: state.personFNF.personFNFError
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
        }
    }
}

export default connect(mapStateToProps, mapDispatchtoProps)(UserDashboard)