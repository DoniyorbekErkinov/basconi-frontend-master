import ApiService from "../../../services/api.service";

const UsersService = {
    getUsersById(id) {
        return ApiService.get(`/api/user/getUserById/${id}`)
    },
    getUsersByDepId(id) {
        return ApiService.get(`/api/user/getByDepId/${id}`)
    },
    getUsersList() {
        return ApiService.get(`/api/user/getActive`)
    },
    createUser(data) {
        return ApiService.post(`/api/user/save`, data)
    },
    updateUser(data) {
        return ApiService.put(`/api/user/updateUser`, data)
    },
    updateStatusUser(id, status) {
        return ApiService.put(`/api/user/update-user-status/${id}?status=${status}`)
    },
    /*deleteUser(id) {
        return ApiService.delete(`/api/user/delete/${id}`)
    },*/
    updateUserPassword(data) {
        return ApiService.post(`/api/user/update-password`, data)
    },
    savePermDep(saleDepartments){
        return ApiService.post(`/api/user/add-departments`, saleDepartments)
    }
}

export default UsersService
