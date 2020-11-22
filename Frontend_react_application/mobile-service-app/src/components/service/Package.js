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
            packageInfo.forEach( pkg => {
                return(
                    <div>
                        {pkg.PKG_NAME}<br></br>
                        {pkg.CALL_RATE}<br></br>
                        {pkg.SMS_RATE}<br></br>
                    </div>
                )
            });
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