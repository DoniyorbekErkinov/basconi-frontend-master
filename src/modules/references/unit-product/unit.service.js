import ApiService from "../../../services/api.service";

const UnitService = {

    getUnits() {
        return ApiService.get(`/api/unit/getAllActive`)
    },
    getUnitById(id) {
        return ApiService.get(`/api/unit/getById/${id}`)
    },
    createUnit(data) {
        return ApiService.post(`/api/unit/save`, data)
    },
    updateUnit(data) {
        return ApiService.put(`/api/unit/update`, data)
    },
    deleteUnit(id) {
        return ApiService.delete(`/api/unit/delete/${id}`)
    }

}

export default UnitService
