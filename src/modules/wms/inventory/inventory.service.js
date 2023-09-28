import ApiService from "../../../services/api.service";

const InventoryService = {
    getDepartments() {
        return ApiService.get(`/api/v.1/department/get/all`)
    },
    getUsersList() {
        return ApiService.get(`/api/user/getActive`)
    },
    getUsersByDepId(id) {
        return ApiService.get(`/api/user/getByDepId/${id}`)
    },
    getProductsForm() {
        return ApiService.get(`/api/item/list`)
    },
    createInventorDoc() {
        return ApiService.get(`/api/invDocument/createEmptyDoc`)
    }
}

export default InventoryService