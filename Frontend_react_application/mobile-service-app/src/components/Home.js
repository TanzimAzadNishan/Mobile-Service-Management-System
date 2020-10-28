import React, { Component } from 'react'
import NProgress from 'nprogress'

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
                
            </div>
        )
    }
}

export default Home