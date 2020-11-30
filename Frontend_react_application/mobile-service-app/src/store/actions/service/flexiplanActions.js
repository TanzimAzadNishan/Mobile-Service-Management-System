import flexiplanService from '../../../utilities/Services/Service/flexiplanService'

export const updateAccountInfo = (planDetails) => {
    return() => {
        flexiplanService.updateAccount(planDetails)
    }
}
