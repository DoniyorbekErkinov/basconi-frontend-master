import ApiService from "../../../services/api.service";

const CategoryService = {

    // getCategoryList(payload, search) {
    //     return ApiService.post(`/item-category/list-search?search=${search}`, payload)
    // },
    getCategory() {
        return ApiService.get(`/api/category/getAllActive`)
    },
    getCategoryById(id) {
        return ApiService.get(`/api/category/getById/${id}`)
    },
    // create
    createCategory(data) {
        return ApiService.post(`/api/category/save`, data)
    },
    updateItemCategory(data) {
        return ApiService.put(`/api/category/update`, data)
    },
    createItemCategory(data) {
        return ApiService.post(`/api/category/save`, data)
    },
    deleteItemCategory(id) {
        return ApiService.delete(`/api/category/delete/${id}`)
    }
}

export default CategoryService
