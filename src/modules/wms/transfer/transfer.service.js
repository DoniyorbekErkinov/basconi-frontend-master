import ApiService from "../../../services/api.service";

const TransferService = {
    getSendDocs(keyword, payload) {
        return ApiService.post(`api/transfer/searchBySend?keyword=${keyword}`, payload)
    },
    getReceivedDocs(keyword, payload) {
        return ApiService.post(`api/transfer/searchByAccepted?keyword=${keyword}`, payload)
    },
    getPendingDocs(keyword, payload) {
        return ApiService.post(`api/transfer/searchByPending?keyword=${keyword}`, payload)
    },
    createTransferDoc() {
        return ApiService.get(`/api/transfer/createEmptyDoc`)
    },
    saveTransferDoc(data) {
        return ApiService.post(`/api/transfer/save`, data)
    },
    saveIncomeTransferDoc(data) {
        return ApiService.post(`/api/transfer/acceptIncomeWarehouseDoc`, data)
    },
    getTransferDocById(id) {
        return ApiService.get(`/api/transfer/getDocById/${id}`)
    },
    deleteTransferDoc(id) {
        return ApiService.delete(`/api/transfer/delete/${id}`)
    }
}

export default TransferService
