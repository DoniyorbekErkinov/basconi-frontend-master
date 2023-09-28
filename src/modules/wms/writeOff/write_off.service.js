import ApiService from "../../../services/api.service";

const WriteOfService = {

    getWriteOfDocs(keyword, payload) {
        return ApiService.post(`/api/writeOff/list-search?keyword=${keyword}`, payload)
    },
    createWriteOfDoc() {
        return ApiService.get(`/api/writeOff/createEmptyDoc`)
    },
    saveWriteOfDoc(data) {
        return ApiService.post(`/api/writeOff/save`, data)
    },
    getWriteOfDocById(id) {
        return ApiService.get(`/api/writeOff/getDocById/${id}`)
    },
    deleteWriteOfDoc(id) {
        return ApiService.delete(`/api/writeOff/delete/${id}`)
    }

}

export default WriteOfService
