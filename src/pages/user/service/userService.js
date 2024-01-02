import axiosInstance from "../../../AxiosInterceptor";

const PROFILE_IMG_URL = "/user/profile-image";
const PERSONAL_DETAILS_URL = "/user/personal-details";
const COUNTRY_URL = "country";
const CITY_URL = "city";
const USER_DETAILS_URL = "/user";
const USER_EDUCATION = "/user/education";
const USER_CATEGORY = "/category";
const SUBJECT_URL = "/subject";
const ADD_SUBJECT_URL = "/user/subject";
const GET_SUBJECT_ID_URL = "/subject";
const GET_USER_MEDIA = "/user/media";
const ADD_USER_MEDIA = "/user/media";
const DELETE_USER_MEDIA = "/user/media";
const LANGUAGE = "/language";
const POSTCODE_URL = "/postcode";
const USER_VERIFICATION = "/user/verification";
const FEEDBACK_SUBJECT = "/feedback/subjects";
const ADD_FEEDBACK = "/feedback";

const updateProfileImage = (data) => {
  return axiosInstance.post(PROFILE_IMG_URL, data);
};

const updateUserDetails = (data) => {
  return axiosInstance.put(PERSONAL_DETAILS_URL, data);
};

const getCountries = () => {
  return axiosInstance.get(COUNTRY_URL);
};

const getCities = (country_id) => {
  return axiosInstance.get(`${CITY_URL}/${country_id}`);
};

const getUser = () => {
  return axiosInstance.get(`${USER_DETAILS_URL}`);
};

const getUserEducation = () => {
  return axiosInstance.get(`${USER_EDUCATION}`);
};

const addUserEducation = (userEducationObj) => {
  return axiosInstance.post(`${USER_EDUCATION}`, userEducationObj);
};

const getUserCategories = () => {
  return axiosInstance.get(`${USER_CATEGORY}`);
};

const getUserSubjects = (id) => {
  return axiosInstance.get(`${SUBJECT_URL}/${id}`);
};

const addSubjects = (data) => {
  return axiosInstance.post(`${ADD_SUBJECT_URL}`, data);
};

const getSubjects = () => {
  return axiosInstance.get(`${ADD_SUBJECT_URL}`);
};

const getSubjectsById = (id) => {
  return axiosInstance.get(`${GET_SUBJECT_ID_URL}/${id}`);
};

const updateUserEducation = (userEducationObj, id) => {
  return axiosInstance.put(`${USER_EDUCATION}/${id}`, userEducationObj);
};

const deleteUserEducation = (id) => {
  return axiosInstance.delete(`${USER_EDUCATION}/${id}`);
};

const addUserMedia = (imgData) => {
  return axiosInstance.post(`${ADD_USER_MEDIA}`, imgData);
};

const getUserMedia = () => {
  return axiosInstance.get(`${GET_USER_MEDIA}`);
};

const deleteUserMedia = (id) => {
  return axiosInstance.delete(`${DELETE_USER_MEDIA}/${id}`);
};

const getLanguage = () => {
  return axiosInstance.get(`${LANGUAGE}`);
};

const getPostcode = () => {
  return axiosInstance.get(`${POSTCODE_URL}`);
};

const verification = () => {
  return axiosInstance.put(`${USER_VERIFICATION}`);
};

const getFeedbackSubject = () => {
  return axiosInstance.get(`${FEEDBACK_SUBJECT}`);
};

const AddUserFeedback = (data) => {
  return axiosInstance.post(`${ADD_FEEDBACK}`, data);
};

export const userService = {
  updateProfileImage,
  updateUserDetails,
  getCountries,
  getCities,
  getUser,
  getUserEducation,
  addUserEducation,
  getUserCategories,
  getUserSubjects,
  addSubjects,
  getSubjects,
  getSubjectsById,
  updateUserEducation,
  deleteUserEducation,
  getUserMedia,
  addUserMedia,
  deleteUserMedia,
  getLanguage,
  verification,
  getPostcode,
  getFeedbackSubject,
  AddUserFeedback
};
