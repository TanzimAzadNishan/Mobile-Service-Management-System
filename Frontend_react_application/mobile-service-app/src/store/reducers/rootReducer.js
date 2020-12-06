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
import offerReducer from './Service/offerReducer'
import feedbackReducer from './Service/feedbackReducer'
import rechargeReducer from './Service/rechargeReducer'
import personFNFReducer from './Service/personFNFReducer'

const rootReducer = combineReducers({
    auth: authReducer,
    dashboard: dashboardReducer,
    admin: adminReducer,
    adminDashboard: adminDashboardReducer,
    package: packageReducer,
    fnf: fnfReducer,
    offer: offerReducer,
    flexiplan: flexiplanReducer,
    connectWithOthers: connectionReducer,
    history: historyReducer,
    feedback: feedbackReducer,
    recharge: rechargeReducer,
    personFNF: personFNFReducer
})

export default rootReducer