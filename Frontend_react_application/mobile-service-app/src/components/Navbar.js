import React, { Component } from 'react'
import '../styles/NavbarStyle.css'
import { connect } from 'react-redux'
import {NavLink, withRouter} from 'react-router-dom'
import {logoutFromAccount} from '../store/actions/authActions'
import {adminlogoutFromAccount} from '../store/actions/adminAction'
import { storeSocketId } from '../store/actions/dashboardActions'
import {socket} from '../utilities/SocketIOClient'
import {
    receiveNewConnection
} from '../store/actions/service/connectionActions'

class Navbar extends Component{

    componentDidMount(){
        if (this.props.auth != null){
            socket.emit('socket-connection', {userAuth: this.props.auth})
            
            socket.on('store-socket-id', (socketId)=>{
                console.log('socket id: ', socketId)
                this.props.storeSocketId(socketId)
            })
        }
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

    render() {
        //const userAuth = localStorage.getItem('userAccount')
        //const userAuthData = userAuth ? JSON.parse(userAuth) : null
        const links = (this.props.auth) ? (
            <>
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
                    <NavLink to="/connect" className="itemStyle"> Connect </NavLink>
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
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
      auth: state.auth.auth,
      adminAuth: state.admin.auth
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
        }
    }
}

export default connect(mapStateToProps, mapDispatchtoProps)(withRouter(Navbar))