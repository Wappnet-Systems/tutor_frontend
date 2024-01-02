import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { authService } from "../../../auth/service/authService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const UserChangePassword = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const toggleShowPassword = (field) => {
    switch (field) {
      case "old_password":
        setShowCurrentPassword(!showCurrentPassword);
        break;
      case "newPassword":
        setShowNewPassword(!showNewPassword);
        break;
      case "confirmPassword":
        setShowConfirmPassword(!showConfirmPassword);
        break;
      default:
        break;
    }
  };

  const formik = useFormik({
    initialValues: {
      old_password: "",
      newPassword: "",
      confirmPassword: ""
    },
    validationSchema: Yup.object({
      old_password: Yup.string().required("Current Password is required"),
      newPassword: Yup.string()
        .required("New Password is required")
        .notOneOf(
          [Yup.ref("old_password")],
          "New Password should not be the same as the Current Password"
        )
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*!])[A-Za-z\d@#$%^&*!]{8,}$/,
          "New Password should be a combination of at least 1 uppercase letter, 1 lowercase letter, 1 special character, 1 number, and have a minimum length of 8 characters"
        )
        .required("New Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
        .required("Confirm Password is required")
    }),
    onSubmit: (values) => {
      const obj = {
        old_password: values?.old_password,
        password: values?.confirmPassword
      };

      authService.updatePassword(obj).then((response) => {
        toast.success(response?.data?.message?.[0]);
        navigate("/user");
        formik.resetForm();
      });
    }
  });

  return (
    <>
      <div className="tu-boxwrapper tu-contact-box">
        <div className="tu-boxarea">
          <div className="tu-boxsm">
            <div className="tu-boxsmtitle">
              <h4>Change Password</h4>
            </div>
          </div>
          <div className="tu-box">
            <form
              className="tu-themeform tu-dhbform"
              onSubmit={formik.handleSubmit}
            >
              <fieldset>
                <div className="tu-themeform__wrap">
                  <div className="form-group-wrap align-items-start">
                    {/* Current Password */}
                    <div className="form-group w-50">
                      <label className="tu-label">Current Password</label>
                      <div className="tu-placeholderholder">
                        <input
                          type={showCurrentPassword ? "text" : "password"}
                          className="form-control"
                          required=""
                          placeholder="Current Password"
                          name="old_password"
                          value={formik.values.old_password}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        <button
                          className="btn position-absolute top-0 end-0"
                          type="button"
                          onClick={() => toggleShowPassword("old_password")}
                          style={{ height: "48px" }}
                        >
                          {showCurrentPassword ? (
                            <i className="fa fa-eye"></i>
                          ) : (
                            <i className="fa fa-eye-slash"></i>
                          )}
                        </button>
                      </div>
                      {formik.touched.old_password &&
                        formik.errors.old_password && (
                          <div className="tu-error-message">
                            {formik.errors.old_password}
                          </div>
                        )}
                    </div>
                  </div>

                  {/* New Password */}
                  <div className="form-group-wrap align-items-start">
                    <div className="form-group w-50">
                      <label className="tu-label">New Password</label>
                      <div className="tu-placeholderholder">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          className="form-control"
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
                          onClick={() => toggleShowPassword("newPassword")}
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
                  </div>

                  {/* Confirm Password */}
                  <div className="form-group-wrap align-items-start">
                    <div className="form-group w-50">
                      <label className="tu-label">Re-Enter New Password</label>
                      <div className="tu-placeholderholder">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          className="form-control"
                          required=""
                          placeholder="Re-Enter New Password"
                          name="confirmPassword"
                          value={formik.values.confirmPassword}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        <button
                          className="btn position-absolute top-0 end-0"
                          type="button"
                          onClick={() => toggleShowPassword("confirmPassword")}
                          style={{ height: "48px" }}
                        >
                          {showConfirmPassword ? (
                            <i className="fa fa-eye"></i>
                          ) : (
                            <i className="fa fa-eye-slash"></i>
                          )}
                        </button>
                      </div>
                      {formik.touched.confirmPassword &&
                        formik.errors.confirmPassword && (
                          <div className="tu-error-message">
                            {formik.errors.confirmPassword}
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              </fieldset>
              <div className="tu-btnarea-two">
                <button
                  type="submit"
                  className="tu-primbtn-lg tu-primbtn-orange"
                >
                  Save & update
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
