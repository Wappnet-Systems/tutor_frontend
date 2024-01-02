import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import AuthBanner from "../../../components/common/AuthBanner";
import whiteLogo from "../../../assets/login/logo_white.png";
import authBannerImg from "../../../assets/login/auth_img.jpg";
import { authService } from "../service/authService";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .required("New password is required")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character"
      ),
    confirm_password: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required")
  });

  const handlePassword = () => {
    setShowPassword(!showPassword);
  };
  const handleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  useEffect(() => {
    verifyResetToken();
  }, [token]);

  const verifyResetToken = () => {
    if (token) {
      authService
        .verifyForgotPassword(token)
        .then((response) => {
          toast.success(response?.data?.message?.[0]);
          localStorage.setItem(
            "access_token",
            response?.data?.data?.access_token
          );
        })
        .catch((error) => {
          navigate("/login");
        });
    } else {
      navigate("/login");
    }
  };

  const formik = useFormik({
    initialValues: {
      password: "",
      confirm_password: ""
    },
    validationSchema,
    onSubmit: (values) => {
      delete values.confirm_password;
      resetPassword(values);
    }
  });

  const resetPassword = (values) => {
    authService.resetPassword(values).then((response) => {
      localStorage.removeItem("access_token");
      console.log("aaaaaaaaaaaaaaaaaaaaa", response);
      toast.success(response?.data?.message?.[0]);
      navigate("/login");
      formik.resetForm();
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
            <h2>Reset Password</h2>
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
                        type={showPassword ? "text" : "password"}
                        className="form-control pe-5"
                        required=""
                        placeholder="Password"
                        name="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
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
                            <span> Password</span>
                            <em>*</em>
                          </>
                        )}
                      </div>
                    </div>
                    {formik.errors.password && formik.touched.password && (
                      <div className="tu-error-message">
                        {formik.errors.password}
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <div className="tu-placeholderholder">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        className="form-control pe-5"
                        required=""
                        placeholder="Confirm Password"
                        name="confirm_password"
                        value={formik.values.confirm_password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      <button
                        className="btn position-absolute top-0 end-0"
                        type="button"
                        id="show-password1"
                        onClick={handleConfirmPassword}
                        style={{ height: "48px" }}
                      >
                        {showConfirmPassword ? (
                          <i className="fa-solid fa-eye"></i>
                        ) : (
                          <i className="fa-solid fa-eye-slash"></i>
                        )}
                      </button>

                      <div className="tu-placeholder">
                        {formik.values.confirm_password !== "" ? (
                          ""
                        ) : (
                          <>
                            <span>Confirm password</span>
                            <em>*</em>
                          </>
                        )}
                      </div>
                    </div>
                    {formik.errors.confirm_password &&
                      formik.touched.confirm_password && (
                        <div className="tu-error-message">
                          {formik.errors.confirm_password}
                        </div>
                      )}
                  </div>

                  <div className="form-group ">
                    <button type="submit" className="tu-primbtn-lg w-100">
                      <span>Change Password</span>
                      <i className="icon icon-arrow-right"></i>
                    </button>
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

export default ResetPassword;
