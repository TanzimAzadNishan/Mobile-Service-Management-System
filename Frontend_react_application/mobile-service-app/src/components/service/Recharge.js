import React, { Component } from 'react'
import { connect } from 'react-redux'
import {Redirect} from 'react-router-dom'
import NProgress from 'nprogress'
import '../../styles/service/RechargeStyle.css'
import {
    validateMobileNumber,validateAmount
} from '../../utilities/Validators/RechargeValidator.js'
import Modal from 'react-modal'
import {
    sendRecharge
} from '../../store/actions/service/rechargeAction'


const initialState = {
    Mobile_Number: {
        value: '',
        validateOnChange: false,
        error: ''
    },
    Amount: {
        value: '',
        validateOnChange: false,
        error: ''
    },
    activeModal: '',
    submitCalled: false,
    allFieldsValidated: false
}

class Recharge extends Component{
    constructor(props){
        super(props);
        NProgress.start();
        NProgress.configure({ ease: 'ease', speed: 500 });
        this.state = initialState
        this.openConfirmationModal = this.openConfirmationModal.bind(this);
        this.closeConfirmationModal = this.closeConfirmationModal.bind(this);
    }

    componentDidMount(){
    }

    handleChange = (e, validationFunc)=>{
        const field = e.target.id
        const fieldVal = e.target.value;
        this.setState(state => ({
          [field]: {
            ...state[field],
            value: fieldVal,
            error: state[field]['validateOnChange'] ? validationFunc(fieldVal) : ''
          }
        }));
    }

    handleBlur = (e, validationFunc)=>{
        const field = e.target.id
        if (this.state[field]['validateOnChange'] === false &&
            this.state.submitCalled === false
        ){
            this.setState(state => ({
              [field]: {
                ...state[field],
                validateOnChange: true,
                error: validationFunc(state[field].value)
              }
            }));
        }
    }
    handleRechargeSubmit = (evt)=>{
        evt.preventDefault();
        const { Mobile_Number, Amount } = this.state;
        var mobErr = validateMobileNumber(Mobile_Number.value)
        var amountErr = validateAmount(Amount.value)
        if ([mobErr, amountErr].every(e => e === false)){
            console.log('recharge form submitted successfully')

            var rechargeInfo = {
                sender: this.props.auth.mobile_number,
                receiver: Mobile_Number.value,
                amount: Amount.value
            }
            this.props.sendRecharge(rechargeInfo)
            this.setState({...initialState})
        }
        else{
            console.log(mobErr)
            console.log(amountErr)
            this.setState(state => ({
                Mobile_Number: {
                    value: '',
                    validateOnChange: true,
                    error: mobErr
                },
                Amount: {
                    value: '',
                    validateOnChange: true,
                    error: amountErr
                },
                activeModal: '',
                submitCalled: false,
                allFieldsValidated: false
            }))
        }
    }

    openConfirmationModal = (e)=>{
        e.preventDefault();
        if(this.props.auth.mobile_number === this.state.Mobile_Number.value){
            const field = 'Mobile_Number'
            this.setState(state => ({
                [field]: {
                  ...state[field],
                  error: 'This is your mobile number!'
                }
              }));
        }
        else{
        this.setState(state => ({
            activeModal: 'recharge-confirm-modal'
        }))
        }
    }

    closeConfirmationModal(){
        //this.setState({...initialState})
        this.setState({activeModal: ''});
    }

    render() {
        if (this.props.auth == null){
            console.log('redirected')
            return <Redirect to='/' />
        }

        else{
            //console.log('activeModal: ', this.state.activeModal)
            NProgress.done()
            return (
                <div className="recharge">
                    <div className="recharge-title">
                        Recharge
                    </div>

                    <form> 
                        <div className="input-field">
                            <i className="material-icons prefix"
                            style={this.state.Mobile_Number.error ? ({color: "red"}):(null)}
                            >
                                settings_cell 
                            </i>
                            <input type="text" id="Mobile_Number"
                                className="validate"
                                style={this.state.Mobile_Number.error ? ({color: "red"}):(null)}
                                value={this.state.Mobile_Number.value} 
                                onChange={(e)=>{this.handleChange(e, validateMobileNumber)}}
                                onBlur={(e)=>{this.handleBlur(e, validateMobileNumber)}}
                            />
                            <label htmlFor="mobile-number"
                                style={this.state.Mobile_Number.error ? ({color: "red"}):(null)}
                            >
                                Mobile Number 
                            </label>
                            <div style={{color: "red"}}>
                                {this.state.Mobile_Number.error}
                            </div>
                        </div>

                        <div className="input-field">
                            <i className="material-icons prefix"
                            style={this.state.Amount.error ? ({color: "red"}):(null)}
                            >
                                redeem
                            </i>
                            <input type="text" id="Amount"
                                className="validate"
                                style={this.state.Amount.error ? ({color: "red"}):(null)}
                                value={this.state.Amount.value} 
                                onChange={(e)=>{this.handleChange(e, validateAmount)}}
                                onBlur={(e)=>{this.handleBlur(e, validateAmount)}}
                            />
                            <label htmlFor="amount"
                                style={this.state.Amount.error ? ({color: "red"}):(null)}
                            >
                                Enter Amount
                            </label>
                            <div style={{color: "red"}}>
                                {this.state.Amount.error}
                            </div>
                        </div>
                    
                        <div className="input-field">
                            <button 
                                onClick={this.openConfirmationModal} 
                                className='recharge-btn'
                            >
                                Recharge
                            </button>

                        </div>

                        <div style={{color: "red"}}>
                                {this.props.rechargeError}
                        </div>
                    </form>
 
                    <Modal
                        className = "recharge-modal"
                        isOpen={this.state.activeModal === 'recharge-confirm-modal'} 
                        ariaHideApp={false} 
                    >
                    
                        <div className="modal-title">
                            Please Confirm Recharge
                        </div>

                        <div className="btn-part">

                            <button 
                                className ='btn-small confirm-btn' 
                                onClick={this.handleRechargeSubmit}
                            >
                                Confirm
                            </button>

                            <button 
                            className ='btn-small exit-btn' 
                            onClick={this.closeConfirmationModal}
                        >
                            Exit
                        </button>
                        </div>
                    </Modal>
 
                </div>
            )
        }
    }
}


const mapStateToProps = (state) => {
    return{
        auth: state.auth.auth,
        rechargeError: state.recharge.rechargeError
    }
}

const mapDispatchtoProps = (dispatch)=>{
    return{
        sendRecharge: (info)=>{
            dispatch(sendRecharge(info))
        }
    }
}

export default connect(mapStateToProps, mapDispatchtoProps)(Recharge)