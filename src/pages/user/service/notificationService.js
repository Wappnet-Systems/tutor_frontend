import axiosInstance from "../../../AxiosInterceptor";

const GET_ALL_NOTIFICATION = "notification";
const READ_ALL_NOTIFICATION = "/notification/all";
const DELETE_ALL_NOTIFICATION = "/notification/all";
const READ_NOTIFICATION = "notification";
const DELETE_NOTIFICATION = "notification";
const GET_UNREAD_NOTIFICATION = "notification";

const getAllNotification = (limit, sort, page) => {
  const url = `${GET_ALL_NOTIFICATION}?limit=${limit}&sort=${sort}&page=${page}`;
  return axiosInstance.get(url);
};

const readAllNotifications = () => {
  const url = `${READ_ALL_NOTIFICATION}`;
  return axiosInstance.post(url);
};

const getUnreadNotification = (id) => {
  const url = `${GET_UNREAD_NOTIFICATION}/${id}`;
  return axiosInstance.get(url);
};

const deleteAllNotifications = () => {
  const url = `${DELETE_ALL_NOTIFICATION}`;
  return axiosInstance.delete(url);
};

const readNotification = (id) => {
  const url = `${READ_NOTIFICATION}/${id}`;
  return axiosInstance.put(url);
};

const deleteNotification = (id) => {
  const url = `${DELETE_NOTIFICATION}/${id}`;
  return axiosInstance.delete(url);
};

export const notificationService = {
  getAllNotification,
  readAllNotifications,
  deleteAllNotifications,
  readNotification,
  deleteNotification,
  getUnreadNotification
};
