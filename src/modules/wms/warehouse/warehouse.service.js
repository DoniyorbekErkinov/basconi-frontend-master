import ApiService from "../../../services/api.service"

const WareHaseService = {
    getItemsDocs(search, payload) {
        return ApiService.post(`/api/item-status/list-search?keyword=${search}`, payload)
    },
    getItemsDocsForSaler(search, payload) {
        return ApiService.post(`/api/item-status/list-for-user?keyword=${search}`, payload)
    },
    getItemByDepId(depId, pagination) {
        return ApiService.post(`/api/item-status/getByDepId/${depId}`, pagination)
    },
    getItemByDepIdAndSearch(depId, search, pagination) {
        return ApiService.post(`/api/item-status/getByDepIdAndSearch/${depId}?search=${search}`, pagination)
    },
    getChosenItems(pagination) {
        return ApiService.post(`/api/item-status/getAllItemByReference`, pagination)
    }
}

export default WareHaseService
