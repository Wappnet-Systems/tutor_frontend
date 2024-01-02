import axiosInstance from "../../../AxiosInterceptor";

const BOOKING_DATA = "booking";
const UPDATED_REQUEST = "/booking/tutor";
const CANCEL_DATA = "booking";

const getBooking = (limit, sort, page, to_date, from_date, status) => {
  const filters = {
    to_date: to_date || undefined,
    from_date: from_date || undefined,
    status: status || undefined
  };

  const validFilters = Object.keys(filters)
    .filter((key) => filters[key] !== undefined)
    .map((key) => `${key}=${filters[key]}`)
    .join("&");

  const queryString = `${validFilters}${
    validFilters ? "&" : ""
  }limit=${limit}&sort=${sort}&page=${page}`;

  const url = `${BOOKING_DATA}?${queryString}`;
  return axiosInstance.get(url);
};

const updateRequest = ({ id, rejection_reason, status }) => {
  const requestBody = {
    status: status,
    rejection_reason: rejection_reason
  };

  return axiosInstance.put(`${UPDATED_REQUEST}/${id}`, requestBody);
};

const cancelRequest = (id) => {
  const url = `${CANCEL_DATA}/${id}`;
  return axiosInstance.put(url);
};

export const bookingService = {
  getBooking,
  updateRequest,
  cancelRequest
};
