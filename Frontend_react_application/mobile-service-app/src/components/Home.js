import React, { Component } from 'react'
import NProgress from 'nprogress'
import topImg from '../images/home1.jpg'
import pkgimage from '../images/home4.jpg'
import {NavLink} from 'react-router-dom'
import '../styles/HomeStyle.css'

class Home extends Component{
    constructor(props){
        super(props);
        NProgress.start();
        NProgress.configure({ ease: 'ease', speed: 500 });
    }
    componentDidMount(){
        NProgress.done()
    }
    render() {
        return (
            <div className="Home">
                <div className = "top-container">
                    <img className = "top-image" src = {topImg} alt="home page "/>
                    <div className = "top-text">Mobile Service Management System</div>
                </div>
                <div className = "pkg-fnf-div">
                    <div className = "card pkg-card">
                        <div className = "card-image">
                            <img src = {pkgimage} alt = "Our Packages"></img>
                            <span className = "card-title">Our Packages</span>
                        </div>
                        <div className = "card-content">
                            <p>Select from our vast range of packages with optimized call rate and sms rates. connect with your near and dear ones with 
                            your near  and dear ones with fnf's offererd along with the packages. if you don't want to select a package for yourself, we are happy to help with the default package that comes with every new connection. stay connected!</p>
                        </div>
                        <div className = "card-footer">
                            <NavLink to = "/package">See Our Packages</NavLink>
                        </div>
                    </div>

                    <div className = "card fnf-card">
                        <div className = "card-image">
                            <img src = {pkgimage} alt = "Our FNF Plans"></img>
                            <span className = "card-title">Our FNF Plans</span>
                        </div>
                        <div className = "card-content">
                            <p>Select from our categorized FNF Plans to enjoy optimized call rate and sms rate while connecting with your near and dear ones. Yu alwways have the option to not chose a particular fnf plan! In that case callrate and smsrate are used according to your current package. Thank you for staying with us! Stay connected always!</p>
                        </div>
                        <div className = "card-footer">
                            <NavLink to = "/fnf">See Our FNF Plans</NavLink>
                        </div>
                    </div>
                </div>

               
                <div className = "offer-plan-div">
                    <div className = "card offer-card">
                        <div className = "card-image">
                            <img src = {pkgimage} alt = "Our Offers"></img>
                            <span className = "card-title">Our Offers</span>
                        </div>
                        <div className = "card-content">
                            <p>Select from the vast range of our propsed offers with minimal cost! You can use your current balance or points. There's always something going on! Enjoy and stay connected!</p>
                        </div>
                        <div className = "card-footer">
                            <NavLink to = "/offers">See Our Ongoing Offers</NavLink>
                        </div>
                    </div>

                    <div className = "card plan-card">
                        <div className = "card-image">
                            <img src = {pkgimage} alt = "Flexiplans"></img>
                            <span className = "card-title">Select Your Plan</span>
                        </div>
                        <div className = "card-content">
                            <p>Customize your current plan as you like and as per your need! select internet volume, talktime, sms balance and validity of your plan! You must be logged in to select a plan!v Stay connected! </p>
                        </div>
                        <div className = "card-footer">
                            <NavLink to = "/flexiplan">Select Your Plan</NavLink>
                        </div>
                    </div>
                </div>
                <div className="home-footer">
                    <div className = "footer-links">
                        <p>Important Links</p>
                        <span className = "links"><NavLink to = "/package">Packages</NavLink></span>
                        <span className = "links"><NavLink to = "/fnf">FNF</NavLink></span>
                        <span className = "links"><NavLink to = "/offers">Offers</NavLink></span>
                        <span className = "links"><NavLink to = "/flexiplan">My Plan</NavLink></span>
                        <p>Thank You for Staying With Us! </p>
                    </div>
                </div>
            </div>
        )
    }
}

export default Home