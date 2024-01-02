import axiosInstance from "../../../AxiosInterceptor";

const GET_TUTOR_SCHEDULE = "/booking/schedules";
const ADD_TUTOR_SCHEDULE = "/booking/schedule";
const DELETE_SLOT = "/booking/schedule";

const getTutorSchedule = (from_date, to_date) => {
  const data = {
    from_date: from_date,
    to_date: to_date
  };

  const url = `${GET_TUTOR_SCHEDULE}`;
  return axiosInstance.post(url, data);
};

const addTutorSchedule = (
  from_date,
  to_date,
  from_time,
  to_time,
  week_day,
  userTimeZone
) => {
  const data = {
    from_date: from_date,
    to_date: to_date,
    from_time: from_time,
    to_time: to_time,
    week_day: week_day,
    timezone: userTimeZone
  };

  const url = `${ADD_TUTOR_SCHEDULE}`;
  return axiosInstance.post(url, data);
};

const deleleTutorSlot = (id) => {
  return axiosInstance.delete(`${DELETE_SLOT}/${id}`);
};

export const tutorScheduleService = {
  getTutorSchedule,
  addTutorSchedule,
  deleleTutorSlot
};
