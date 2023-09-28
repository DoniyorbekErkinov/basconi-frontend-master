import ApiService from "../../../services/api.service";

const RolesService = {

    getRoleList() {
        return ApiService.get(`/api/role/list`)
    },
    getRoleById(id) {
        return ApiService.get(`/api/role/get/${id}`)
    },
    getPermissionList() {
        return ApiService.get(`/api/permission/listPerm`)
    },
    createRole(data) {
        return ApiService.post(`/api/role/create`, data)
    },
    updateRole(id, data) {
        return ApiService.put(`/api/role/update/${id}`, data)
    },
    deleteRole(id) {
        return ApiService.delete(`/api/role/delete/${id}`)
    },

    // Permissions
    permissionsListByRoleId(roleId) {
        return ApiService.get(`/api/permission/list/by-role-id/${roleId}`)
    },
    savePermission(data) {
        return ApiService.post(`/api/role/create`, data)
    },
    updateRolePermissionsById(roleId, selected) {
        return ApiService.post(
            `/api/role/add-permissions/${roleId}`, selected
        );
    },

}

export default RolesService
