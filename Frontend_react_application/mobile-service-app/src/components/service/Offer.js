import React, { Component } from 'react'
import { connect } from 'react-redux'
import Modal from 'react-modal'
import NProgress from 'nprogress'
import {retrievePopularOfferInfo, retrieveOfferInfo, retrieveAccountBalance, updateAccountOffer} from '../../store/actions/service/offerActions'
import '../../styles/service/OfferStyle.css'

const initialState = {
    activemodal: '',
    offerDetails: {
        name: '',
        amount: 0,
        pts: 0,
        bonus_pts: 0,
        min_pts: 0,
        int: 0,
        bonus_int: 0,
        talktime: 0,
        bonus_talktime: 0,
        sms: 0,
        bonus_sms: 0,
        mobile_number: '',
        type: ''
    },
}

class Offer extends Component{
    constructor(props){
        super(props);
        NProgress.start();
        NProgress.configure({ ease: 'ease', speed: 500 });
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.selectPoint =  this.selectPoint.bind(this);
        this.selectBalance = this.selectBalance.bind(this);
    }

    state = initialState

    openModal (name) {
        this.setState({activeModal:name}); }
    closeModal () {
        this.props.retrievePopularOfferInfo(null)
        this.setState({activeModal:''});
    if(this.state.offerDetails.type === ''){
        console.log(this.state.offerDetails)
        this.props.updateAccountOffer(this.state.offerDetails)
    }
    else{
        console.log(this.state.offerDetails)
        this.props.updateAccountOffer(this.state.offerDetails)
    } }
    selectOffer(offer){
        if(this.props.points<offer.MIN_PTS){
            this.setState({activeModal: 'minimum_points'})
        }
        else{
            this.setState({activeModal: 'sel', offerDetails: {
                ...this.state.offerDetails,
                name: offer.OFFER_ID,
                amount: offer.MONEY,
                pts: offer.EARNED_PTS,
                bonus_pts: offer.BONUS_PTS,
                min_pts: offer.MIN_PTS,
                int: offer.INT_BAL,
                bonus_int: offer.BONUS_INT_BAL,
                talktime: offer.MIN_BAL,
                bonus_talktime: offer.BONUS_MIN_BAL,
                sms: offer.SMS_BAL,
                bonus_sms: offer.BONUS_SMS
            }});
        }  
    }

    selectPoint(){
        console.log(this.state.offerDetails)
        if(this.props.points<this.state.offerDetails.amount){
            this.setState({activeModal: 'insufficient',
        offerDetails:{
            ...this.state.offerDetails,
        }})
            console.log('you dont have enough points')
        }
        else{
            this.setState({
                offerDetails: {
                    ...this.state.offerDetails,
                    type: 'P'
                },activeModal: 'bought'
            })
            console.log('you have enough points')
        }
    }

    selectBalance(){
            console.log(this.state.offerDetails)
            if(this.props.balance<this.state.offerDetails.amount){
                this.setState({activeModal: 'insufficient',
            offerDetails:{
                ...this.state.offerDetails,
            }})
                console.log('you dont have enough balance')
            }
            else{
                this.setState({
                    offerDetails: {
                        ...this.state.offerDetails,
                        type: 'B'
                    },activeModal: 'bought'
                })
                console.log('you have enough balance')
            }
        
    }

    componentDidMount(){
        NProgress.done();
        this.props.retrieveOfferInfo(this.props.offerInfo);
        this.props.retrievePopularOfferInfo(this.props.popular)
        if(this.props.auth!=null){
            this.props.retrieveAccountBalance(this.props.auth);
            this.setState({offerDetails: {
                ...this.state.offerDetails,
                mobile_number: this.props.auth.mobile_number}})
        }
    }

    render() {
        const { offerInfo } = this.props
        const { popular } = this.props
        if(this.props.offerInfo == null){
            console.log('found nothing')
            return(
                <> </>
                )
        }

        else{
    
            var colors = ['#c93a3a', '#4a0606', '#9c6513','#876839','#b55921','#421c05','#c59a3b', '#367a67', '#ab5483','#789071','#a56bcf','#34757a'];
            var offers = []
            var populars = []
            var obj = offerInfo
            var obj1 = popular
            for(var i in obj)
                offers.push(obj[i]);
            for(var j in obj1)
                populars.push(obj1[j]);

            const popularList = populars.map(offer => {
                if(this.props.auth != null)
                {
                    return(
                        <div className="Offer-det" key={offer.OFFER_ID}>
                            <div className="card">
                                <div className="card-content">
                                    <div className="card-title" onClick = {() => this.selectOffer(offer)} style = {{background: colors[Math.floor(Math.random() * colors.length)]}}>
                                        {offer.OFFER_ID}
                                    </div>
                                    <div className="details">
                                        <p style={{color: "#FF5733"}}>
                                            Amount: {offer.MONEY} 
                                        </p>
                                        <p style={{color: "#675923"}}>
                                            Validity: {offer.VALIDITY} 
                                        </p>
                                        <p style={{color: "#007F7A"}}>
                                            Points: {offer.EARNED_PTS} 
                                        </p>
                                        <p style={{color: "#FF5733"}}>
                                            Bonus Points: {offer.BONUS_PTS} 
                                        </p>
                                        <p style={{color: "#FF5733"}}>
                                            Minimum Points Required: {offer.MIN_PTS} 
                                        </p>
                                        <p style={{color: "#675923"}}>
                                            Internet: {offer.INT_BAL} 
                                        </p>
                                        <p style={{color: "#007F7A"}}>
                                            Bonus Internet: {offer.BONUS_INT_BAL} 
                                        </p>
                                        <p style={{color: "#FF5733"}}>
                                            Talktime: {offer.MIN_BAL} 
                                        </p>
                                        <p style={{color: "#675923"}}>
                                            Bonus Talktime: {offer.BONUS_MIN_BAL} 
                                        </p>
                                        <p style={{color: "#007F7A"}}>
                                            SMS: {offer.SMS_BAL} 
                                        </p>
                                        <p style={{color: "#FF5733"}}>
                                            Bonus SMS: {offer.BONUS_SMS} 
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <Modal className = "Offer-details-modal" isOpen={this.state.activeModal === 'sel'} ariaHideApp={false}>
                                <div>
                                    Do you want to buy this offer with points or account balance?<br></br><br></br>
                                    Your Balance: {this.props.balance} Your Points: {this.props.points}
                                </div>
                                <button className ='btn blue waves-effect waves-light close-offer-modal' onClick={this.selectPoint}>Points</button>
                                <button className ='btn blue waves-effect waves-light close-offer-modal' onClick={this.selectBalance}>Balance</button>
                                <button className ='btn red waves-effect waves-light close-offer-modal' onClick={this.closeModal}>Exit</button>
                            </Modal>
                            <Modal className = "Offer-last-modal" isOpen={this.state.activeModal === 'insufficient'} ariaHideApp={false}>
                                <div>
                                    Sorry, You don't have sufficient balance or points! 
                                </div>
                                <button className ='btn red waves-effect waves-light close-offer-modal' onClick={this.closeModal}>Exit</button>
                            </Modal> 
                            <Modal className = "Offer-last-modal" isOpen={this.state.activeModal === 'bought'} ariaHideApp={false}>
                                <div>
                                    Congrats! You have successfully bought this offer! 
                                </div>
                                <button className ='btn red waves-effect waves-light close-offer-modal' onClick={this.closeModal}>Exit</button>
                            </Modal>
                            <Modal className = "Offer-last-modal" isOpen={this.state.activeModal === 'minimum_points'} ariaHideApp={false}>
                                <div>
                                    Sorry! You don't have minimum points required to avail this offer! 
                                </div>
                                <button className ='btn red waves-effect waves-light close-offer-modal' onClick={this.closeModal}>Exit</button>
                            </Modal>                          
                        </div>
                    )
                }
                else{

                    return(
                        <div className="Offer-det" key={offer.OFFER_ID}>
                            <div className="card">
                                <div className="card-content">
                                    <div className="card-title"  onClick = {() => this.openModal('Offer-details-modal')} style = {{background: colors[Math.floor(Math.random() * colors.length)]}}>
                                        {offer.OFFER_ID}
                                    
                                    </div>
                                    <div className="details">
                                    <p style={{color: "#FF5733"}}>
                                            Amount: {offer.MONEY} 
                                        </p>
                                        <p style={{color: "#675923"}}>
                                            Validity: {offer.VALIDITY} 
                                        </p>
                                        <p style={{color: "#007F7A"}}>
                                            Points: {offer.EARNED_PTS} 
                                        </p>
                                        <p style={{color: "#FF5733"}}>
                                            Bonus Points: {offer.BONUS_PTS} 
                                        </p>
                                        <p style={{color: "#FF5733"}}>
                                            Minimum Points Required: {offer.MIN_PTS} 
                                        </p>
                                        <p style={{color: "#675923"}}>
                                            Internet: {offer.INT_BAL} 
                                        </p>
                                        <p style={{color: "#007F7A"}}>
                                            Bonus Internet: {offer.BONUS_INT_BAL} 
                                        </p>
                                        <p style={{color: "#FF5733"}}>
                                            Talktime: {offer.MIN_BAL} 
                                        </p>
                                        <p style={{color: "#675923"}}>
                                            Bonus Talktime: {offer.BONUS_MIN_BAL} 
                                        </p>
                                        <p style={{color: "#007F7A"}}>
                                            SMS: {offer.SMS_BAL} 
                                        </p>
                                        <p style={{color: "#FF5733"}}>
                                            Bonus SMS: {offer.BONUS_SMS} 
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <Modal className = "Offer-last-modal" isOpen={this.state.activeModal === 'Offer-details-modal'} ariaHideApp={false}>
                        <div>
                            You need to be logged in to buy this Offer!
                        </div>
                            <button className ='btn red waves-effect waves-light close-offer-modal' onClick={this.closeModal}>Exit</button>
                        </Modal>
                        </div>
                        
                    )
                }
                
            })
                
            const offerList = offers.map(offer => {
                if(this.props.auth != null)
                {
                    return(
                        <div className="Offer-det" key={offer.OFFER_ID}>
                            <div className="card">
                                <div className="card-content">
                                    <div className="card-title" onClick = {() => this.selectOffer(offer)} style = {{background: colors[Math.floor(Math.random() * colors.length)]}}>
                                        {offer.OFFER_ID}
                                    </div>
                                    <div className="details">
                                        <p style={{color: "#FF5733"}}>
                                            Amount: {offer.MONEY} 
                                        </p>
                                        <p style={{color: "#675923"}}>
                                            Validity: {offer.VALIDITY} 
                                        </p>
                                        <p style={{color: "#007F7A"}}>
                                            Points: {offer.EARNED_PTS} 
                                        </p>
                                        <p style={{color: "#FF5733"}}>
                                            Bonus Points: {offer.BONUS_PTS} 
                                        </p>
                                        <p style={{color: "#FF5733"}}>
                                            Minimum Points Required: {offer.MIN_PTS} 
                                        </p>
                                        <p style={{color: "#675923"}}>
                                            Internet: {offer.INT_BAL} 
                                        </p>
                                        <p style={{color: "#007F7A"}}>
                                            Bonus Internet: {offer.BONUS_INT_BAL} 
                                        </p>
                                        <p style={{color: "#FF5733"}}>
                                            Talktime: {offer.MIN_BAL} 
                                        </p>
                                        <p style={{color: "#675923"}}>
                                            Bonus Talktime: {offer.BONUS_MIN_BAL} 
                                        </p>
                                        <p style={{color: "#007F7A"}}>
                                            SMS: {offer.SMS_BAL} 
                                        </p>
                                        <p style={{color: "#FF5733"}}>
                                            Bonus SMS: {offer.BONUS_SMS} 
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <Modal className = "Offer-details-modal" isOpen={this.state.activeModal === 'sel'} ariaHideApp={false}>
                                <div>
                                    Do you want to buy this offer with points or account balance?<br></br><br></br>
                                    Your Balance: {this.props.balance} Your Points: {this.props.points}
                                </div>
                                <button className ='btn blue waves-effect waves-light close-offer-modal' onClick={this.selectPoint}>Points</button>
                                <button className ='btn blue waves-effect waves-light close-offer-modal' onClick={this.selectBalance}>Balance</button>
                                <button className ='btn red waves-effect waves-light close-offer-modal' onClick={this.closeModal}>Exit</button>
                            </Modal>
                            <Modal className = "Offer-last-modal" isOpen={this.state.activeModal === 'insufficient'} ariaHideApp={false}>
                                <div>
                                    Sorry, You don't have sufficient balance or points! 
                                </div>
                                <button className ='btn red waves-effect waves-light close-offer-modal' onClick={this.closeModal}>Exit</button>
                            </Modal> 
                            <Modal className = "Offer-last-modal" isOpen={this.state.activeModal === 'bought'} ariaHideApp={false}>
                                <div>
                                    Congrats! You have successfully bought this offer! 
                                </div>
                                <button className ='btn red waves-effect waves-light close-offer-modal' onClick={this.closeModal}>Exit</button>
                            </Modal>
                            <Modal className = "Offer-last-modal" isOpen={this.state.activeModal === 'minimum_points'} ariaHideApp={false}>
                                <div>
                                    Sorry! You don't have minimum points required to avail this offer! 
                                </div>
                                <button className ='btn red waves-effect waves-light close-offer-modal' onClick={this.closeModal}>Exit</button>
                            </Modal>                          
                        </div>
                    )
                }
                else{

                    return(
                        <div className="Offer-det" key={offer.OFFER_ID}>
                            <div className="card">
                                <div className="card-content">
                                    <div className="card-title"  onClick = {() => this.openModal('Offer-details-modal')} style = {{background: colors[Math.floor(Math.random() * colors.length)]}}>
                                        {offer.OFFER_ID}
                                    
                                    </div>
                                    <div className="details">
                                    <p style={{color: "#FF5733"}}>
                                            Amount: {offer.MONEY} 
                                        </p>
                                        <p style={{color: "#675923"}}>
                                            Validity: {offer.VALIDITY} 
                                        </p>
                                        <p style={{color: "#007F7A"}}>
                                            Points: {offer.EARNED_PTS} 
                                        </p>
                                        <p style={{color: "#FF5733"}}>
                                            Bonus Points: {offer.BONUS_PTS} 
                                        </p>
                                        <p style={{color: "#FF5733"}}>
                                            Minimum Points Required: {offer.MIN_PTS} 
                                        </p>
                                        <p style={{color: "#675923"}}>
                                            Internet: {offer.INT_BAL} 
                                        </p>
                                        <p style={{color: "#007F7A"}}>
                                            Bonus Internet: {offer.BONUS_INT_BAL} 
                                        </p>
                                        <p style={{color: "#FF5733"}}>
                                            Talktime: {offer.MIN_BAL} 
                                        </p>
                                        <p style={{color: "#675923"}}>
                                            Bonus Talktime: {offer.BONUS_MIN_BAL} 
                                        </p>
                                        <p style={{color: "#007F7A"}}>
                                            SMS: {offer.SMS_BAL} 
                                        </p>
                                        <p style={{color: "#FF5733"}}>
                                            Bonus SMS: {offer.BONUS_SMS} 
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <Modal className = "Offer-last-modal" isOpen={this.state.activeModal === 'Offer-details-modal'} ariaHideApp={false}>
                        <div>
                            You need to be logged in to buy this Offer!
                        </div>
                            <button className ='btn red waves-effect waves-light close-offer-modal' onClick={this.closeModal}>Exit</button>
                        </Modal>
                        </div>
                        
                    )
                }
                
            })

            return(
                <>

                <div className = "Offer-title">
                    Popular Offers
                </div>

                <div className="Offer-parent">
                    {popularList}
                </div>

                <div className = "Offer-title">
                    Our Offers
                </div>

                
                <div className="Offer-parent">
                    {offerList}
                </div>
                </>
            )
            
        }
    }
}

const mapStateToProps = (state) => {
    return {
        auth: state.auth.auth,
        popular: state.offer.popular,
        offerInfo: state.offer.offerInfo,
        balance: state.offer.balance,
        points: state.offer.points    }
}

const mapDispatchtoProps = (dispatch)=>{
    return{
        retrievePopularOfferInfo: (popular)=>{
            dispatch(retrievePopularOfferInfo(popular))
        },
        retrieveOfferInfo: (offerInfo)=>{
            dispatch(retrieveOfferInfo(offerInfo))
        },
        retrieveAccountBalance: (personInfo)=>{
            dispatch(retrieveAccountBalance(personInfo))
        },
        updateAccountOffer: (offerDetails)=>{
            dispatch(updateAccountOffer(offerDetails))
        },
    }
}

export default connect(mapStateToProps, mapDispatchtoProps)(Offer)