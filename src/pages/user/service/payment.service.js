import axiosInstance from "../../../AxiosInterceptor";
const PAYMENT_URl = "/payment";

const getPaymentIntent = (booking_id) => {
    return axiosInstance.get(`${PAYMENT_URl}/${booking_id}`);
};

export const paymentService = {
    getPaymentIntent
}