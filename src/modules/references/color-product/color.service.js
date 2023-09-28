import ApiService from "../../../services/api.service";

const ColorService = {
    getColors() {
        return ApiService.get(`/api/color/getAllActive`)
    },
    getColorById(id) {
        return ApiService.get(`/api/color/getById/${id}`)
    },
    createColor(data) {
        return ApiService.post(`/api/color/save`, data)
    },
    updateColor(data) {
        return ApiService.put(`/api/color/update`, data)
    },
    deleteColor(id) {
        return ApiService.delete(`/api/color/delete/${id}`)
    }

}

export default ColorService
