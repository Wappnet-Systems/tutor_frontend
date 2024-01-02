import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { authService } from "../service/authService";
import AuthBanner from "../../../components/common/AuthBanner";
import whiteLogo from "../../../assets/login/logo_white.png";
import authBannerImg from "../../../assets/login/auth_img.jpg";

export const Changepassword = () => {
  const navigate = useNavigate();
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const validationSchema = Yup.object().shape({
    newPassword: Yup.string()
      .required("New Password is required")
      .min(8, "New Password must be at least 8 characters long")
      .matches(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).+$/,
        "New Password must include at least 1 uppercase letter, 1 lowercase letter, 1 special character, and 1 number"
      ),
    confirmNewPassword: Yup.string()
      .required("Re-Enter New Password is required")
      .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
  });

  const formik = useFormik({
    initialValues: {
      newPassword: "",
      confirmNewPassword: ""
    },
    validationSchema,
    onSubmit: (values) => {
      const obj = {
        password: values?.confirmNewPassword
      };

      authService.resetPassword(obj).then((response) => {
        toast.success(response?.data?.message?.[0]);
        navigate("/user");
        formik.resetForm();
      });
    }
  });

  const handleNewPassword = () => {
    setShowNewPassword(!showNewPassword);
  };

  const handleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div>
      <div className="tu-main-login">
        <AuthBanner
          logoImg={whiteLogo}
          bannerImg={authBannerImg}
          bannerTitle="Yes! we’re making progress"
          bannerSmallText="every minute & every second"
        />
        <div className="tu-login-right">
          <div className="tu-login-right_title">
            <h2>Change Password</h2>
          </div>

          <form
            className="tu-themeform tu-login-form"
            onSubmit={formik.handleSubmit}
          >
            <fieldset>
              <div className="tu-themeform__wrap">
                <div className="form-group-wrap">
                  <div className="form-group">
                    <label className="tu-label">New Password</label>
                    <div className="tu-placeholderholder">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        className="form-control pe-5"
                        required=""
                        placeholder="New Password"
                        name="newPassword"
                        value={formik.values.newPassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      <button
                        className="btn position-absolute top-0 end-0"
                        type="button"
                        id="show-password"
                        onClick={handleNewPassword}
                        style={{ height: "48px" }}
                      >
                        {showNewPassword ? (
                          <i className="fa fa-eye"></i>
                        ) : (
                          <i className="fa fa-eye-slash"></i>
                        )}
                      </button>
                    </div>
                    {formik.touched.newPassword &&
                      formik.errors.newPassword && (
                        <div className="tu-error-message">
                          {formik.errors.newPassword}
                        </div>
                      )}
                  </div>

                  <div className="form-group">
                    <label className="tu-label">Re-Enter New Password</label>
                    <div className="tu-placeholderholder">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        className="form-control pe-5"
                        required=""
                        placeholder="Re-Enter New Password"
                        name="confirmNewPassword"
                        value={formik.values.confirmNewPassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      <button
                        className="btn position-absolute top-0 end-0"
                        type="button"
                        id="show-password"
                        onClick={handleConfirmPassword}
                        style={{ height: "48px" }}
                      >
                        {showConfirmPassword ? (
                          <i className="fa fa-eye"></i>
                        ) : (
                          <i className="fa fa-eye-slash"></i>
                        )}
                      </button>
                    </div>
                    {formik.touched.confirmNewPassword &&
                      formik.errors.confirmNewPassword && (
                        <div className="tu-error-message">
                          {formik.errors.confirmNewPassword}
                        </div>
                      )}
                  </div>

                  <div className="form-group">
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
    </div>
  );
};
