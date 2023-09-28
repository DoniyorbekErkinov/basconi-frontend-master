import ApiService from "../../../services/api.service";

const RequestService = {

    getSendDocs(payload) {
        return ApiService.post(`api/petition/list-send`, payload)
    },
    getReceivedDocs(payload) {
        return ApiService.post(`api/petition/list-accept`, payload)
    },
    createTransferDoc() {
        return ApiService.get(`/api/petition/createEmptyDoc`)
    },
    saveTransferDoc(data) {
        return ApiService.post(`/api/petition/send`, data)
    },
    saveIncomeTransferDoc(data) {
        return ApiService.post(`/api/petition/accept`, data)
    },
    getTransferDocById(id) {
        return ApiService.get(`/api/petition/getByIdWithItems/${id}`)
    },
    deleteTransferDoc(id) {
        return ApiService.delete(`/api/transfer/delete/${id}`)
    }

}

export default RequestService
