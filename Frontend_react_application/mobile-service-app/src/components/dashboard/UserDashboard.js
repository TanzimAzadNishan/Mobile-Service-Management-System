import React, { Component } from 'react'
import { connect } from 'react-redux'
import {Redirect, NavLink} from 'react-router-dom'
import NProgress from 'nprogress'


class UserDashboard extends Component{
    constructor(props){
        super(props);
        NProgress.start();
        NProgress.configure({ ease: 'ease', speed: 500 });
    }

    componentDidMount(){
        
        NProgress.done()
    }
}