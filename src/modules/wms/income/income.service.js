import ApiService from "../../../services/api.service";

const IncomeService = {
    getIncomeDocs(search, payload) {
        return ApiService.post(`/api/whDocument/list-search?keyword=${search}`, payload)
    },
    createIncomeDoc() {
        return ApiService.get(`/api/whDocument/createEmptyDoc`)
    },
    saveIncomeDoc(data) {
        return ApiService.post(`/api/whDocument/save`, data)
    },
    getIncomeDocById(id) {
        return ApiService.get(`/api/whDocument/getDocById/${id}`)
    },
    deleteIncomeDoc(id) {
        return ApiService.delete(`/api/whDocument/delete/${id}`)
    }
}

export default IncomeService
