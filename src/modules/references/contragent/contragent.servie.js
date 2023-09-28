import ApiService from "../../../services/api.service";

const ContragentService = {
    getContragents() {
        return ApiService.get(`/api/contragent/getAllActive`)
    },
    getContragentsById(id) {
        return ApiService.get(`/api/contragent/getById/${id}`)
    },
    createContragents(data) {
        return ApiService.post(`/api/contragent/save`, data)
    },
    updateContragents(data) {
        return ApiService.put(`/api/contragent/update`, data)
    },
    deleteContragents(id) {
        return ApiService.delete(`/api/contragent/delete/${id}`)
    }

}

export default ContragentService
