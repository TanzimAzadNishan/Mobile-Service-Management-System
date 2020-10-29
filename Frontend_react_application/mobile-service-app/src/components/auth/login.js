import React, { Component } from 'react'
import { connect } from 'react-redux'
import {Redirect, NavLink} from 'react-router-dom'
import {createAccount} from '../../store/actions/authActions'
import '../../styles/SignupStyle.css'
import {
    validateMobileNumber, validatePassword
} from '../../utilities/Validators/SignupValidator'
import NProgress from 'nprogress'

const initialState = {
    Mobile_Number: {
        value: '',
        validateOnChange: false,
        error: ''
    },
    Password: {
        value: '',
        validateOnChange: false,
        error: ''
    },
    submitCalled: false,
    allFieldsValidated: false
}