import ApiService from "../../../services/api.service";

const CashBoxService = {
    createCashbox(data) {
        return ApiService.post(`/api/cashbox/create`, data)
    },
    getCashboxById(id) {
        return ApiService.get(`/api/cashbox/getById/${id}`)
    },
    getByDebId(depId) {
      return ApiService.get(`/api/cashbox/getByCurrentDep/${depId}`)
    },
    updateCashbox(data) {
        return ApiService.put(`/api/cashbox/update`, data)
    },
    deleteCashbox(id) {
        return ApiService.delete(`/api/cashbox/delete/${id}`)
    },
    getList() {
        return ApiService.get(`/api/cashbox/cashboxList`)
    }
}

export default CashBoxService
