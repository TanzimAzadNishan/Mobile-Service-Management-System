import React, { Component } from 'react'
import { connect } from 'react-redux'
//import {NavLink} from 'react-router-dom'
import NProgress from 'nprogress'
//import Modal from 'react-modal'
import {retrieveHistoryInfo} from '../store/actions/historyActions'
import '../styles/HistoryStyle.css'

const initialState ={

}

class History extends Component{
    constructor(props){
        super(props);
        NProgress.start();
        NProgress.configure({ ease: 'ease', speed: 500 });
    }

    state = initialState

    componentDidMount(){
        NProgress.done();
        if(this.props.auth != null){
            this.props.retrieveHistoryInfo(this.props.auth);
        }
    }

    openHistoryTab(e,tabname) {
        var i, tabcontent, tablinks;

        tabcontent = document.getElementsByClassName("tabcontent");
        for(i = 0; i < tabcontent.length; i++){
            tabcontent[i].style.display = "none";
        }

        tablinks = document.getElementsByClassName("tablinks");
        for(i = 0; i < tablinks.length; i++){
            tablinks[i].className.replace(" active","");
        }
        
        document.getElementById(tabname).style.display = "block";
        e.target.className += " active";
    }

    render(){
        if(this.props.auth != null){
            const{historyInfo} = this.props
            console.log(historyInfo)
        var history = []
        var colors =['#ffffff','#fffdde']
        var obj = historyInfo

        for(var i in obj)
        history.push(obj[i]);
            
            var flag = 1;
            const callHistory = history.map((hist, index) => {
                    var date = (hist.TIME_SLOT).toString().replace("T"," ").replace(".000Z","");
                    var type = 'Outgoing';
                    if(hist.CALL_TYPE === 'i'){type = 'Incoming'}
                    flag = flag^1;
                    if(hist.HISTORY_TYPE === 'call'){
                        return(
                        
                        <div className="call-history-details" key={history.HISTORY_ID} style={{background: colors[flag^1]}}>
                            <span className = "call-history-columns">{date}</span>
                            <span className = "call-history-columns">{hist.CONTACT_NUMBER}  {hist.CONTACT_NAME}</span>
                            <span className = "call-history-columns">{type}</span>
                            <span className = "call-history-columns">{hist.AMOUNT.toFixed(2)} bdt</span>
                            <span className = "call-history-columns">{Math.round(hist.CALL_DURATION)}:{Math.round((hist.CALL_DURATION-Math.floor(hist.CALL_DURATION))*100)}</span>
                        </div>
                        
                        )
                    }
                    else{
                        return(<></>)
                    }
                })

                flag = 1;
                const smsHistory = history.map(hist => {
                    var date = (hist.TIME_SLOT).toString().replace("T"," ").replace(".000Z","");
                    var type = 'Sent';
                    if(hist.SMS_TYPE === 'r'){type = 'Received'}
                    flag = flag^1;
                    if(hist.HISTORY_TYPE === 'sms'){
                        return(
                        <div className="sms-history-details" key={history.HISTORY_ID} style={{background: colors[flag^1]}}>
                            <span className = "sms-history-columns">{date}</span>
                            <span className = "sms-history-columns">{hist.CONTACT_NUMBER}  {hist.CONTACT_NAME}</span>
                            <span className = "sms-history-columns">{type}</span>
                            <span className = "sms-history-columns">{hist.AMOUNT.toFixed(2)} bdt</span>
                        </div>
                        
                        )
                    }
                    else{
                        return(<></>)
                    }
                })

                flag = 1;
                const intHistory = history.map(hist => {
                    var date = (hist.TIME_SLOT).toString().replace("T"," ").replace(".000Z","");
                    flag = flag^1;
                    if(hist.HISTORY_TYPE === 'int'){
                        
                    var date1 = (hist.TIME_SLOT_END).toString().replace("T"," ").replace(".000Z","");
                        return(
                        <div className="int-history-details" key={history.HISTORY_ID} style={{background: colors[flag^1]}}>
                            <span className = "int-history-columns">{date} - {date1}</span>
                            <span className = "int-history-columns">{(hist.DATA_VOLUME).toFixed(2)} MB</span>
                        </div>
                    
                        )
                    }
                    else{
                        return(<></>)
                    }
                })

                flag = 1;
                const recHistory = history.map((hist) => {
                    console.log(JSON.stringify(hist.TIME_SLOT))
                    var date = (hist.TIME_SLOT).toString().replace("T"," ").replace(".000Z","");
                    var type = 'Sent';
                    //if(hist.RECHARGE_TYPE === 'r'){type = 'Received'}
                    if(hist.RECHARGE_TYPE === 'i'){
                        type = 'Received'
                    }
                    flag = flag^1;
                    if(hist.HISTORY_TYPE === 'rec'){
                        return(
                            <div className="rec-history-details" key={history.HISTORY_ID} style={{background: colors[flag^1]}}>
                                <span className = "rec-history-columns">{date}</span>
                                <span className = "rec-history-columns">{hist.CONTACT_NUMBER}</span>
                                <span className = "rec-history-columns">{type}</span>
                                <span className = "rec-history-columns">{(hist.AMOUNT).toFixed(2)} bdt</span>
                            </div>
                            
                        )
                    }
                    else{
                        return(<></>)
                    }
                })
                

        return(
            <>
            <div className = "history-title">History</div>
            <div className = "tab history-names">
                <button className = "tablinks history-button" onClick = {(e)=>this.openHistoryTab(e,'call')}>Call History</button>
                <button className = "tablinks history-button" onClick = {(e)=>this.openHistoryTab(e,'internet')}>Internet History</button>
                <button className = "tablinks history-button" onClick = {(e)=>this.openHistoryTab(e,'sms')}>SMS History</button>
                <button className = "tablinks history-button" onClick = {(e)=>this.openHistoryTab(e,'recharge')}>Recharge History</button>
            </div>
            <div id="call" className="tabcontent call-tab">
                <div className = "history-tab">
                    <div className ="card">
                        <div className = "card-content">
                            <div className = "history-column-div">
                                <span className = "history-column-title">Time</span>
                                <span className = "history-column-title">Contact</span>
                                <span className = "history-column-title">Type</span>
                                <span className = "history-column-title">Usage</span>
                                <span className = "history-column-title">Duration</span> 
                            </div>
                                {callHistory}
                        </div>
                    </div>
                </div>
            </div>
            <div id="internet" className="tabcontent internet-tab">
                <div className = "history-tab">
                    <div className ="card">
                        <div className = "card-content">
                            <div className = "history-column-div">
                                <span className = "history-column-title">Session</span>
                                <span className = "history-column-title">Usage</span>
                            </div>
                                {intHistory}
                        </div>
                    </div>
                </div>
            </div>
            <div id="sms" className="tabcontent sms-tab">
                <div className = "history-tab">
                    <div className ="card">
                        <div className = "card-content">
                            <div className = "history-column-div">
                                <span className = "history-column-title">Time</span>
                                <span className = "history-column-title">Contact</span>
                                <span className = "history-column-title">Type</span>
                                <span className = "history-column-title">Usage</span>
                            </div>
                                {smsHistory}
                        </div>
                    </div>
                </div>
            </div>
            <div id="recharge" className="tabcontent recharge-tab">
                <div className = "history-tab">
                    <div className ="card">
                        <div className = "card-content">
                            <div className = "history-column-div">
                                <span className = "history-column-title">Time</span>
                                <span className = "history-column-title">Contact</span>
                                <span className = "history-column-title">Type</span>
                                <span className = "history-column-title">Amount</span>
                            </div>
                                {recHistory}
                        </div>
                    </div>
                </div>
            </div>
            </>
        )
    }
    else{
        return(<></>)
    }
        
        
    }
}

const mapStateToProps = (state) => {
    return {
        auth: state.auth.auth,
        historyInfo: state.history.historyInfo
    }
}

const mapDispatchtoProps = (dispatch)=>{
    return{
        retrieveHistoryInfo: (personInfo)=>{
            dispatch(retrieveHistoryInfo(personInfo))
        }
    }
}

export default connect(mapStateToProps, mapDispatchtoProps)(History)