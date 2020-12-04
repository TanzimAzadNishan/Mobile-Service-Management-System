import React, { Component } from 'react'
import { connect } from 'react-redux'
import {Redirect} from 'react-router-dom'
import NProgress from 'nprogress'
import '../../styles/service/FeedbackStyle.css'
import {validateFeedbackBody} from '../../utilities/Validators/FeedbackValidator'
import {
    sendFeedback, getFeedbackList
} from '../../store/actions/service/feedbackAction'
import Modal from 'react-modal'


const initialState = {
    Feedback_Subject: {
        value: '',
        validateOnChange: false,
        error: ''
    },
    Feedback_Body: {
        value: '',
        validateOnChange: false,
        error: ''
    },
    ModalState: {
        replySubject: '',
        replyBody: '',
        replyDate: '',
        replyId: ''
    },
    activeModal: '',
    submitCalled: false,
    allFieldsValidated: false
}

class Feedback extends Component{
    constructor(props){
        super(props);
        NProgress.start();
        NProgress.configure({ ease: 'ease', speed: 500 });

        this.state = initialState
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    componentDidMount(){
        var info = {
            reviewer: this.props.auth.mobile_number
        }
        this.props.getFeedbackList(info)
    }
    openModal (name, replySubject, replyBody, replyDate, replyId) {
        this.setState(state => ({
            Feedback_Subject: {
                value: '',
                validateOnChange: false,
                error: ''
            },
            Feedback_Body: {
                value: '',
                validateOnChange: false,
                error: ''
            },
            ModalState: {
                replySubject: replySubject,
                replyBody: replyBody,
                replyDate: replyDate,
                replyId: replyId
            },
            activeModal: name,
            submitCalled: false,
            allFieldsValidated: false
        }));
    }
    closeModal () {
        this.setState({activeModal: ''}); 
    }

    setFeedbackSubject = (evt)=>{
        const field = evt.target.id
        const fieldVal = evt.target.value;
        console.log(fieldVal)
        this.setState(state => ({
            [field]: {
              ...state[field],
              value: fieldVal
            }
          }));
    }
    handleChange = (evt, validationFunc)=>{
        const field = evt.target.id
        const fieldVal = evt.target.value;
        this.setState(state => ({
          [field]: {
            ...state[field],
            value: fieldVal
          }
        }));
    }
    /*handleBlur = (e, validationFunc)=>{
        const field = e.target.id
        if (this.state[field]['validateOnChange'] === false &&
            this.state.submitCalled === false
        ){
            this.setState(state => ({
              [field]: {
                ...state[field],
                validateOnChange: true
              }
            }));
        }
    }*/

    handleSubmit = (evt)=>{
        evt.preventDefault();

        const { Feedback_Body, Feedback_Subject } = this.state;
        var bodyErr = validateFeedbackBody(Feedback_Body.value)
        if ([bodyErr].every(e => e === false)){
            console.log('feedback form submitted successfully')

            var feedbackInfo = {
                subject: Feedback_Subject.value,
                body: Feedback_Body.value,
                reviewer: this.props.auth.mobile_number
            }
            this.props.sendFeedback(feedbackInfo)
            this.setState({...initialState})
        }
        else{
            console.log(bodyErr)
            this.setState(state => ({
                Feedback_Subject: {
                    value: '',
                    validateOnChange: true,
                    error: ''
                },
                Feedback_Body: {
                    value: '',
                    validateOnChange: true,
                    error: bodyErr
                }
            }))
        }
    }

    disableButton = ()=>{
        if(this.state.Feedback_Subject.value === '' ||
            this.state.Feedback_Body.value.length < 20
        ){
            return true
        }
        else{
            return false
        }
    }

    render() {
        if (this.props.auth == null){
            console.log('redirected')
            return <Redirect to='/' />
        }

        else{
            NProgress.done()
            //console.log(this.props.feedbackReplyList)

            const feedbackList = this.props.feedbackReplyList.map((item, index)=>{
                return(
                    <div className="single-item"
                        key={index}
                        onClick = {() => this.openModal('feedback-modal',
                            item.SUBJECT, item.FEEDBACK_BODY,
                            item.FEEDBACK_DATE.split('T')[0], item.FEEDBACK_ID)}
                    >
                        <div className="subject">
                            {item.SUBJECT}
                        </div>

                        <div className="body-placeholder">
                            {item.FEEDBACK_BODY}
                        </div>
                        <div className="body-end">
                            ....
                        </div>      
                    </div>
                )
            })

            return (
                <>
                    <div className="feedback-title">
                        Feedback
                    </div>

                    <div className="feedback-details">
                        <div className="left-section">

                            <div className="left-section-title">
                                Feedback Form
                            </div>

                            <form className="feedback-form"
                                onSubmit={this.handleSubmit}
                            >

                                <div className="input-field">
                                    <i className="material-icons prefix"
                                    >
                                        settings_cell 
                                    </i>
                                    <input type="text" id="Mobile_Number"
                                        className="validate"
                                        defaultValue={`01724729159`}
                                        disabled
                                    />
                                    <label htmlFor="mobile-number"
                                        className="active"
                                    >
                                        Reviewer's Mobile Number 
                                    </label>

                                </div>

                                <select 
                                    className="browser-default" 
                                    value={this.state.Feedback_Subject.value}
                                    onChange={this.setFeedbackSubject}
                                    id="Feedback_Subject"
                                >
                                    <option value="" disabled> Feedback Subject </option>
                                    <option value="Package"> Package </option>
                                    <option value="Offer"> Offer </option>
                                    <option value="FNF"> FNF </option>
                                    <option value="Flexiplan"> Flexiplan </option>
                                    <option value="Recharge"> Recharge </option>
                                    <option value="Link"> Link </option>
                                    <option value="Network"> Network </option>
                                </select>

                                <div className="input-field body-area">
                                    <i className="material-icons prefix"
                                    style={this.state.Feedback_Body.error ? ({color: "red"}):(null)}
                                    >
                                        description
                                    </i>
                                    <textarea type="text" id="Feedback_Body"
                                        className="materialize-textarea"
                                        style={this.state.Feedback_Body.error ? ({color: "red"}):(null)}
                                        value={this.state.Feedback_Body.value} 
                                        onChange={(e)=>{this.handleChange(e, validateFeedbackBody)}}
                                        placeholder={`mention service name and review...`}
                                    />
                                    <label htmlFor="feedback-subject"
                                        className="active"
                                        style={this.state.Feedback_Body.error ? ({color: "red"}):(null)}
                                    >
                                        Feedback Body
                                    </label>
                                    <div style={{color: "red"}}>
                                        {this.state.Feedback_Body.error}
                                    </div>
                                </div>

                                <div className="input-field send-feedback-btn">
                                    <button 
                                        type="submit"
                                        disabled={this.disableButton()} 
                                    >
                                        Send Feedback
                                    </button>
                                </div>

                            </form>

                        </div>

                        <div className="right-section">
                            <div className="right-section-title">
                                Admin's Reply
                            </div>

                            <div className="feedback-list">
                                <div className="card">
                                    <div className="card-content">

                                        {feedbackList}

                                        <Modal
                                            className = "feedback-modal"
                                            isOpen={this.state.activeModal === 'feedback-modal'} 
                                            ariaHideApp={false} 
                                        >

                                            <div className="modal-title">
                                                Your Feedback's Reply
                                            </div>

                                            <div className="subject-header">
                                                Subject : 
                                            </div>
                                            <div className="subject-name">
                                                {this.state.ModalState.replySubject}
                                            </div>
                                            <div></div>

                                            <div className="date-header">
                                                Reply Date : 
                                            </div>
                                            <div className="date-name">
                                                {this.state.ModalState.replyDate}
                                            </div>
                                            <div></div>

                                            <div className="body-header">
                                                Message of Admin : 
                                            </div>
                                            <div className="body-msg">
                                                {this.state.ModalState.replyBody}
                                            </div>

                                            <div className="btn-part">
                                                <button 
                                                    className ='btn-small exit-btn' 
                                                    onClick={this.closeModal}
                                                >
                                                    Exit
                                                </button>
                                            </div>

                                        </Modal>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )
        }
    }
}

const mapStateToProps = (state) => {
    return{
        auth: state.auth.auth,
        feedbackReplyList: state.feedback.feedbackReplyList
    }
}

const mapDispatchtoProps = (dispatch)=>{
    return{
        sendFeedback: (info)=>{
            dispatch(sendFeedback(info))
        },
        getFeedbackList: (info)=>{
            dispatch(getFeedbackList(info))
        }
    }
}

export default connect(mapStateToProps, mapDispatchtoProps)(Feedback)