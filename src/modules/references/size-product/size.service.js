import ApiService from "../../../services/api.service";

const SizeService = {
    getSizes() {
        return ApiService.get(`/api/size/getAllActive`)
    },
    getSizeById(id) {
        return ApiService.get(`/api/size/getById/${id}`)
    },
    createSize(data) {
        return ApiService.post(`/api/size/save`, data)
    },
    updateSize(data) {
        return ApiService.put(`/api/size/update`, data)
    },
    deleteSize(id) {
        return ApiService.delete(`/api/size/delete/${id}`)
    }

}

export default SizeService
