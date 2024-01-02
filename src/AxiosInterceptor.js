import axios from "axios";

import { toast } from "react-toastify";
import ReactDOM from "react-dom";
import { Loader } from "./components/common/Loader";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL
});


// const useNavigationInterceptor = () => {
// const navigate = useNavigate();

const loaderRoot = document.createElement("div");
document.body.appendChild(loaderRoot);

const showLoader = () => {
  ReactDOM.render(<Loader />, loaderRoot);
};

const hideLoader = () => {
  ReactDOM.unmountComponentAtNode(loaderRoot);
};

axiosInstance.interceptors.request.use(
  (config) => {
    if (
      !config.url.includes("category") &&
      !config.url.includes("chat") &&
      !config.url.includes("notification")
    ) {
      showLoader();
    }
    const token = localStorage.getItem("access_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    hideLoader();
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    if (
      !response.config.url.includes("category") &&
      !response.config.url.includes("chat") &&
      !response.config.url.includes("notification")
    ) {
      hideLoader();
    }
    return response;
  },
  (error) => {
    hideLoader();
    toast.error(
      typeof error?.response?.data?.message == "string"
        ? error?.response?.data?.message
        : error?.response?.data?.message?.[0]
    );
    if (
      !error.config.url.includes("category")) {
      if (error?.response?.status === 401) {
        localStorage.clear();
        setTimeout(() => {
          window.location.href = "/tutor/login";
        }, 500);
      }
    }
    return Promise.reject(error);
  }
);
// };

export default axiosInstance;
// export { useNavigationInterceptor };
