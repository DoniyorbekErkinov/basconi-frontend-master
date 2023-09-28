import ApiService from "../../../services/api.service";

const ProductService = {
    getItemsList(payload, search) {
        return ApiService.post(`/api/item/list-search?keyword=${search}`, payload)
    },
    getEmptyForm() {
        return ApiService.get(`/api/item/list`)
    },
    createItem(data) {
        return ApiService.post(`/api/item/save`, data)
    },
    updateItem(data) {
        return ApiService.put(`/api/item/update`, data )
    },
    deleteItem(id) {
        return ApiService.delete(`/api/item/delete/${id}`)
    },
    getReferenceUnit() {
        return ApiService.get(`/api/unit/list`)
    },
    getReferenceBrand() {
        return ApiService.get(`/api/brand/getAllActive`)
    },
    generateSku(categoryId) {
        return ApiService.get(`/api/item/generate-sku-code-desc/${categoryId}`)
    },
    generateBarcode() {
        return ApiService.get(`/api/item/generate-code128-barcode`)
    }
}

export default ProductService
