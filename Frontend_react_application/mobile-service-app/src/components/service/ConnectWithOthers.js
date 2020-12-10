import React, { Component } from 'react'
import { connect } from 'react-redux'
import {Redirect} from 'react-router-dom'
import NProgress from 'nprogress'
import Modal from 'react-modal'
import '../../styles/service/ConnectStyle.css'
//import {socket} from '../../utilities/SocketIOClient'
import {
    validateMobileNumber
} from '../../utilities/Validators/AuthValidator'
import {
    validatePoints
} from '../../utilities/Validators/DashboardValidator'
import {
    retrieveConnectionList, createNewConnection, acceptLinkRequest, 
    discardLinkRequest, sendPointRequest, transferPoint, deleteAcceptedLink
} from '../../store/actions/service/connectionActions'



/*const initialState = {
    Mobile_Number: {
        value: '',
        error: ''
    },
    Point: {
        value: '',
        error: ''
    },
    activeModal: ''
}*/

class ConnectWithOthers extends Component{
    constructor(props){
        super(props);
        NProgress.start();
        NProgress.configure({ ease: 'ease', speed: 500 });

        //this.state = initialState
        this.state = {
            Mobile_Number: {
                value: '',
                error: ''
            },
            Point: {
                value: '',
                error: ''
            },
            ModalState: {
                linkedNumber: '',
                linkedName: '',
                points: '',
                linkId: ''
            },
            activeModal: ''
        }

        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    componentDidMount(){
        this.props.retrieveConnectionList({
            from: this.props.auth.mobile_number
        })
    }

    openModal (name, linkedNumber, linkedName, points, linkId) {
        this.setState(state => ({
            Mobile_Number: {
                value: '',
                error: ''
            },
            Point: {
                value: '',
                error: ''
            },
            ModalState: {
                linkedNumber: linkedNumber,
                linkedName: linkedName,
                points: points,
                linkId: linkId
            },
            activeModal: name
        }));
    }
    closeModal () {
        this.setState({activeModal: ''}); 
    }

    acceptLinkRequest = (linkedName, linkedNumber, evt)=>{
        evt.preventDefault();
        console.log(linkedName)
        var info = {
            from: this.props.auth.mobile_number,
            to: linkedNumber,
            prev: 'P'
        }
        this.props.acceptLinkRequest(info)
        this.closeModal()
    }

    deleteAcceptedLink = (evt, linkedNumber, linkType)=>{
        this.closeModal()
        evt.preventDefault();
        var info = {
            from: this.props.auth.mobile_number,
            to: linkedNumber,
            type: linkType
        }
        this.props.deleteAcceptedLink(info)
    }

    discardRequest = (evt, linkedNumber, linkType, linkId)=>{
        this.closeModal()
        evt.preventDefault();
        var info = {
            from: this.props.auth.mobile_number,
            to: linkedNumber,
            type: linkType,
            linkId: linkId
        }
        console.log('discard : ', info)
        this.props.discardLinkRequest(info)
    }

    handlePointRequest = (evt, linkedNumber)=>{
        console.log('clicked')
        evt.preventDefault();
        const { Point } = this.state;
        const pointError = validatePoints(Point.value)

        if ([pointError].every(e => e === false)){
            console.log('point request form submitted successfully')
            //document.getElementById('Point').blur()

            var info = {
                from: this.props.auth.mobile_number,
                to: linkedNumber,
                points: Point.value,
                link_type: 'PR'
            }

            this.props.sendPointRequest(info)
            this.closeModal()

            this.setState(state => ({
                Mobile_Number: {
                    value: '',
                    error: ''
                },
                Point: {
                    value: '',
                    error: ''
                },
                ModalState: {
                    linkedNumber: '',
                    linkedName: '',
                    points: '',
                    linkId: ''
                },
                activeModal: ''
            }));
        }
        else{
            console.log(pointError)

            // update the state with errors
            this.setState(state => ({
                Mobile_Number: {
                    ...state.Mobile_Number,
                    error: ''
                },
                Point: {
                    ...state.Point,
                    error: pointError
                },
                ModalState: {
                    linkedNumber: linkedNumber,
                    linkedName: '',
                    points: '',
                    linkId: ''
                },
                activeModal: 'collect-points-modal'
            }));
        }
    }

    transferPoint = (evt, linkedNumber, linkId)=>{
        evt.preventDefault();
        const { Point } = this.state;
        var pointError = validatePoints(Point.value)

        if ([pointError].every(e => e === false)){
            console.log('point request form submitted successfully')
            //document.getElementById('Point').blur()

            var info = {
                from: this.props.auth.mobile_number,
                to: linkedNumber,
                points: Point.value,
                link_type: 'PR',
                linkId: linkId
            }

            //if(this.props.accountInfo.POINTS >= Number(Point.value) + 50){
                console.log('before transfer : ', info)
                
                this.props.transferPoint(info)
                this.setState(state => ({
                    Mobile_Number: {
                        value: '',
                        error: ''
                    },
                    Point: {
                        value: '',
                        error: ''
                    },
                    ModalState: {
                        linkedNumber: '',
                        linkedName: '',
                        points: '',
                        linkId: ''
                    },
                    activeModal: ''
                }));
            //}
            /*else{
                pointError = 'Your account must have atleast 50 points'
                this.setState(state => ({
                    Mobile_Number: {
                        ...state.Mobile_Number,
                        error: ''
                    },
                    Point: {
                        ...state.Point,
                        error: pointError
                    },
                    ModalState: {
                        linkedNumber: this.state.ModalState.linkedNumber,
                        linkedName: this.state.ModalState.linkedName,
                        points: this.state.ModalState.points,
                        linkId: this.state.ModalState.linkId
                    },
                    activeModal: 'give-points-modal'
                }));
            }*/
        }
        else{
            console.log(pointError)

            // update the state with errors
            this.setState(state => ({
                Mobile_Number: {
                    ...state.Mobile_Number,
                    error: ''
                },
                Point: {
                    ...state.Point,
                    error: pointError
                },
                ModalState: {
                    linkedNumber: this.state.ModalState.linkedNumber,
                    linkedName: this.state.ModalState.linkedName,
                    points: this.state.ModalState.points,
                    linkId: this.state.ModalState.linkId
                },
                activeModal: 'give-points-modal'
            }));
        }
    }

    handleChange = (evt, validationFunc)=>{
        const field = evt.target.id
        const fieldVal = evt.target.value;

        //console.log(field, ' ---> ', fieldVal)

        this.setState(state => ({
          [field]: {
            ...state[field],
            value: fieldVal,
            error: validationFunc(fieldVal)
          }
        }));
    }
    handlePointChange = (evt)=>{
        const fieldVal = evt.target.value;
        console.log(fieldVal)
        console.log(evt.target.id)
        this.setState(state => ({
            Mobile_Number: {
                value: '',
                error: ''
            },
            Point: {
                value: fieldVal,
                error: validatePoints(fieldVal)
            },
            activeModal: this.state.activeModal
        }));
    }

    handleConnection = (evt)=>{
        evt.preventDefault();
        const { Mobile_Number } = this.state;
        var mobError = validateMobileNumber(Mobile_Number.value);

        if ([mobError].every(e => e === false)){
            console.log('connection form submitted successfully')
            document.getElementById('Mobile_Number').blur()

            var connInfo = {
                from: this.props.auth.mobile_number,
                to: Mobile_Number.value,
                link_type: 'P'
            }

            if(this.props.auth.mobile_number === connInfo.to){
                mobError = 'This is your mobile number!'
                this.setState(state => ({
                    Mobile_Number: {
                        ...state.Mobile_Number,
                        error: mobError
                    },
                    Point: {
                        ...state.Point,
                        error: ''
                    },
                    
                    ModalState: {
                        linkedNumber: '',
                        linkedName: '',
                        points: '',
                        linkId: ''
                    },
                    activeModal: ''
                }));
            }
            else{
                this.props.createNewConnection(connInfo)
                this.setState(state => ({
                    Mobile_Number: {
                        value: '',
                        error: ''
                    },
                    Point: {
                        value: '',
                        error: ''
                    },
                    ModalState: {
                        linkedNumber: '',
                        linkedName: '',
                        points: '',
                        linkId: ''
                    },
                    activeModal: ''
                }));
            }

        }

        else{
            console.log(mobError)

            // update the state with errors
            this.setState(state => ({
                Mobile_Number: {
                    ...state.Mobile_Number,
                    error: mobError
                },
                Point: {
                    ...state.Point,
                    error: ''
                },
                ModalState: {
                    linkedNumber: '',
                    linkedName: '',
                    points: '',
                    linkId: ''
                },
                activeModal: ''
            }));
        }
    }

    render() {
        if (this.props.auth == null){
            console.log('redirected')
            return <Redirect to='/' />
        }

        else{
            NProgress.done()
            var acceptedList = null
            var pendingList = null

            //console.log('points: ', this.state.Point.value)

            if(this.props.connectionList){
            const acceptedConnectionsList = this.props.connectionList.list.map((item, index) =>{
                return(item.linkType === 'A')?(
                <div key={index}>
                    <div 
                        className="card"
                    >
                        <div className="card-title"
                            onClick = {() => this.openModal('collect-points-modal',
                            item.linkedNumber, '', '', item.linkId)}
                        >
                            {item.linkedName}
                        </div>
                        <div className="card-subtitle"
                            onClick = {() => this.openModal('collect-points-modal',
                            item.linkedNumber, '', '', item.linkId)}
                        >
                            {item.linkedNumber}
                        </div>

                        <button 
                            className="waves-effect waves-light btn-small delete-btn"
                            onClick={(evt)=>{this.deleteAcceptedLink(evt, 
                                item.linkedNumber, item.linkType)}}
                        >
                            Delete
                        </button>
                    </div>

                </div>
                ) : (
                    <div key={index}>
                    </div>
                )
            })

            acceptedList = (acceptedConnectionsList.length > 0) 
            ? acceptedConnectionsList
            : (
                <div className="no-accepted-connections">
                    You are not connected with anybody
                </div>
            )

            const pendingConnectionList = this.props.connectionList.pendingList.map((item, index) =>{
                return(item.linkType === 'P') 
                ? (
                
                <div key={index}>
                <div 
                    className="single-req"
                >
                    <div className="mob-num"
                        onClick = {() => this.openModal('accept-req-modal',
                        item.linkedNumber, item.linkedName, '', item.linkId)}
                    >
                        {item.linkedNumber}
                    </div>
                    <div className="name"
                        onClick = {() => this.openModal('accept-req-modal',
                        item.linkedNumber, item.linkedName, '', item.linkId)}
                    >
                        ({item.linkedName})
                    </div>

                    <button 
                        className="waves-effect waves-light btn-small discard-btn"
                        onClick={(evt)=>{this.discardRequest(evt, item.linkedNumber,
                            item.linkType)}}
                    >
                        Discard
                    </button>
                </div>

                </div>

                ) : (
                    (item.linkType === 'PR') ? (
                        <div key={index}>
                            <div 
                                className="single-req"
                            >
                                <div className="mob-num"
                                    onClick = {() => this.openModal('give-points-modal',
                                    item.linkedNumber, '', item.points, item.linkId)}
                                >
                                    {item.linkedNumber}
                                </div>
                                <div className="name"
                                    onClick = {() => this.openModal('give-points-modal',
                                    item.linkedNumber, '', item.points, item.linkId)}
                                >
                                    ({item.linkedName})
                                </div>

                                <button 
                                    className="waves-effect waves-light btn-small discard-btn"
                                    onClick={(evt)=>{this.discardRequest(evt, item.linkedNumber,
                                        item.linkType, item.linkId)}}
                                >
                                    Discard
                                </button>
                            </div>

                        </div>
                    ) : null
                )
            })

            //console.log(pendingConnectionList.length)
            //console.log(pendingConnectionList[0])
            //console.log(pendingConnectionList)

            pendingList = (pendingConnectionList.length > 0) 
            ? pendingConnectionList 
            : (
                <div className="no-pending-requests">
                    You have no pending requests
                </div>
            )
            }

            return (
                <>
                    <div className="connect-page-title">
                        Connect With Others
                    </div>

                    <div className="connection-details">

                        <div className="left-section">
                            <div className="left-section-title">
                                Your Connection List
                            </div>

                            <div className="connection-list">
                                {acceptedList}

                                <Modal
                                    className = "collect-points-modal"
                                    isOpen={this.state.activeModal === 'collect-points-modal'} 
                                    ariaHideApp={false}    
                                >

                                    <div className="modal-title">
                                        Ask For Points
                                    </div>

                                    <div className="interact-mob-num">
                                        From:  {this.state.ModalState.linkedNumber}
                                    </div>

                                    <div className="input-field">
                                        <i 
                                            className="material-icons prefix"
                                            style={this.state.Point.error ? ({color: "red"}):(null)}
                                        >
                                            redeem
                                        </i>
                                        <input type="text" id={this.state.ModalState.linkId}
                                            className="validate"
                                            style={this.state.Point.error ? ({color: "red"}):(null)}
                                            value={this.state.Point.value}
                                            onChange={(e)=>{this.handlePointChange(e)}} 
                                        />

                                        <label 
                                            htmlFor="points"
                                            style={this.state.Point.error ? ({color: "red"}):(null)} 
                                        > 
                                            Points
                                        </label>
                                        <div style={{color: "red"}}>
                                            {this.state.Point.error}
                                        </div>
                                    </div>


                                    <div className="btn-part">
                                        <button 
                                            className="btn-small req-btn"
                                            onClick={(evt)=>{this.handlePointRequest(evt,
                                                this.state.ModalState.linkedNumber)}}
                                        >
                                            Send Request
                                        </button>

                                        <button 
                                            className ='close-collect-points-modal btn-small exit-btn' 
                                            onClick={this.closeModal}
                                        >
                                            Exit
                                        </button>
                                    </div>

                                </Modal>

                            </div>

                        </div>

                        <div className="right-section">
                            <div className="right-section-title">
                                Create New Connection
                            </div>

                            <div className="create-connection">
                                <div className="card">
                                    <div className="card-content">
                                        <form onSubmit={this.handleConnection}>
                                        <div className="input-field">

                                            <i 
                                                className="material-icons prefix"
                                                style={this.state.Mobile_Number.error ? ({color: "red"}):(null)} 
                                            >
                                                settings_cell
                                            </i>
                                            <input type="text" id="Mobile_Number"
                                                className="validate"
                                                style={this.state.Mobile_Number.error ? ({color: "red"}):(null)}
                                                value={this.state.Mobile_Number.value}
                                                onChange={(e)=>{this.handleChange(e, validateMobileNumber)}}
                                            />

                                            <label htmlFor="mobile-number" 
                                                className="active"
                                                style={this.state.Mobile_Number.error ? ({color: "red"}):(null)}
                                            > 
                                                Mobile Number
                                            </label>

                                            <div style={{color: "red"}}>
                                                {this.state.Mobile_Number.error}
                                            </div>
                                            <div style={{color: "red"}}>
                                                {this.props.connectionErr}
                                            </div>

                                        </div>
                                    
                                        <button 
                                            className="waves-effect waves-light btn-small req-btn"
                                            type="submit"
                                        >
                                            Send Request
                                        </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        
                            <div className="all-requests-title">
                                Pending Requests
                            </div>

                            <div className="all-requests-part">
                                <div className="card">
                                    <div className="card-content">
                                        {pendingList}
                                    
                                        <Modal
                                            className = "accept-req-modal"
                                            isOpen={this.state.activeModal === 'accept-req-modal'} 
                                            ariaHideApp={false}    
                                        >
                                            <div className="modal-title">
                                                Connection Request
                                            </div>

                                            <div className="name">
                                                {this.state.ModalState.linkedName}
                                            </div>
                                            <div className="mob-num">
                                                {this.state.ModalState.linkedNumber}
                                            </div>

                                            <div className="btn-part">
                                                <button 
                                                    className="btn-small req-btn"
                                                    onClick={(evt)=>{this.acceptLinkRequest(
                                                        this.state.ModalState.linkedName,
                                                        this.state.ModalState.linkedNumber, evt)}}
                                                >
                                                    Accept
                                                </button>

                                                <button 
                                                    className ='close-accept-req-modal btn-small exit-btn' 
                                                    onClick={this.closeModal}
                                                >
                                                    Exit
                                                </button>
                                            </div>

                                        </Modal>

                                        <Modal
                                            className = "give-points-modal"
                                            isOpen={this.state.activeModal === 'give-points-modal'} 
                                            ariaHideApp={false}    
                                        >

                                            <div className="modal-title">
                                                Request For Points
                                            </div>

                                            <div style={{textAlign: 'center'}}>
                                            <div className="interact-mob-num">
                                                {this.state.ModalState.linkedNumber}
                                            </div>
                                            <div style={{
                                                display: "inline-block", paddingRight: '2%',
                                                fontWeight: '500', fontSize: '1.2rem'
                                            }}
                                            > 
                                                requested for 
                                            </div>
                                            <div style={{display: "inline-block", paddingRight: '2%', 
                                                color: '#FF5733', fontWeight: '500', fontSize: '1.2rem'
                                            }}> 
                                                {this.state.ModalState.points} 
                                            </div>
                                            <div style={{display: "inline-block",
                                                fontWeight: '500', fontSize: '1.2rem'
                                            }}
                                            > 
                                                points 
                                            </div>
                                            <div className="question">
                                                How many points you want to give?
                                            </div>
                                            </div>

                                            <div className="input-field">

                                                <i 
                                                    className="material-icons prefix"
                                                    style={this.state.Point.error ? ({color: "red"}):(null)}  
                                                >
                                                    redeem
                                                </i>
                                                <input type="text" id={this.state.ModalState.linkId}
                                                    className="validate"
                                                    style={this.state.Point.error ? ({color: "red"}):(null)}
                                                    value={this.state.Point.value}
                                                    onChange={(e)=>{this.handlePointChange(e)}}  
                                                />

                                                <label 
                                                    htmlFor="points"
                                                    style={this.state.Point.error ? ({color: "red"}):(null)}  
                                                > 
                                                    Points
                                                </label>

                                                <div style={{color: "red"}}>
                                                    {this.state.Point.error}
                                                </div>

                                                <div style={{color: "red"}}>
                                                    {this.props.pointTransferErr}
                                                </div>
                                            </div>

                                            <div className="btn-part">
                                                <button 
                                                    className="btn-small req-btn"
                                                    onClick={(evt)=>{this.transferPoint(evt, 
                                                        this.state.ModalState.linkedNumber, 
                                                        this.state.ModalState.linkId)}}
                                                >
                                                    Transfer
                                                </button>

                                                <button 
                                                    className ='close-give-points-modal btn-small exit-btn' 
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
    return {
      auth: state.auth.auth,
      connectionList: state.connectWithOthers.connectionList,
      accountInfo: state.dashboard.accountInfo,
      connectionErr: state.connectWithOthers.connectionErr,
      pointTransferErr: state.connectWithOthers.pointTransferErr
    }
}

const mapDispatchtoProps = (dispatch)=>{
    return{
        retrieveConnectionList: (connInfo)=>{
            dispatch(retrieveConnectionList(connInfo))
        },
        createNewConnection: (info)=>{
            dispatch(createNewConnection(info))
        },
        acceptLinkRequest: (info)=>{
            dispatch(acceptLinkRequest(info))
        },
        discardLinkRequest: (info)=>{
            dispatch(discardLinkRequest(info))
        },
        sendPointRequest: (info)=>{
            dispatch(sendPointRequest(info))
        },
        transferPoint: (info)=>{
            dispatch(transferPoint(info))
        },
        deleteAcceptedLink: (info)=>{
            dispatch(deleteAcceptedLink(info))
        }
    }
}

export default connect(mapStateToProps, mapDispatchtoProps)(ConnectWithOthers)