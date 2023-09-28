import ApiService from "../../../services/api.service";

const SeasonService = {
    getSeasons() {
        return ApiService.get(`/api/seasons/getAllActive`)
    },
    getSeasonById(id) {
        return ApiService.get(`/api/seasons/getById/${id}`)
    },
    createSeason(data) {
        return ApiService.post(`/api/seasons/save`, data)
    },
    updateSeason(data) {
        return ApiService.put(`/api/seasons/update`, data)
    },
    deleteSeason(id) {
        return ApiService.delete(`/api/seasons/delete/${id}`)
    }

}

export default SeasonService
