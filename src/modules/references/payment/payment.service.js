import ApiService from "../../../services/api.service";

const PaymentService = {
    getPaymentList() {
        return ApiService.get(`api/paymentType/list`)
    },
    savePayment(data) {
        return ApiService.post(`api/paymentType/save`, data)
    },
    getPaymentBy(id) {
        return ApiService.get(`api/paymentType/getById/${id}`)
    }
}
export default PaymentService