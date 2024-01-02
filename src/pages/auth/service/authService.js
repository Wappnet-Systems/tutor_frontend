import axiosInstance from "../../../AxiosInterceptor";

const SIGNUP_URL = `/auth/signup`;
const OTP_URL = "/auth/verify";
const LOGIN_URL = "/auth/signIn";
const RESEND_OTP_URL = "/auth/resend-otp";
const FORGOT_PASSWORD_URL = "/auth/forgot-password";
const CHANGE_PASSWORD_URL = "/auth/change-password";
const VERIFY_FORGOT_PASSWORD_URL = "/auth/verify-forgot-password";
const UPDATE_PASSWORD_URL = "/auth/update-password";

const signUp = (data) => {
  return axiosInstance.post(SIGNUP_URL, data);
};

const resendOtp = (data) => {
  return axiosInstance.post(RESEND_OTP_URL, data);
};

const verifyOtp = (data) => {
  return axiosInstance.post(OTP_URL, data);
};

const login = (data) => {
  return axiosInstance.post(LOGIN_URL, data);
};

const forgotPassword = (data) => {
  return axiosInstance.post(FORGOT_PASSWORD_URL, data);
};

const resetPassword = (data) => {
  return axiosInstance.post(CHANGE_PASSWORD_URL, data);
};

const verifyForgotPassword = (query) => {
  return axiosInstance.get(`${VERIFY_FORGOT_PASSWORD_URL}/${query}`);
};

const updatePassword = (data) => {
  return axiosInstance.post(UPDATE_PASSWORD_URL, data);
};

export const authService = {
  signUp,
  verifyOtp,
  resendOtp,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
  verifyForgotPassword
};
