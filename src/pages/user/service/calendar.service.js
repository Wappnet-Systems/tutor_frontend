import axiosInstance from "../../../AxiosInterceptor";
const CALENDAR_URL = "/booking/calendar";

const getCalendarData = () => {
  return axiosInstance.get(`${CALENDAR_URL}`);
};

export const calendarService = {
  getCalendarData,
};
