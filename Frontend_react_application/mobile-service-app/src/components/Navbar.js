import React, { Component } from 'react'
import '../styles/NavbarStyle.css'
import { connect } from 'react-redux'
import {NavLink, withRouter} from 'react-router-dom'
import {logoutFromAccount} from '../store/actions/authActions'

class Navbar extends Component{
    handleLogout = ()=>{
        this.props.logout()
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
        ) : (
            <>
                <li>
                    <NavLink to="/signup" className="itemStyle"> Signup </NavLink>
                </li>
                <li>
                    <NavLink to="/login" className="itemStyle"> Login </NavLink>
                </li>  
            </>            
        )

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
                        <li>
                            <NavLink to="/recharge" className="itemStyle"> Recharge </NavLink>
                        </li>
                        <li>
                            <NavLink to="/connect" className="itemStyle"> Connect </NavLink>
                        </li>
                        <li>
                            <NavLink to="/history" className="itemStyle"> My History </NavLink>
                        </li>
                    
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
    }
}
const mapDispatchtoProps = (dispatch)=>{
    return{
        logout: ()=>{
            dispatch(logoutFromAccount())
        }
    }
}

export default connect(mapStateToProps, mapDispatchtoProps)(withRouter(Navbar))