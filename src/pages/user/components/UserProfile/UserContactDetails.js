import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import UserReviewForSubmit from "./UserReviewForSubmit";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../../../../redux/actions/action";
import { userService } from "../../service/userService";
import { toast } from "react-toastify";
import UserMessageBanner from "../Banner/UserMessageBanner";

const UserContactDetails = () => {
  const userData = useSelector((state) => state.userData?.userData);
  const dispatch = useDispatch();

  const initialSelectedPostcode = userData?.tutorPostcodeDetails
    ? userData.tutorPostcodeDetails?.map((item) => item.postcode_id)
    : [];

  const [selectedPostcode, setSelectedPostcode] = useState(
    initialSelectedPostcode
  );

  const validationSchema = Yup.object().shape({
    contact_number: Yup.string()
      .required("Contact number is required")
      .matches(/^\d*$/, "Contact number must contain only digits")
      .max(10, "Contact number must not exceed 10 digits"),
    whatsapp: Yup.string()
      .matches(/^\d*$/, "Whatsapp number must contain only digits")
      .max(10, "Whatsapp number must not exceed 10 digits")
  });

  const formik = useFormik({
    initialValues: {
      contact_number: "",
      email: "",
      skype: "",
      whatsapp: "",
      website: ""
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      if (/^\s+$/.test(values.skype) || /^\s+$/.test(values.website)) {
        return false;
      }

      if (userData?.teach_at_offline === true) {
        const selectedPostcodeValues = selectedPostcode?.join(",");
        values["postcode_ids"] = selectedPostcodeValues;
      } else {
        values["postcode_ids"] = "";
        setSelectedPostcode([]);
      }
      values["skype"] = values.skype.trim();
      values["website"] = values.website.trim();
      values["whatsapp"] = values?.whatsapp.toString();
      values["contact_number"] = values?.contact_number.toString();
      updateContactDetails(values);
    }
  });

  const updateContactDetails = (updatedValues) => {
    const updatedUserData = {
      ...userData,
      ...updatedValues
    };

    delete updatedUserData?.tutorPostcodeDetails;

    userService?.updateUserDetails(updatedUserData).then((response) => {
      getUser();
      toast.success(response?.data?.message?.[0]);
    });
  };

  useEffect(() => {
    getUser();
  }, []);

  const getUser = () => {
    userService.getUser().then((response) => {
      const userResponse = response?.data?.user;
      dispatch(setUserData(response?.data?.user));

      const initialSelectedPostcode = userResponse?.tutorPostcodeDetails
        ? userResponse?.tutorPostcodeDetails?.map((item) => item.postcode_id)
        : [];

      setSelectedPostcode(initialSelectedPostcode);

      formik.setValues({
        contact_number: userResponse?.contact_number || "",
        email: userResponse?.email || "",
        skype: userResponse?.skype || "",
        whatsapp: userResponse?.whatsapp || "",
        website: userResponse?.website || ""
      });
    });
  };

  return (
    <>
      <div className="tu-boxwrapper tu-contact-box">
        <UserMessageBanner />
        <div className="tu-boxarea">
          <div className="tu-boxsm">
            <div className="tu-boxsmtitle">
              <h4>Contact details</h4>
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
                    <div className="form-group form-group-half">
                      <label className="tu-label">Contact number</label>
                      <div className="tu-inputicon">
                        <div className="tu-facebookv3">
                          <i className="icon icon-phone-call"></i>
                        </div>
                        <div className="tu-placeholderholder">
                          <input
                            type="number"
                            className="form-control"
                            id="phoneNumber"
                            name="contact_number"
                            maxLength={10}
                            required
                            {...formik.getFieldProps("contact_number")}
                          />
                          {formik.values.contact_number ? (
                            ""
                          ) : (
                            <div className="tu-placeholder">
                              <span>Enter phone number</span>
                              <em>*</em>
                            </div>
                          )}
                        </div>
                      </div>
                      {formik.touched.contact_number &&
                      formik.errors.contact_number ? (
                        <div className="tu-error-message">
                          {formik.errors.contact_number}
                        </div>
                      ) : null}
                    </div>
                    <div className="form-group form-group-half">
                      <label className="tu-label">Email address</label>
                      <div className="tu-inputicon">
                        <div className="tu-facebookv3">
                          <i className="icon icon-mail"></i>
                        </div>
                        <div className="tu-placeholderholder">
                          <input
                            type="email"
                            className="form-control"
                            placeholder="Enter email address"
                            name="email"
                            {...formik.getFieldProps("email")}
                            disabled
                          />
                          {formik.values.email ? (
                            ""
                          ) : (
                            <div className="tu-placeholder">
                              <span>Enter email address</span>
                              <em>*</em>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="form-group form-group-half">
                      <label className="tu-label">Skype ID</label>
                      <div className="tu-inputicon">
                        <div className="tu-facebookv3">
                          <i className="fa-brands fa-skype"></i>
                        </div>
                        <div className="tu-placeholderholder">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Enter skype id"
                            name="skype"
                            {...formik.getFieldProps("skype")}
                          />
                          {formik.values.skype ? (
                            ""
                          ) : (
                            <div className="tu-placeholder">
                              <span>Enter skype id</span>
                              <em>*</em>
                            </div>
                          )}
                        </div>
                      </div>
                      {/^\s+$/.test(formik.values.skype) && (
                        <div className="tu-error-message">
                          Only space is not allowed
                        </div>
                      )}
                    </div>
                    <div className="form-group form-group-half">
                      <label className="tu-label">Whatsapp number</label>
                      <div className="tu-inputicon">
                        <div className="tu-facebookv3">
                          <i className="fa-brands fa-whatsapp"></i>
                        </div>
                        <div className="tu-placeholderholder">
                          <input
                            type="number"
                            className="form-control"
                            placeholder="Enter whatsapp number"
                            name="whatsapp"
                            maxLength={10}
                            {...formik.getFieldProps("whatsapp")}
                          />

                          {formik.values.whatsapp ? (
                            ""
                          ) : (
                            <div className="tu-placeholder">
                              <span>Enter whatsapp number</span>
                              <em>*</em>
                            </div>
                          )}
                        </div>
                      </div>
                      {formik.touched.whatsapp && formik.errors.whatsapp ? (
                        <div className="tu-error-message">
                          {formik.errors.whatsapp}
                        </div>
                      ) : null}
                    </div>
                    <div className="form-group">
                      <label className="tu-label">Website</label>
                      <div className="tu-inputicon">
                        <div className="tu-facebookv3">
                          <i className="icon icon-globe"></i>
                        </div>
                        <div className="tu-placeholderholder">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Enter website URL"
                            name="website"
                            maxLength={75}
                            {...formik.getFieldProps("website")}
                          />
                          {formik.values.website ? (
                            ""
                          ) : (
                            <div className="tu-placeholder">
                              <span>Enter website URL</span>
                              <em>*</em>
                            </div>
                          )}
                        </div>
                      </div>
                      {/^\s+$/.test(formik.values.website) && (
                        <div className="tu-error-message">
                          Only space is not allowed
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </fieldset>
              <div className="tu-btnarea-two">
                {userData?.user_type === 2 && <UserReviewForSubmit />}
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

export default UserContactDetails;
