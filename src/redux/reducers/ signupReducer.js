import {
  SET_HAS_MEDIA,
  SET_HAS_SUBJECT,
  SET_SELECTED_CATEGORY,
  SET_SIGNUP_EMAIL
} from "./constants";
import { SET_USER_DATA, SET_HAS_EDUCATION } from "./constants";

const initialState = {
  signupEmail: null,
  userData: {},
  selectedCategoryId: []
};

const SignupReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SIGNUP_EMAIL:
      return {
        ...state,
        signupEmail: action.payload
      };
    default:
      return state;
  }
};

const UserDataReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER_DATA:
      return {
        ...state,
        userData: action.payload
      };
    default:
      return state;
  }
};

const categoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SELECTED_CATEGORY:
      return {
        ...state,
        selectedCategoryId: action.payload
      };
    default:
      return state;
  }
};
const educationReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_HAS_EDUCATION:
      return {
        ...state,
        data: action.payload
      };
    default:
      return state;
  }
};
const subjectReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_HAS_SUBJECT:
      return {
        ...state,
        data: action.payload
      };
    default:
      return state;
  }
};

const mediaReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_HAS_MEDIA:
      return {
        ...state,
        data: action.payload
      };
    default:
      return state;
  }
};

export {
  SignupReducer,
  UserDataReducer,
  categoryReducer,
  educationReducer,
  subjectReducer,
  mediaReducer
};
