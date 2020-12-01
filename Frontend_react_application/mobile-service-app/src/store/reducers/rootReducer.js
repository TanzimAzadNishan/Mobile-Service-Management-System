import {combineReducers} from 'redux'

import authReducer from './authReducer'
import dashboardReducer from './dashboardReducer'
import adminReducer from './adminReducer'
import adminDashboardReducer from './adminDashboardReducer'
import packageReducer from './Service/packageReducer'
import flexiplanReducer from './Service/flexiplanReducer'
import connectionReducer from './Service/connectionReducer'

const rootReducer = combineReducers({
    auth: authReducer,
    dashboard: dashboardReducer,
    admin: adminReducer,
    adminDashboard: adminDashboardReducer,
    package: packageReducer,
    flexiplan: flexiplanReducer,
    connectWithOthers: connectionReducer
})

export default rootReducer