import {baseApi} from '../ApiControllers/apiCaller'

export default{
    getAdminInfo(adminInfo){
        return baseApi.post('/admin/get-info',adminInfo)
    },

    setNewPackage(newPkg){
        return baseApi.post('/admin/set-new-package',newPkg)
    },

    editPackage(editPkg){
        return baseApi.post('/admin/edit-package',editPkg)
    },

    deletePackage(editPkg){
        return baseApi.post('/admin/delete-package',editPkg)
    },

    setNewfnf(newfnf){
        return baseApi.post('/admin/set-new-fnf',newfnf)
    },

    editFnf(editfnf){
        return baseApi.post('/admin/edit-fnf',editfnf)
    },

    deletefnf(editfnf){
        return baseApi.post('/admin/delete-fnf',editfnf)
    },

    setNewOffer(newOffer){
        return baseApi.post('/admin/set-new-offer',newOffer)
    },

    editOffer(editedOffer){
        return baseApi.post('/admin/edit-offer',editedOffer)
    },

    deleteOffer(editedOffer){
        return baseApi.post('/admin/delete-offer',editedOffer)
    },
    onRetrieveFeedbackList(info){
        return baseApi.post('/retrieve-admin-feedback', info)
    }
}