import axiosInstance from "../../../AxiosInterceptor";

const ADD_REVIEWS = "review";

const addReviews = (data) => {
  return axiosInstance.post(`${ADD_REVIEWS}`, data);
};

export const reviewService = {
  addReviews,
};
