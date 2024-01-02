import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import AuthBanner from "../../../components/common/AuthBanner";
import whiteLogo from "../../../assets/login/logo_white.png";
import authBannerImg from "../../../assets/login/auth_img.jpg";
import { authService } from "../service/authService";

const ForgotPassword = () => {
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .matches(
        /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/,
        "Invalid email format"
      )
      .required("Email is required")
  });

  const formik = useFormik({
    initialValues: {
      email: ""
    },
    validationSchema,
    onSubmit: (values) => {
      forgotPassword(values);
    }
  });

  const forgotPassword = (value) => {
    authService.forgotPassword(value).then((response) => {
      toast.success(response?.data?.message?.[0]);
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
            <h2>Dont worry!</h2>
            <h3>We’ll send you the reset link</h3>
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
                        placeholder="Username/email"
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

                  <div className="form-group ">
                    <button type="submit" className="tu-primbtn-lg w-100">
                      <span>Send reset link</span>
                      <i className="icon icon-arrow-right"></i>
                    </button>
                  </div>

                  <div className="tu-lost-password form-group">
                    <Link to="/login">Login now</Link>
                    <Link to="/signup">Join us today</Link>
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

export default ForgotPassword;
