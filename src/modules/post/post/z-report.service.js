import ApiService from "../../../services/api.service";

const ZReportService = {
    CheckZetReport(departmentId, cashBoxId) {
        return ApiService.get(`/api/zet_report/getZet/${departmentId}/${cashBoxId}`)
    },
    CreateZ_Report(data) {
        return ApiService.post(`/api/zet_report/create`, data)
    },
    CloseZReport(data) {
        return ApiService.post(`/api/zet_report/close-Zet-Report`, data)
    },
    get_Zet_List() {
        return ApiService.get(`/api/zet_report/listZet`)
    },
    get_Zet_List_With_Sale_List(zetId) {
        return ApiService.get(`/api/zet_report/saleWithZetId/${zetId}`)
    },
    getDateWithDate(data) {
        return ApiService.post(`/api/zet_report/list-search`, data)
    },
    getInfo(zetId) {
        return ApiService.post(`/api/zet_report/get-information/${zetId}`)
    }
}

export default ZReportService