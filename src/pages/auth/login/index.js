import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { setSignupEmail, setUserData } from "../../../redux/actions/action";
import AuthBanner from "../../../components/common/AuthBanner";
import whiteLogo from "../../../assets/login/logo_white.png";
import authBannerImg from "../../../assets/login/auth_img.jpg";
import { userService } from "../../user/service/userService";
import { authService } from "../../auth/service/authService";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setisLoading] = useState(false);

  const handlePassword = () => {
    setShowPassword(!showPassword);
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character"
      )
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: ""
    },
    validationSchema,
    onSubmit: (values) => {
      login(values);
    }
  });

  const login = (values) => {
    setisLoading(true);
    authService
      .login(values)
      .then((response) => {
        localStorage.setItem("access_token", response?.data?.access_token);
        formik.resetForm();
        toast.success(response?.data?.message?.[0]);

        if (response?.data?.access_token !== undefined) {
          userService.getUser().then((response) => {
            if (response?.data?.user?.is_force_password_reset === true) {
              navigate("/change-password");
            } else {
              dispatch(setUserData(response?.data?.user));
              navigate("/user");
            }
          });
        }
        setisLoading(false);
      })
      .catch((ex) => {
        if (ex?.response?.status == "409") {
          dispatch(setSignupEmail(values.email));
          navigate("/verify-otp");
          authService.resendOtp({
            email: values.email
          });
        }
        setisLoading(false);
      });
  };

  return (
    <>
      <div className="tu-main-login">
        <AuthBanner
          logoImg={whiteLogo}
          bannerImg={authBannerImg}
          bannerTitle="Yes! we’re making progress"
          bannerSmallText="every minute & every second"
        />
        <div className="tu-login-right">
          <div className="tu-login-right_title">
            <h2>Welcome!</h2>
            <h3>We know you'll come back</h3>
          </div>

          <form
            className="tu-themeform tu-login-form"
            onSubmit={formik.handleSubmit}
          >
            <fieldset>
              <div className="tu-themeform__wrap">
                <div className="form-group-wrap">
                  <div className="form-group">
                    <div className="tu-placeholderholder">
                      <input
                        type="text"
                        className="form-control"
                        required=""
                        placeholder="email"
                        {...formik.getFieldProps("email")}
                      />
                      <div className="tu-placeholder">
                        <span>Enter email address</span>
                        <em>*</em>
                      </div>
                    </div>
                    {formik.touched.email && formik.errors.email ? (
                      <div className="tu-error-message">
                        {formik.errors.email}
                      </div>
                    ) : null}
                  </div>
                  <div className="form-group">
                    <div className="tu-placeholderholder">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control"
                        required=""
                        placeholder="Password"
                        {...formik.getFieldProps("password")}
                      />
                      <button
                        className="btn position-absolute top-0 end-0"
                        type="button"
                        id="show-password"
                        onClick={handlePassword}
                        style={{ height: "48px" }}
                      >
                        {showPassword ? (
                          <i className="fa-solid fa-eye"></i>
                        ) : (
                          <i className="fa-solid fa-eye-slash"></i>
                        )}
                      </button>
                      <div className="tu-placeholder">
                        {formik.values.password ? (
                          ""
                        ) : (
                          <>
                            {" "}
                            <span>Enter password</span>
                            <em>*</em>
                          </>
                        )}
                      </div>
                    </div>
                    {formik.touched.password && formik.errors.password ? (
                      <div className="tu-error-message">
                        {formik.errors.password}
                      </div>
                    ) : null}
                  </div>
                  <div className="form-group ">
                    <button
                      type="submit"
                      className="tu-primbtn-lg w-100"
                      disabled={isLoading}
                    >
                      <span>Login now</span>
                      <i className="icon icon-arrow-right"></i>
                    </button>
                  </div>

                  <div className="tu-lost-password form-group">
                    <Link to="/signup">Join us today</Link>
                    <Link
                      to="/forgot-password"
                      className="tu-password-clr_light"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                </div>
              </div>
            </fieldset>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
