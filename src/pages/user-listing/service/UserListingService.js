import api from "../../../AxiosInterceptor";

const EDUCATION_CATEGORY = "category";
const ALL_SUBJECT = "subject";
const ALL_COUNTRY = "country";
const ALL_CITY = "city";
const USER_DATA = "tutor";
const USER_DATA_BY_ID = "/user/tutor";
const BOOKING_SCHEDULE = "/booking/schedule/user";
const ADD_BOOKMARK_URL = "/bookmark/tutor";
const GET_BOOKMARK_URL = "/bookmark";
const DELETE_BOOKMARK = "/bookmark";
const SUBEJCT_URL = "booking/subjects";
const VERIFY_EMAIL = "/booking/verify-invitee";
const BOOKING_URL = "/booking";
const GET_REVIEW_DATA = "/review/tutor";
const GET_LANGUAGES = "/language";
const POSTCODE_URL = "/postcode";

const userEducationCategory = () => {
  return api.get(EDUCATION_CATEGORY);
};

const getAllSubject = (id) => {
  return api.get(`${ALL_SUBJECT}/${id}`);
};

const getAllCountry = () => {
  return api.get(ALL_COUNTRY);
};

const getAllCity = (id) => {
  return api.get(`${ALL_CITY}/${id}`);
};

const getAllUserData = (limit, sort, page) => {
  const url = `${USER_DATA}?limit=${limit}&sort=${sort}&page=${page}`;
  return api.get(url);
};

const getUserDataByName = (limit, sort, page, search) => {
  const url = `${USER_DATA}?search=${search}&limit=${limit}&sort=${sort}&page=${page}`;
  return api.get(url);
};

const getUserDataByFilters = (params) => {
  const {
    booking_type,
    location,
    rating,
    gender,
    hourly_rate_max,
    hourly_rate_min,
    subject,
    category,
    search,
    limit,
    sort,
    page,
    postcode
  } = params;

  const filters = {
    search: search || undefined,
    booking_type: booking_type || undefined, // Use undefined if no value
    category: category || undefined, // Use undefined if no value
    subject: subject ? subject.split(",") : undefined, // Use undefined if no value
    hourly_rate_min: hourly_rate_min || undefined, // Use undefined if no value
    hourly_rate_max: hourly_rate_max || undefined, // Use undefined if no value
    rating: rating || undefined, // Use undefined if no value
    gender: gender || undefined, // Use undefined if no value
    location: location || undefined, // Use undefined if no value
    postcode: postcode || undefined
  };

  const queryString = Object.keys(filters)
    .filter((key) => filters[key] !== undefined) // Only include parameters with valid values
    .map((key) => `${key}=${filters[key]}`)
    .join("&");

  const url = queryString
    ? `${USER_DATA}?${queryString}&limit=${limit}&sort=${sort}&page=${page}`
    : `${USER_DATA}?limit=${limit}&sort=${sort}&page=${page}`;
  return api.get(url);
};

const getUserDataByID = (id) => {
  const url = `${USER_DATA_BY_ID}/${id}`;
  return api.get(url);
};

const getUserBookingData = (id, data) => {
  return api.post(`${BOOKING_SCHEDULE}/${id}`, data);
};
const addUserBookMark = (userId) => {
  return api.post(`${ADD_BOOKMARK_URL}/${userId}`);
};
const getBookmarkedData = (limit, sort, page) => {
  const url = `${GET_BOOKMARK_URL}?limit=${limit}&sort=${sort}&page=${page}`;
  return api.get(url);
};

const deleteBookMark = (id) => {
  return api.delete(`${DELETE_BOOKMARK}/${id}`);
};

const getAllSubjects = (id) => {
  return api.get(`${SUBEJCT_URL}/${id}`);
};

const verifyEmail = (data) => {
  return api.post(`${VERIFY_EMAIL}`, data);
};

const bookingData = (data) => {
  return api.post(`${BOOKING_URL}`, data);
};
const getUserReviewData = (id, limit, sort, page) => {
  const url = `${GET_REVIEW_DATA}/${id}?limit=${limit}&sort=${sort}&page=${page}`;
  return api.get(url);
};

const getAllLanguages = () => {
  return api.get(`${GET_LANGUAGES}`);
};

const getPostcode = () => {
  return api.get(`${POSTCODE_URL}`);
};

export {
  userEducationCategory,
  getAllCountry,
  getAllCity,
  getAllSubject,
  getAllUserData,
  getUserDataByName,
  getUserDataByID,
  getUserBookingData,
  addUserBookMark,
  getBookmarkedData,
  deleteBookMark,
  getUserDataByFilters,
  getAllSubjects,
  verifyEmail,
  bookingData,
  getUserReviewData,
  getAllLanguages,
  getPostcode
};
