import React, { Component } from 'react'
import { connect } from 'react-redux'
import Modal from 'react-modal'
import NProgress from 'nprogress'
import {retrievePackageInfo} from '../../store/actions/service/packageActions'
import '../../styles/service/PackageStyle.css'

class Package extends Component{
    constructor(props){
        super(props);
        NProgress.start();
        NProgress.configure({ ease: 'ease', speed: 500 });
        this.state = {activeModal:'',pkgName:''}
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        //this.handleModalChangeEnter = this.handleModalChange.bind(this, true);
        //this.handleModalChangeLogin = this.handleModalChange.bind(this, false);
    }
    openModal (name) {
        this.setState({activeModal:name}); }
    closeModal () {
        this.setState({activeModal:''}); }
    selectPkg(name){
        this.setState({activeModal: 'sel', pkgName: name});
    }

    componentDidMount(){
        NProgress.done();
        this.props.retrievePackageInfo(this.props.packageInfo)
    }

    render() {
        const { packageInfo } = this.props
        if(this.props.packageInfo == null){
            console.log('found nothing')
            return(
                <> </>
                )
        }

        else{
    
            var colors = ['#c93a3a', '#4a0606', '#9c6513','#876839','#b55921','#421c05','#c59a3b', '#367a67', '#ab5483','#789071','#a56bcf','#34757a'];
            var packages = []
            var obj = packageInfo
            for(var i in obj)
                packages.push(obj[i]);
            console.log(packages)
            const packageList = packages.map(pkg => {
                if(this.props.auth != null)
                {
                    return(
                        <div className="pkg-det" key={pkg.PKG_NAME}>
                            <div className="card">
                                <div className="card-content">
                                    <div className="card-title"  onClick = {() => this.selectPkg(pkg.PKG_NAME)} style = {{background: colors[Math.floor(Math.random() * colors.length)]}}>
                                        {pkg.PKG_NAME}
                                    
                                    </div>
                                    <div className="details">
                                        <p style={{color: "#FF5733"}}>
                                            Call Rate: {pkg.CALL_RATE} 
                                        </p>
                                        <p style={{color: "#675923"}}>
                                            SMS Rate: {pkg.SMS_RATE} 
                                        </p>
                                        <p style={{color: "#007F7A"}}>
                                            FNF Number(Max): {pkg.FNF_NUM} 
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <Modal className = "pkg-details-modal" isOpen={this.state.activeModal === 'sel'} ariaHideApp={false}>
                                <div>
                                    You have successfully selected {this.state.pkgName} package!
                                </div>
                                <button className ='btn red waves-effect waves-light close-pkg-modal' onClick={this.closeModal}>Exit</button>
                            </Modal>                        
                        </div>
                    )
                }
                else{

                    return(
                        <div className="pkg" key={pkg.PKG_NAME}>
                            <div className="card">
                                <div className="card-content">
                                    <div className="card-title" id={pkg.PKG_NAME} onClick = {() => this.openModal('pkg-details-modal')} style = {{background: colors[Math.floor(Math.random() * colors.length)]}}>
                                        {pkg.PKG_NAME}
                                    
                                    </div>
                                    <div className="details">
                                        <p style={{color: "#FF5733"}}>
                                            Call Rate: {pkg.CALL_RATE} 
                                        </p>
                                        <p style={{color: "#675923"}}>
                                            SMS Rate: {pkg.SMS_RATE} 
                                        </p>
                                        <p style={{color: "#007F7A"}}>
                                            FNF Number(Max): {pkg.FNF_NUM} 
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <Modal className = "pkg-details-modal" isOpen={this.state.activeModal === 'pkg-details-modal'}>
                        <div>
                            You need to be logged in to select this package!
                        </div>
                            <button className ='btn red waves-effect waves-light close-pkg-modal' onClick={this.closeModal}>Exit</button>
                        </Modal>
                        </div>
                        
                    )
                }
                
            })

            return(
                <>
                <div className = "package-title">
                    Our Packages
                </div>

                
                <div>
                    {packageList}
                </div>
                </>
            )
            
        }
    }
}

const mapStateToProps = (state) => {
    return {
        auth: state.auth.auth,
        packageInfo: state.package.packageInfo
    }
}

const mapDispatchtoProps = (dispatch)=>{
    return{
        retrievePackageInfo: (packageInfo)=>{
            dispatch(retrievePackageInfo(packageInfo))
        }
    }
}

export default connect(mapStateToProps, mapDispatchtoProps)(Package)