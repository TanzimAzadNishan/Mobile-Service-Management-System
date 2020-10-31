import React, { Component } from 'react'
import { connect } from 'react-redux'
//import {Redirect, NavLink} from 'react-router-dom'
import NProgress from 'nprogress'
import {
    editPersonDetails, editProfilePic
} from '../../store/actions/dashboardActions'


class EditPersonDetails extends Component{
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
            <div>
                
            </div>
        )
    }
}


const mapStateToProps = (state) => {
    return {
      auth: state.auth.auth
    }
}

const mapDispatchtoProps = (dispatch)=>{
    return{
        editPersonDetails: (personInfo)=>{
            dispatch(editPersonDetails(personInfo))
        },
        editProfilePic: (pic)=>{
            dispatch(editProfilePic(pic))
        }
    }
}

export default connect(mapStateToProps, mapDispatchtoProps)(EditPersonDetails)