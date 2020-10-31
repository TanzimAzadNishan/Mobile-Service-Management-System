import React, { Component } from 'react'
import { connect } from 'react-redux'
import {NavLink} from 'react-router-dom'
import NProgress from 'nprogress'
import {
    retrieveAccountInfo, editCurrentPackage, editCurrentFNFPlan
} from '../../store/actions/dashboardActions'
import '../../styles/dashboard/UserDashbaordStyle.css'


class UserDashboard extends Component{
    constructor(props){
        super(props);
        NProgress.start();
        NProgress.configure({ ease: 'ease', speed: 500 });
    }

    componentDidMount(){       
        NProgress.done()
    }
    render() {
        /*const {
            auth, personInfo, accountInfo, profilePic, current_pkg, current_fnf_plan
        } = this.props*/
        return (
            <>
                <div className="dashboard-title">
                    User Dashboard
                </div>                
                <div className="user-dashboard">
                    <div className="user-details-part">
                        <div className="account-icon">
                            <i className="material-icons prefix" 
                            style={{color: "red",fontSize: "75px"}}
                            >
                                account_circle
                            </i>
                        </div>

                        <div className="person-info">
                            <div className="person-name">
                                Md. Tanzim Azad Nishan
                            </div>
                            <div className="person-mob-num">
                                01724729159
                            </div>
                        </div>

                        <div className="right-side">
                            <div className="points-info">
                                <div className="points-header">
                                    Points
                                </div>
                                <div className="points">
                                    1234
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
                                        Default
                                    </div>
                                </div>
                                <div className="details">
                                    <p style={{color: "#FF5733"}}>
                                        Call Rate: {2.34} 
                                    </p>
                                    <p style={{color: "#675923"}}>
                                        SMS Rate: {2.34} 
                                    </p>
                                    <p style={{color: "#007F7A"}}>
                                        FNF Number(Max): {20} 
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
                                        Not Chosen
                                    </div>
                                </div>
                                <div className="details">
                                    <p style={{color: "#FF5733"}}>
                                        Call Rate: Empty 
                                    </p>
                                    <p style={{color: "#675923"}}>
                                        SMS Rate: Empty 
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
                                            {1234} TK
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
                                        {0.00} MB
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
                                        {0}
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
                                        {0}
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
        retrieveAccountInfo: ()=>{
            dispatch(retrieveAccountInfo())
        },
        editCurrentPackage: (pkg)=>{
            dispatch(editCurrentPackage(pkg))
        },
        editCurrentFNFPlan: (fnf)=>{
            dispatch(editCurrentFNFPlan(fnf))
        }
    }
}

export default connect(mapStateToProps, mapDispatchtoProps)(UserDashboard)