import React, { Component } from 'react'
import { connect } from 'react-redux'
import {NavLink, Redirect} from 'react-router-dom'
import NProgress from 'nprogress'
import { retrieveAccountInfo,storeSocketId } from '../../store/actions/dashboardActions'
import '../../styles/dashboard/UserDashbaordStyle.css'
import {socket} from '../../utilities/SocketIOClient'


class UserDashboard extends Component{
    constructor(props){
        super(props);
        NProgress.start();
        NProgress.configure({ ease: 'ease', speed: 500 });
    }

    componentDidMount(){  
        console.log('before mounting ', this.props.auth)
        if (this.props.auth != null){
            socket.emit('socket-connection', {userAuth: this.props.auth})
            
            socket.on('store-socket-id', (socketId)=>{
                console.log('socket id: ', socketId)
                this.props.storeSocketId(socketId)
            })
            this.props.retrieveAccountInfo(this.props.auth)
        }
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
                            </div>
                        </div>
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
                                        of 0.00 MB remaining
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
    }
}

const mapDispatchtoProps = (dispatch)=>{
    return{
        retrieveAccountInfo: (personInfo)=>{
            dispatch(retrieveAccountInfo(personInfo))
        },
        storeSocketId: (id)=>{
            dispatch(storeSocketId(id))
        }
    }
}

export default connect(mapStateToProps, mapDispatchtoProps)(UserDashboard)