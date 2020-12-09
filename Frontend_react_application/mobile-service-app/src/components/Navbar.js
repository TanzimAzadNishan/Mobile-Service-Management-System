import React, { Component } from 'react'
import '../styles/NavbarStyle.css'
import { connect } from 'react-redux'
import {NavLink, withRouter} from 'react-router-dom'
import {logoutFromAccount} from '../store/actions/authActions'
import {adminlogoutFromAccount} from '../store/actions/adminAction'
import { storeSocketId, updateAccountInfo } from '../store/actions/dashboardActions'
import { storeAdminSocketId } from '../store/actions/adminDashboardActions'
import {socket} from '../utilities/SocketIOClient'
import Modal from 'react-modal'
import { receiveNewConnection } from '../store/actions/service/connectionActions'
import { receiveNewFeedback} from '../store/actions/adminDashboardActions'
import { receiveReply } from '../store/actions/service/feedbackAction.js'
import {
    onGoingCall, discardCall, cutCall, waitingCall
} from '../store/actions/service/intcallsmsAction'
import { updateHistoryInfo } from '../store/actions/historyActions'


var intervalId;

class Navbar extends Component{

    state = {
        activeModal: '',
        sender: ''
    }
    componentDidMount(){
        if (this.props.auth != null){
            socket.emit('socket-connection', {userAuth: this.props.auth})
            
            socket.on('store-socket-id', (socketId)=>{
                console.log('socket id: ', socketId)
                this.props.storeSocketId(socketId)
            })
        }
        if(this.props.adminAuth != null){
            socket.emit('admin-socket-connection', {adminAuth: this.props.adminAuth})
            
            socket.on('store-admin-socket-id', (socketId)=>{
                console.log('socket id: ', socketId)
                this.props.storeAdminSocketId(socketId)
            })   
        }
    }

    openModal = (name, sender)=>{
        this.setState({
            activeModal: name,
            sender: sender
        })
    }
    closeModal = ()=>{
        this.setState({
            activeModal: '',
            sender: ''
        })
    }

    socketListener = socket.on('store-socket-id', (socketId)=>{
        console.log('socket id: ', socketId)
        this.props.storeSocketId(socketId)
    })

    receiveNewConn = this.props.receiveNewConnection()

    handleLogout = ()=>{
        this.props.logout()
    }
    handleAdminLogout = ()=>{
        this.props.adminLogout()
    }

    acceptCall = (evt)=>{
        evt.preventDefault();
        this.closeModal()

        var callInfo = {
            sender : this.state.sender,
            receiver: this.props.auth.mobile_number,
            history_id: JSON.parse(localStorage.getItem('lastTalktimeId'))
        }
        this.props.onGoingCall(callInfo)

        /*intervalId = setInterval(()=>{
            this.props.onGoingCall(callInfo)
        }, 5000)*/
    }

    rejectCall = (evt)=>{
        evt.preventDefault();
        this.closeModal()

        var callInfo = {
            sender : this.state.sender,
            receiver: this.props.auth.mobile_number,
            history_id: JSON.parse(localStorage.getItem('lastTalktimeId'))
        }
        console.log('rejecting... : ', callInfo)
        this.props.discardCall(callInfo)
        localStorage.setItem('inacall', 'false')
    }
    cutCall = (evt)=>{
        evt.preventDefault();
        var callInfo = {
            user1 : this.state.sender,
            user2: this.props.auth.mobile_number,
            history_id: JSON.parse(localStorage.getItem('lastTalktimeId'))
        }
        this.props.onGoingCall(callInfo)
        this.props.cutCall(callInfo)
        this.closeModal()
        clearInterval(intervalId)
    }

    render() {
        //const userAuth = localStorage.getItem('userAccount')
        //const userAuthData = userAuth ? JSON.parse(userAuth) : null
        this.props.receiveNewFeedback()
        socket.on('receive-admin-reply', (res)=>{
            this.props.receiveReply(res.feedbackInfo)
        })
        socket.on('transfer-new-recharge', (res)=>{
            //localStorage.setItem('accountInfo', JSON.stringify(res.accountBalance))
            this.props.updateAccountInfo(res.accountBalance)
        })
        socket.on('send-updated-history', (res)=>{
            //localStorage.setItem('historyInfo', JSON.stringify(res.historyInfo))
            this.props.updateHistoryInfo(res.historyInfo)
        })
        socket.on('updated-account-balance', (res)=>{
            //localStorage.setItem('accountInfo', JSON.stringify(res.accountInfo))
            this.props.updateAccountInfo(res.accountInfo)
        })
        socket.on('someone-calling', (res)=>{
            localStorage.setItem('lastTalktimeId', JSON.stringify(res.lastTalktimeId))
            
            if(localStorage.getItem('inacall') === null || 
                localStorage.getItem('inacall') === 'false'){

                localStorage.setItem('inacall', 'true')
                this.openModal('socket-call-modal', res.sender)
            }

            else{
                console.log('you are in a call')
                /*var waitingcallInfo = {
                    user1 : res.sender,
                    user2: this.props.auth.mobile_number,
                    history_id: res.lastTalktimeId
                }
                //socket.emit('waiting-call', {waitingInfo: waitingcallInfo})
                this.props.waitingCall(waitingcallInfo)*/
            }
        })
        socket.on('show-cut-call', (res)=>{
            this.openModal('cut-call-modal', res.caller)
        })
        socket.on('remove-cut-call', (res)=>{
            this.closeModal()
            clearInterval(intervalId)
            localStorage.setItem('inacall', 'false')
        })
        socket.on('call-is-rejected', (res)=>{
            localStorage.setItem('inacall', 'false')
        })
        /*socket.on('receiver-is-engaged', (res)=>{
            console.log('receiver is engaged')
            localStorage.setItem('inacall', 'false')
        })*/

        const links = (this.props.auth) ? (
            <>
                <li>
                    <NavLink to="/connect" className="itemStyle"> Connect </NavLink>
                </li>
                <li>
                    <NavLink to="/dashboard" className="itemStyle"> Dashboard </NavLink>
                </li>
                <li>
                    <NavLink to="/" onClick={this.handleLogout}
                             className="itemStyle"
                    >
                         Logout 
                    </NavLink>
                </li> 
            </>            
        ) : 
        (this.props.adminAuth == null) ?
            (
                <>
                    <li>
                        <NavLink to="/signup" className="itemStyle"> Signup </NavLink>
                    </li>
                    <li>
                        <NavLink to="/login" className="itemStyle"> Login </NavLink>
                    </li>  
                </>            
            ) : (
                <>
                    <li>
                        <NavLink to="/admin/dashboard" className="itemStyle"> Admin Dashboard </NavLink>
                    </li>
                    <li>
                        <NavLink to="/" onClick={this.handleAdminLogout}
                                className="itemStyle"
                        >
                            Logout 
                        </NavLink>
                    </li> 
                </>
            )

        const userAuthLink = (this.props.auth) ? (
            <>
                <li>
                    <NavLink to="/recharge" className="itemStyle"> Recharge </NavLink>
                </li>
                <li>
                    <NavLink to="/feedback" className="itemStyle"> Feedback </NavLink>
                </li>
                <li>
                    <NavLink to="/history" className="itemStyle"> My History </NavLink>
                </li>
            </>
        ) : null

        return (
            <>
            <nav className="nav-wrapper white darken-4">
                <div className="container">
                    <ul className="left">
                        <li>
                            <NavLink to="/" className="itemStyle"> Home </NavLink>
                        </li>
                        <li>
                            <NavLink to="/about" className="itemStyle"> About </NavLink>
                        </li>
                    </ul>

                    <ul className="right">
                        {links}
                    </ul>
                </div>
            </nav>

            <nav className="nav-wrapper white darken-4 bottom-navbar">
                <div className="container">
                    <ul className="left">
                        <li>
                            <NavLink to="/offers" className="itemStyle"> Offers </NavLink>
                        </li>
                        <li>
                            <NavLink to="/package" className="itemStyle"> Package </NavLink>
                        </li>
                        <li>
                            <NavLink to="/flexiplan" className="itemStyle"> Flexiplan </NavLink>
                        </li>
                        <li>
                            <NavLink to="/fnf" className="itemStyle"> FNF </NavLink>
                        </li>

                        {userAuthLink}
                    </ul>
                </div>
            </nav>
            
            <Modal
                    className = "socket-call-modal"
                    isOpen={this.state.activeModal === 'socket-call-modal'} 
                    ariaHideApp={false} 
                >
                    
                    <div className="modal-title">
                        {this.state.sender} is calling you
                    </div>

                    <div className="btn-part">

                        <button 
                            className ='btn-small accept-btn'
                            onClick={(e)=>{this.acceptCall(e)}}
                        >
                            Accept
                        </button>

                        <button 
                        className ='btn-small exit-btn' 
                        onClick={(e)=>{this.rejectCall(e)}}
                        >
                            Reject
                        </button>
                    </div>
            </Modal>

            <Modal
                    className = "cut-call-modal"
                    isOpen={this.state.activeModal === 'cut-call-modal'} 
                    ariaHideApp={false} 
                >
                    
                    <div className="modal-title">
                        You are in a call
                    </div>

                    <div className="btn-part">
                        <button 
                            className ='btn-small exit-btn' 
                            onClick={(e)=>{this.cutCall(e)}}
                        >
                            Cut
                        </button>
                    </div>
            </Modal>

            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
      auth: state.auth.auth,
      adminAuth: state.admin.auth,
      lastTalktimeId: state.intcallsms.lastTalktimeId
    }
}
const mapDispatchtoProps = (dispatch)=>{
    return{
        logout: ()=>{
            dispatch(logoutFromAccount())
        },
        storeSocketId: (id)=>{
            dispatch(storeSocketId(id))
        },
        receiveNewConnection: ()=>{
            dispatch(receiveNewConnection())
        },
        adminLogout: ()=>{
            dispatch(adminlogoutFromAccount())
        },
        storeAdminSocketId: (id)=>{
            dispatch(storeAdminSocketId(id))
        },
        receiveNewFeedback: ()=>{
            dispatch(receiveNewFeedback())
        },
        receiveReply: (info)=>{
            dispatch(receiveReply(info))
        },
        onGoingCall: (info)=>{
            dispatch(onGoingCall(info))
        },
        discardCall: (info)=>{
            dispatch(discardCall(info))
        },
        cutCall: (info)=>{
            dispatch(cutCall(info))
        },
        updateAccountInfo: (info)=>{
            dispatch(updateAccountInfo(info))
        },
        updateHistoryInfo: (info)=>{
            dispatch(updateHistoryInfo(info))
        },
        waitingCall: (info)=>{
            dispatch(waitingCall(info))
        }
    }
}

export default connect(mapStateToProps, mapDispatchtoProps)(withRouter(Navbar))