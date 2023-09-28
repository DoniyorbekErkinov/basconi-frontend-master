import ApiService from "../../../services/api.service";

const BrandService = {
    getBrands() {
        return ApiService.get(`/api/brand/getAllActive`)
    },
    getBrandById(id) {
        return ApiService.get(`/api/brand/getById/${id}`)
    },
    createBrand(data) {
        return ApiService.post(`/api/brand/save`, data)
    },
    updateBrand(data) {
        return ApiService.put(`/api/brand/update`, data)
    },
    deleteBrand(id) {
        return ApiService.delete(`/api/brand/delete/${id}`)
    }

}

export default BrandService
