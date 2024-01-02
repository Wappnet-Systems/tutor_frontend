import { useFormik } from "formik";
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng
} from "react-places-autocomplete";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import ReactDatePicker from "react-datepicker";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import AuthBanner from "../../../components/common/AuthBanner";
import { setSignupEmail } from "../../../redux/actions/action";
import whiteLogo from "../../../assets/login/logo_white.png";
import authBannerImg from "../../../assets/login/auth_img.jpg";
import { authService } from "../service/authService";

const SignupTutor = () => {
  const location = useLocation();
  const userType = location.state ? location.state.userType : null;
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [selectedBirthdate, setSelectedBirthdate] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const dispatch = useDispatch();

  const handlePassword = () => {
    setShowPassword(!showPassword);
  };
  const handleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const initialValues = {
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
    contact_number: "",
    dob: "",
    address: "",
    lat: "",
    lng: "",
    user_type: userType || null
  };

  const validationSchema = Yup.object({
    first_name: Yup.string().required("First name is required"),
    last_name: Yup.string().required("Last name is required"),
    email: Yup.string()
      .email("Invalid email format")
      .matches(
        /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/,
        "Invalid email format"
      )
      .required("Email address is required"),
    password: Yup.string()
      .required("Password is required")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character"
      ),
    confirm_password: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),

    contact_number: Yup.string()
      .matches(/^\d{10}$/, "Contact number must be a valid 10-digit number")
      .required("Contact number is required"),
    dob: Yup.string().required("Date of birth is required"),
    user_type: Yup.string().required("User type is required"),
    address: Yup.string().required("Address is required")
  });

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      if (!termsAgreed) {
        toast.error("Please read and agree to the Terms & Conditions.");
        return;
      } else {
        signUp(values);
      }
    }
  });

  const signUp = (values) => {
    authService
      .signUp({ ...values, user_type: Number(values?.user_type) })
      .then((response) => {
        dispatch(setSignupEmail(values.email));
        formik.resetForm();
        navigate("/verify-otp");
        toast.success(response?.data?.message?.[0]);
      });
  };

  const future_date_disable = new Date(moment().format("YYYY-MM-DD"));

  const handleInputChange = (event, fieldName) => {
    const newValue = event.target.value.replace(/\s/g, "");
    formik.handleChange(event);
    formik.setFieldValue(fieldName, newValue);
  };

  const handleChange = (address) => {
    setSelectedAddress(address);
  };

  const handleSelect = (newAddress) => {
    geocodeByAddress(newAddress)
      .then((results) => {
        const firstResult = results[0];
        return Promise.all([getLatLng(firstResult), firstResult]);
      })
      .then(([latLng, firstResult]) => {
        const { lat, lng } = latLng;
        const city = firstResult.formatted_address;

        setSelectedAddress(newAddress); // Set the selected address in state
        formik.setFieldValue("address", city); // Set the address in Formik field
        formik.setFieldValue("lat", lat.toString());
        formik.setFieldValue("lng", lng.toString());
      })
      .catch((error) => console.error("Error", error));
  };

  const searchOptions = {
    types: ["(cities)"],
    componentRestrictions: { country: "au" } // Restrict to Australia
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
            <h3>It’s really nice to see you</h3>
          </div>
          <form
            className="tu-themeform tu-login-form"
            onSubmit={formik.handleSubmit}
          >
            <fieldset>
              <div className="tu-themeform__wrap">
                <div className="form-group-wrap">
                  <div className="form-group  tu-form-groupradio registration-user-type">
                    <div className="tu-check tu-radiosm me-3">
                      <input
                        id="user_type_instructor"
                        type="radio"
                        name="user_type"
                        value="2"
                        checked={formik.values.user_type === "2"}
                        onChange={formik.handleChange}
                      />
                      <label htmlFor="user_type_instructor">Tutor</label>
                    </div>
                    <div className="tu-check tu-radiosm">
                      <input
                        id="user_type_student"
                        type="radio"
                        name="user_type"
                        value="3"
                        checked={formik.values.user_type === "3"}
                        onChange={formik.handleChange}
                      />
                      <label htmlFor="user_type_student">Student</label>
                    </div>
                    {formik.errors.user_type && (
                      <div className="tu-error-message w-100">
                        {formik.errors.user_type}
                      </div>
                    )}
                  </div>
                  <div className="form-group">
                    <div className="tu-placeholderholder">
                      <input
                        type="text"
                        className="form-control"
                        required=""
                        placeholder="Full Name"
                        name="first_name"
                        value={formik.values.first_name}
                        onChange={(e) => handleInputChange(e, "first_name")}
                        onBlur={formik.handleBlur}
                      />

                      <div className="tu-placeholder">
                        <span>First name</span>
                        <em>*</em>
                      </div>
                    </div>
                    {formik.errors.first_name && formik.touched.first_name && (
                      <div className="tu-error-message">
                        {formik.errors.first_name}
                      </div>
                    )}
                  </div>
                  <div className="form-group">
                    <div className="tu-placeholderholder">
                      <input
                        type="text"
                        className="form-control"
                        required=""
                        placeholder="Last Name"
                        name="last_name"
                        value={formik.values.last_name}
                        onChange={(e) => handleInputChange(e, "last_name")}
                        onBlur={formik.handleBlur}
                      />

                      <div className="tu-placeholder">
                        <span>Last name</span>
                        <em>*</em>
                      </div>
                    </div>
                    {formik.errors.last_name && formik.touched.last_name && (
                      <div className="tu-error-message">
                        {formik.errors.last_name}
                      </div>
                    )}
                  </div>
                  <div className="form-group">
                    <div className="tu-placeholderholder">
                      <input
                        type="email"
                        className="form-control"
                        placeholder="Email address"
                        name="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />

                      <div className="tu-placeholder">
                        <span>Your email address</span>
                        <em>*</em>
                      </div>
                    </div>
                    {formik.errors.email && formik.touched.email && (
                      <div className="tu-error-message">
                        {formik.errors.email}
                      </div>
                    )}
                  </div>
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

                  <div className="form-group">
                    <div className="position-relative w-100">
                      <ReactDatePicker
                        peekNextMonth
                        showMonthDropdown
                        showYearDropdown
                        {...formik.getFieldProps("dob")}
                        dropdownMode="select"
                        className="form-control mb-3 mb-lg-0 cursor-pointer"
                        dateFormat="dd-MM-yyyy"
                        name="dob"
                        maxDate={future_date_disable}
                        selected={selectedBirthdate}
                        onChange={(date) => {
                          formik.setFieldValue("dob", date);
                          setSelectedBirthdate(date);
                        }}
                        autoComplete="off"
                        disabled={formik.isSubmitting}
                        onKeyDown={(e) => {
                          e.preventDefault();
                        }}
                        placeholderText="Date Of Birth"
                      />

                      <span
                        className="DatePicker_icon cursor-pointer"
                        onClick={() =>
                          document.getElementsByName("dob")[0].focus()
                        }
                      >
                        <div className="fa fa-calendar"></div>
                      </span>
                    </div>
                    {formik.errors.dob && formik.touched.dob && (
                      <div className="tu-error-message">
                        {formik.errors.dob}
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <div className="tu-placeholderholder">
                      <input
                        type="number"
                        className="form-control"
                        required=""
                        placeholder="Contact Number"
                        name="contact_number"
                        value={formik.values.contact_number}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />

                      <div className="tu-placeholder">
                        <span>Contact Number</span>
                        <em>*</em>
                      </div>
                    </div>
                    {formik.errors.contact_number &&
                      formik.touched.contact_number && (
                        <div className="tu-error-message">
                          {formik.errors.contact_number}
                        </div>
                      )}
                  </div>

                  <div className="form-group">
                    <div className="tu-placeholderholder">
                      <PlacesAutocomplete
                        value={selectedAddress}
                        onChange={handleChange}
                        onSelect={handleSelect}
                        searchOptions={searchOptions}
                      >
                        {({
                          getInputProps,
                          suggestions,
                          getSuggestionItemProps,
                          loading
                        }) => (
                          <div className="w-100">
                            <input
                              {...getInputProps({
                                placeholder: "Search Places ...",
                                className: "form-control"
                              })}
                            />
                            <div className="autocomplete-dropdown-container">
                              {loading && (
                                <div className="pt-16">Loading...</div>
                              )}
                              {suggestions &&
                                suggestions.map((suggestion) => {
                                  const className = suggestion.active
                                    ? "suggestion-item--active"
                                    : "suggestion-item";
                                  const style = suggestion.active
                                    ? {
                                        backgroundColor: "#fafafa",
                                        cursor: "pointer",
                                        borderBottom: "1px solid #CED4DA",
                                        padding: "10px"
                                      }
                                    : {
                                        backgroundColor: "#ffffff",
                                        cursor: "pointer",
                                        borderBottom: "1px solid #CED4DA",
                                        padding: "10px"
                                      };

                                  const iconStyle = suggestion.active
                                    ? { color: "#007BFF" } // Change the color for active state
                                    : {};

                                  return (
                                    <div
                                      {...getSuggestionItemProps(suggestion, {
                                        className,
                                        style,
                                        onClick: () =>
                                          handleSelect(suggestion.description) // Set the selected address when clicked
                                      })}
                                    >
                                      <FaMapMarkerAlt
                                        className="location-icon"
                                        style={iconStyle}
                                      />{" "}
                                      &nbsp;
                                      <span className="pt-16 address-suggetion">
                                        {suggestion.description}
                                      </span>
                                      <br />
                                    </div>
                                  );
                                })}
                            </div>
                          </div>
                        )}
                      </PlacesAutocomplete>

                      <div className="tu-placeholder">
                        {selectedAddress ? (
                          ""
                        ) : (
                          <>
                            <span>Address</span>
                            <em>*</em>
                          </>
                        )}
                      </div>
                    </div>
                    {formik.errors.address && formik.touched.address && (
                      <div className="tu-error-message">
                        {formik.errors.address}
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <div className="tu-check tu-signup-check">
                      <input
                        type="checkbox"
                        id="expcheck2"
                        name="expcheck"
                        checked={termsAgreed}
                        onChange={() => setTermsAgreed(!termsAgreed)}
                      />
                      <label htmlFor="expcheck2">
                        <span>
                          I have read and agree to all{" "}
                          <Link to="/">Terms &amp; conditions</Link>
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="form-group">
                    <button type="submit" className="tu-primbtn-lg w-100">
                      <span>Join now</span>
                      <i className="icon icon-arrow-right"></i>
                    </button>
                  </div>

                  <div className="tu-lost-password form-group">
                    <Link to="/login">Login now</Link>
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

export default SignupTutor;
