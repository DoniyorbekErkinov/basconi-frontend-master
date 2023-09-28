import ApiService from "../../../services/api.service";


const SaleService = {
    CreateEmptyDoc() {
        return ApiService.get(`api/sale/createEmptyDoc`)
    },
    saveSale(data) {
        return ApiService.post(`api/sale/save`, data)
    },
    getSaleList(data) {
        return ApiService.post(`api/whDocumentItem/list-searchByDate`, data)
    },
    getSaleDoc(data) {
        return ApiService.post(`api/sale/searchByDate`, data)
    },
    getSaleSuspendedList(data) {
        return ApiService.post(`api/sale/suspended`, data)
    },
    getSaleListById(id) {
        return ApiService.get(`api/sale/getDocById/${id}`)
    },
    deleteSaleDoc(id) {
        return ApiService.delete(`api/sale/delete/${id}`)
    },
    getByRegNumber(regNumber) {
        return ApiService.get(`api/whDocument/getByRegNumber?regNumber=${regNumber}`)
    },
    getReturnById(id) {
        return ApiService.get(`api/sale/getDocById/${id}`)
    },
    getDocById(id) {
        return ApiService.get(`api/whDocumentItem/itemsByDocId/${id}`)
    },
    returnItems(saleDocId,comment, data) {
        return ApiService.post(`api/whDocument/returnItem/${saleDocId}?comment=${comment}`, data)
    }
}

export default SaleService