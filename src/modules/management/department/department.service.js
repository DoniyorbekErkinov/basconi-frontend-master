import ApiService from "../../../services/api.service";

const DepartmentService = {

    getDepartmentsList() {
        return ApiService.get(`/api/v.1/department/get/all`)
    },
    getDepByAccess() {
        return ApiService.get(`/api/v.1/department/getAccessibleDep`)
    },
    getEmptyForm() {
        return ApiService.get(`/api/v.1/department/get/empty`)
    },
    getDepById(id) {
        return ApiService.get(`/api/v.1/department/get/${id}`)
    },
    createDepartment(data) {
        return ApiService.post(`/api/v.1/department/create`, data)
    },
    updateDepartment(data) {
        return ApiService.put(`/api/v.1/department/update/${data.id}`, data)
    },
    deleteDepartment(id) {
        return ApiService.delete(`/api/v.1/department/delete/${id}`)
    }

}

export default DepartmentService
