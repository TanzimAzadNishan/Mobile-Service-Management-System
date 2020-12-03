import React, { Component } from 'react'
import { connect } from 'react-redux'
import Modal from 'react-modal'
import NProgress from 'nprogress'
import {retrievefnfInfo, updatefnfInfo} from '../../store/actions/service/fnfActions'
import '../../styles/service/fnfStyle.css'

class FNF extends Component{
    constructor(props){
        super(props);
        NProgress.start();
        NProgress.configure({ ease: 'ease', speed: 500 });
        this.state = {activeModal:'',fnfName:''}
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.confirmfnf = this.confirmfnf.bind(this);
        //this.handleModalChangeEnter = this.handleModalChange.bind(this, true);
        //this.handleModalChangeLogin = this.handleModalChange.bind(this, false);
    }
    openModal (name) {
        this.setState({activeModal:name}); }
    closeModal () {
        this.setState({activeModal:''}); }
    selectfnf(name){
        this.setState({activeModal: 'sel', fnfName: name});
    }
    confirmfnf() {
        const fnfDetails = {
            name: this.state.fnfName,
            number: this.props.auth.mobile_number
        }
        console.log(fnfDetails)
        this.props.updatefnfInfo(fnfDetails)
        this.setState({activeModal: '', fnfName: ''});

    }

    componentDidMount(){
        NProgress.done();
        this.props.retrievefnfInfo(this.props.fnfInfo)
    }

    render() {
        const { fnfInfo } = this.props
        if(this.props.fnfInfo == null){
            console.log('found nothing')
            return(
                <> </>
                )
        }

        else{
    
            var colors = ['#c93a3a', '#4a0606', '#9c6513','#876839','#b55921','#421c05','#c59a3b', '#367a67', '#ab5483','#789071','#a56bcf','#34757a'];
            var fnfs = []
            var obj = fnfInfo
            for(var i in obj)
                fnfs.push(obj[i]);
                
            const fnfList = fnfs.map(fnf => {
                if(this.props.auth != null)
                {
                    return(
                        <div className="fnf-det" key={fnf.FNF_TYPE}>
                            <div className="card">
                                <div className="card-content">
                                    <div className="card-title"  onClick = {() => this.selectfnf(fnf.FNF_TYPE)} style = {{background: colors[Math.floor(Math.random() * colors.length)]}}>
                                        {fnf.FNF_TYPE}
                                    </div>
                                    <div className="details">
                                        <p style={{color: "#FF5733"}}>
                                            Call Rate: {fnf.CALL_RATE} 
                                        </p>
                                        <p style={{color: "#675923"}}>
                                            SMS Rate: {fnf.SMS_RATE} 
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <Modal className = "fnf-details-modal" isOpen={this.state.activeModal === 'sel'} ariaHideApp={false}>
                                <div>
                                    Do you want to select {this.state.fnfName} as your current FNF Plan?
                                </div>
                                <button className ='btn green waves-effect waves-light close-fnf-modal' onClick={this.confirmfnf}>Confirm</button>
                                <button className ='btn red waves-effect waves-light close-fnf-modal' onClick={this.closeModal}>Exit</button>
                            </Modal>                        
                        </div>
                    )
                }
                else{

                    return(
                        <div className="fnf-det" key={fnf.FNF_TYPE}>
                            <div className="card">
                                <div className="card-content">
                                    <div className="card-title"  onClick = {() => this.openModal('fnf-details-modal')} style = {{background: colors[Math.floor(Math.random() * colors.length)]}}>
                                        {fnf.FNF_TYPE}
                                    </div>
                                    <div className="details">
                                        <p style={{color: "#FF5733"}}>
                                            Call Rate: {fnf.CALL_RATE} 
                                        </p>
                                        <p style={{color: "#675923"}}>
                                            SMS Rate: {fnf.SMS_RATE} 
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <Modal className = "fnf-details-modal" isOpen={this.state.activeModal === 'fnf-details-modal'} ariaHideApp={false}>
                        <div>
                            You need to be logged in to select this FNF Plan!
                        </div>
                            <button className ='btn red waves-effect waves-light close-fnf-modal' onClick={this.closeModal}>Exit</button>
                        </Modal>
                        </div>
                        
                    )
                }
                
            })

            return(
                <>
                <div className = "fnf-title">
                    Our FNF Plans
                </div>

                
                <div className="fnf-parent">
                    {fnfList}
                </div>
                </>
            )
            
        }
    }
}

const mapStateToProps = (state) => {
    return {
        auth: state.auth.auth,
        fnfInfo: state.fnf.fnfInfo
    }
}

const mapDispatchtoProps = (dispatch)=>{
    return{
        retrievefnfInfo: (fnfInfo)=>{
            dispatch(retrievefnfInfo(fnfInfo))
        },
        updatefnfInfo: (fnfDetails)=>{
            dispatch(updatefnfInfo(fnfDetails))
        },
    }
}

export default connect(mapStateToProps, mapDispatchtoProps)(FNF)