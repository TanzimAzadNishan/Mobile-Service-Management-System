import React, { Component } from 'react'
import NProgress from 'nprogress'
import '../styles/AboutStyle.css'
import abtImg1 from '../images/home3.jpg'
import dev1 from '../images/dev1.jpg'
import dev2 from '../images/dev2.jpg'
import sup from '../images/sup.jpg'

class About extends Component{
    constructor(props){
        super(props);
        NProgress.start();
        NProgress.configure({ ease: 'ease', speed: 500 });
    }

    componentDidMount(){
        NProgress.done()
    }

    render(){
        return(
            <>
            <div className = "about-title">Mobile Service Management System</div>
            <div className = "brief-part">
                <div className = "left-image">
                    <img className = "abt-img1" src = {abtImg1} alt="about"/>
                </div>
                <div className = "about-details">
                    <h5>Our functionalities:</h5>
                    <p># Packages, FNF, Offers set by Admin<br></br>
                    # User Signup and Login<br></br>
                    # Selecting Packages, Fnf plans and Offers By Users<br></br>
                    # Selecting customised plans by Users
                    # Use of Account Balance or Points to buy Offers or avail Flexiplan<br></br>
                    # Connecting with other Users in the system and ive and take of points<br></br>
                    # Recharge system between Users<br></br>
                    # User feedback to Admin nad Reply feedback system from Admin to Users<br></br>
                    # Dummy Call, SMS and Internet Usage System<br></br>
                    # History Management</p>
                </div>
            </div>
            <div className = "dev-title">Developers</div>
            <div className = "developer-img-part">
                <img className = "dev1img" src = {dev1} alt="developer 1"/>
                <img className = "dev2img" src = {dev2} alt="developer 2"/>
            </div>
            <div className = "dev-det-part">
                <div className = "dev1-det">
                    <p><h5>Md. Tanzim Azad</h5>
                    1705074<br></br>
                    Department of Computer Science and Engineering<br></br>
                    Bangladesh University of Engineering and Technology</p>
                </div>
                <div className = "dev2-det">
                <p><h5>Prantik Paul</h5>
                    1705071<br></br>
                    Department of Computer Science and Engineering<br></br>
                    Bangladesh University of Engineering and Technology</p>
                </div>
            </div>

            <div className = "sup-title">Supervisor</div>
            <div className = "supervisor-img-part">
                <img className = "supimg" src = {sup} alt="supervisor"/>
                
            </div>
            <div className = "sup-det-part">
                <div className = "sup-det">
                    <p><h5>Dr. Muhammad Abdullah Adnan</h5>
                    Associate Professor<br></br>
                    Department of Computer Science and Engineering<br></br>
                    Bangladesh University of Engineering and Technology</p>
                </div>
            </div>
            <div className="about-footer">
                <div className = "footer-det">
                    <p>Thank You!</p>
                </div>
            </div>
            </>
        )
    }
}

export default About