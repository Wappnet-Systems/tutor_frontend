import {
  SET_HAS_EDUCATION,
  SET_HAS_MEDIA,
  SET_HAS_SUBJECT,
  SET_SELECTED_CATEGORY,
  SET_SIGNUP_EMAIL,
  SET_USER_DATA
} from "../reducers/constants";

export const setSignupEmail = (email) => ({
  type: SET_SIGNUP_EMAIL,
  payload: email
});

export const setUserData = (user) => ({
  type: SET_USER_DATA,
  payload: user
});

export const setSelectedCategory = (categoryId) => {
  return {
    type: SET_SELECTED_CATEGORY,
    payload: categoryId
  };
};

export const setEducationData = (education) => ({
  type: SET_HAS_EDUCATION,
  payload: education
});

export const setSubjectsData = (subject) => ({
  type: SET_HAS_SUBJECT,
  payload: subject
});

export const setMediaData = (media) => ({
  type: SET_HAS_MEDIA,
  payload: media
});
