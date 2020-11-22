import {combineReducers} from 'redux'

import authReducer from './authReducer'
import dashboardReducer from './dashboardReducer'
import adminReducer from './adminReducer'
import packageReducer from './Service/packageReducer'

const rootReducer = combineReducers({
    auth: authReducer,
    dashboard: dashboardReducer,
    admin: adminReducer,
    package: packageReducer
})

export default rootReducer