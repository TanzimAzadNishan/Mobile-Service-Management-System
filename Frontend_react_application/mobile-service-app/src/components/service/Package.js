import React, { Component } from 'react'
import { connect } from 'react-redux'
import NProgress from 'nprogress'
import {retrievePackageInfo} from '../../store/actions/service/packageActions'
import '../../styles/service/PackageStyle.css'

class Package extends Component{
    constructor(props){
        super(props);
        NProgress.start();
        NProgress.configure({ ease: 'ease', speed: 500 });
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
                return(
                    <div className="pkg-part" key={pkg.PKG_NAME}>
                        <div className="card">
                            <div className="card-content">
                                <div className="card-title" style = {{background: colors[Math.floor(Math.random() * colors.length)]}}>
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
                    </div>
                )
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