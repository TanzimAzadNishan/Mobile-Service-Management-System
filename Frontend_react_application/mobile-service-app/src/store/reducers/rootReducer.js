import {combineReducers} from 'redux'

import authReducer from './authReducer'
import dashboardReducer from './dashboardReducer'
import adminReducer from './adminReducer'
import adminDashboardReducer from './adminDashboardReducer'
import packageReducer from './Service/packageReducer'
import flexiplanReducer from './Service/flexiplanReducer'
import connectionReducer from './Service/connectionReducer'
import historyReducer from './historyReducer'
import fnfReducer from './Service/fnfReducer'
import feedbackReducer from './Service/feedbackReducer'

const rootReducer = combineReducers({
    auth: authReducer,
    dashboard: dashboardReducer,
    admin: adminReducer,
    adminDashboard: adminDashboardReducer,
    package: packageReducer,
    fnf: fnfReducer,
    flexiplan: flexiplanReducer,
    connectWithOthers: connectionReducer,
    history: historyReducer,
    feedback: feedbackReducer
})

export default rootReducer