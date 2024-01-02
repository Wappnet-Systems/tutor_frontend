import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import Select from "react-select";
import * as Yup from "yup";
import UserReviewForSubmit from "./UserReviewForSubmit";
import { userService } from "../../service/userService";
import ReactDatePicker from "react-datepicker";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../../../../redux/actions/action";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng
} from "react-places-autocomplete";
import { FaMapMarkerAlt } from "react-icons/fa";
import UserMessageBanner from "../Banner/UserMessageBanner";

const UserPersonalDetails = () => {
  const [showMultipleRate, setShowMultipleRate] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [introduction, setIntroduction] = useState("");
  const [allLanguages, setAllLanguages] = useState([]);
  const [allPostcodes, setAllPostcodes] = useState([]);
  const future_date_disable = new Date();
  const dispatch = useDispatch();
  let userData = useSelector((state) => state.userData?.userData);

  const initialSelectedLanguages = userData?.languages
    ? userData.languages.split(",").filter((lang) => lang.trim() !== "")
    : [];

  const initialSelectedPostcode = userData?.tutorPostcodeDetails
    ? userData.tutorPostcodeDetails?.map((item) => item.postcode_id)
    : [];

  const [selectedLanguages, setSelectedLanguages] = useState(
    initialSelectedLanguages
  );
  const [selectedPostcode, setSelectedPostcode] = useState(
    initialSelectedPostcode
  );

  const validationSchema = Yup.object().shape({
    first_name: Yup.string().required("First name is required"),
    last_name: Yup.string().required("Last name is required"),
    tag_line: Yup.string().required("Tag line is required"),
    hourly_rate: Yup.number(),
    hourly_rate2: Yup.number(),
    gender: Yup.string().required("Gender is required"),
    address: Yup.string().required("Address is required"),
    dob: Yup.date().required("Date of Birth is required")
  });

  const handleIntroductionChange = (event) => {
    const input = event.target.value;
    if (input.length <= 500) {
      setIntroduction(input);
    }
  };

  const formik = useFormik({
    initialValues: {
      first_name: userData?.first_name || "",
      last_name: userData?.last_name || "",
      tag_line: userData?.tag_line || "",
      hourly_rate: userData?.hourly_rate || "",
      hourly_rate2: !userData?.hourly_rate2 ? "" : userData?.hourly_rate2,
      hourly_rate3: !userData?.hourly_rate3 ? "" : userData?.hourly_rate3,
      gender: userData?.gender || "",
      introduction: userData?.introduction || "",
      dob: userData?.dob ? new Date(userData?.dob) : "",
      teach_at_online: userData?.teach_at_online || false,
      teach_at_offline: userData?.teach_at_offline || false,
      languages: userData?.languages || [],
      address: userData?.address || "",
      lat: userData?.lat || "",
      lng: userData?.lng || ""
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      values["introduction"] = introduction;
      values["gender"] = Number(values.gender);

      const selectedLanguageValues = selectedLanguages?.join(",");
      values["languages"] = selectedLanguageValues;
      if (values?.teach_at_offline === true) {
        const selectedPostcodeValues = selectedPostcode?.join(",");
        values["postcode_ids"] = selectedPostcodeValues;
      } else {
        values["postcode_ids"] = "";
        setSelectedPostcode([]);
      }

      updateUserDetails(values);
    }
  });

  const updateUserDetails = (updatedValues) => {
    const updatedUserData = {
      ...userData,
      ...updatedValues,
      introduction: introduction
    };

    if (userData.user_type == 2) {
      if (
        updatedUserData.languages == "" ||
        updatedUserData.hourly_rate < 0 ||
        !updatedUserData.hourly_rate ||
        (!updatedUserData.teach_at_online &&
          !updatedUserData.teach_at_offline) ||
        (updatedUserData?.teach_at_offline == true &&
          updatedUserData?.postcode_ids == "")
      ) {
        return false;
      }
    }

    if (showMultipleRate === true) {
      if (
        (updatedUserData.hourly_rate2 <= 0 &&
          updatedUserData.hourly_rate3 <= 0) ||
        (!updatedUserData.hourly_rate2 && !updatedUserData.hourly_rate3)
      ) {
        toast.error("Please add rates for multiple students");
        return false;
      } else {
        updatedUserData["hourly_rate2"] =
          updatedUserData?.hourly_rate2 > 0
            ? parseFloat(updatedUserData?.hourly_rate2)
            : 0;
        updatedUserData["hourly_rate3"] =
          updatedUserData?.hourly_rate3 > 0
            ? parseFloat(updatedUserData?.hourly_rate3)
            : 0;
      }
    } else {
      formik.setFieldValue("hourly_rate2", "");
      formik.setFieldValue("hourly_rate3", "");
      updatedUserData["hourly_rate2"] = 0;
      updatedUserData["hourly_rate3"] = 0;
    }

    if (userData?.user_type !== 2) {
      delete updatedUserData.hourly_rate;
      delete updatedUserData.hourly_rate2;
      delete updatedUserData.hourly_rate3;
    }

    delete updatedUserData?.tutorPostcodeDetails;

    userService?.updateUserDetails(updatedUserData).then((response) => {
      getUser();
      toast.success(response?.data?.message?.[0]);
    });
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
        const address = firstResult.formatted_address;
        setSelectedAddress(newAddress);
        formik.setFieldValue("address", address);
        formik.setFieldValue("lat", lat.toString());
        formik.setFieldValue("lng", lng.toString());
      })
      .catch((error) => console.error("Error", error));
  };

  useEffect(() => {
    getUser();
    getLanguages();
    getPostcodes();
  }, []);

  const getLanguages = () => {
    userService.getLanguage().then((resp) => {
      let lang = [];
      for (let index = 0; index < resp.data.data.length; index++) {
        const element = resp.data.data[index];
        lang.push({
          value: element.id,
          label: element.language
        });
      }
      setAllLanguages(lang);
    });
  };

  const getPostcodes = () => {
    userService.getPostcode().then((resp) => {
      let postcode = [];
      for (let index = 0; index < resp.data.data.length; index++) {
        const element = resp.data.data[index];
        postcode.push({
          value: element.id,
          label: element?.place_name + " (" + element?.postcode + ") "
        });
      }
      setAllPostcodes(postcode);
    });
  };

  const searchOptions = {
    types: ["(cities)"],
    componentRestrictions: { country: "au" }
  };

  const handleCheckboxChange = (e) => {
    setShowMultipleRate((prevState) => !prevState);
  };

  const getUser = () => {
    userService.getUser().then((response) => {
      const userResponse = response?.data?.user;
      dispatch(setUserData(response?.data?.user));

      formik.setValues({
        first_name: userResponse?.first_name || "",
        last_name: userResponse.last_name || "",
        tag_line: userResponse?.tag_line || "",
        hourly_rate: userResponse?.hourly_rate || "",
        hourly_rate2: !userResponse?.hourly_rate2
          ? ""
          : userResponse?.hourly_rate2,
        hourly_rate3: !userResponse?.hourly_rate3
          ? ""
          : userResponse?.hourly_rate3,
        introduction: userResponse?.introduction || "",
        gender: userResponse?.gender || "",
        dob: userResponse?.dob ? new Date(userResponse?.dob) : "",
        teach_at_online: userResponse?.teach_at_online || false,
        teach_at_offline: userResponse?.teach_at_offline || false,
        languages: userResponse?.languages || [],
        address: userResponse?.address || "",
        lat: userResponse?.lat || "",
        lng: userResponse?.lng || ""
      });

      setIntroduction(userResponse?.introduction);

      const initialSelectedPostcode = userResponse?.tutorPostcodeDetails
        ? userResponse?.tutorPostcodeDetails?.map((item) => item.postcode_id)
        : [];

      setSelectedPostcode(initialSelectedPostcode);

      const initialSelectedLanguages = userResponse?.languages
        ? userResponse.languages.split(",").filter((lang) => lang.trim() !== "")
        : [];

      setSelectedLanguages(initialSelectedLanguages);

      setSelectedAddress(userResponse?.address);
      setShowMultipleRate(
        userResponse?.hourly_rate2 > 0 || userResponse?.hourly_rate3 > 0
      );
    });
  };

  return (
    <>
      <div className="tu-boxwrapper">
        <UserMessageBanner />
        <div className="tu-boxarea">
          <div className="tu-boxsm">
            <div className="tu-boxsmtitle">
              <h4>Personal details</h4>
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
                      <label className="tu-label">First name</label>
                      <div className="tu-placeholderholder">
                        <input
                          type="text"
                          className="form-control"
                          required
                          placeholder="Your first name"
                          name="first_name"
                          {...formik.getFieldProps("first_name")}
                          value={formik?.values?.first_name || ""}
                        />
                        <div className="tu-placeholder">
                          <span>Your first name</span>
                          <em>*</em>
                        </div>
                      </div>
                      {formik.touched.first_name && formik.errors.first_name ? (
                        <div className="tu-error-message">
                          {formik.errors.first_name}
                        </div>
                      ) : null}
                    </div>
                    <div className="form-group form-group-half">
                      <label className="tu-label">Last name</label>
                      <div className="tu-placeholderholder">
                        <input
                          type="text"
                          className="form-control"
                          required
                          name="last_name"
                          placeholder="Your last name"
                          {...formik.getFieldProps("last_name")}
                        />
                        <div className="tu-placeholder">
                          <span>Your last name</span>
                          <em>*</em>
                        </div>
                      </div>
                      {formik.touched.last_name && formik.errors.last_name ? (
                        <div className="tu-error-message">
                          {formik.errors.last_name}
                        </div>
                      ) : null}
                    </div>
                    <div className="form-group form-group-half">
                      <label className="tu-label">Your tagline</label>
                      <div className="tu-placeholderholder">
                        <input
                          type="text"
                          className="form-control"
                          required=""
                          name="tag_line"
                          placeholder="Add your tagline"
                          {...formik.getFieldProps("tag_line")}
                          value={formik.values.tag_line}
                        />
                        <div className="tu-placeholder">
                          <span>Add your tagline</span>
                        </div>
                      </div>
                      {formik.touched.tag_line && formik.errors.tag_line ? (
                        <div className="tu-error-message">
                          {formik.errors.tag_line}
                        </div>
                      ) : null}
                    </div>

                    <div className="form-group form-group-half">
                      <label className="tu-label">DOB</label>
                      <div className="position-relative w-100">
                        <ReactDatePicker
                          peekNextMonth
                          showMonthDropdown
                          showYearDropdown
                          dropdownMode="select"
                          className="form-control mb-3 mb-lg-0 cursor-pointer"
                          dateFormat="dd-MM-yyyy"
                          name="dob"
                          selected={formik.values.dob}
                          maxDate={future_date_disable}
                          onChange={(date) => {
                            formik.setFieldValue("dob", date);
                          }}
                          autoComplete="off"
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

                    <div className="form-group form-group-half tu-form-groupradio ">
                      <label className="tu-label w-100">Gender</label>
                      <div className="d-flex flex-wrap radio_wrapper align-items-center">
                        <div className="tu-check tu-radiosm me-3">
                          <input
                            id="gender_male"
                            type="radio"
                            name="gender"
                            value="1"
                            checked={
                              formik.values.gender === "1" ||
                              userData?.gender === 1
                            }
                            onChange={formik.handleChange}
                          />
                          <label htmlFor="gender_male">Male</label>
                        </div>
                        <div className="tu-check tu-radiosm me-3">
                          <input
                            id="gender_female"
                            type="radio"
                            name="gender"
                            value="2"
                            checked={
                              formik.values.gender === "2" ||
                              userData?.gender === 2
                            }
                            onChange={formik.handleChange}
                          />
                          <label htmlFor="gender_female">Female</label>
                        </div>
                        <div className="tu-check tu-radiosm">
                          <input
                            id="gender_other"
                            type="radio"
                            name="gender"
                            value="3"
                            checked={
                              formik.values.gender === "3" ||
                              userData?.gender === 3
                            }
                            onChange={formik.handleChange}
                          />
                          <label htmlFor="gender_other">Other</label>
                        </div>
                      </div>

                      {formik.errors.gender && (
                        <div className="tu-error-message w-100">
                          {formik.errors.gender}
                        </div>
                      )}
                    </div>
                    <div className="form-group">
                      <label className="tu-label">Address</label>
                      <div className="tu-placeholderholder">
                        <PlacesAutocomplete
                          key={1}
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
                                      ? { color: "#007BFF" }
                                      : {};

                                    return (
                                      <div
                                        {...getSuggestionItemProps(suggestion, {
                                          className,
                                          style,
                                          onClick: () =>
                                            handleSelect(suggestion.description)
                                        })}
                                      >
                                        <FaMapMarkerAlt
                                          className="location-icon"
                                          style={iconStyle}
                                        />
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
                      {formik.touched.address && formik.errors.address ? (
                        <div className="tu-error-message">
                          {formik.errors.address}
                        </div>
                      ) : null}
                    </div>

                    <div className="form-group">
                      <label className="tu-label">Languages</label>
                      <div className="w-100">
                        <Select
                          isMulti
                          name="languages"
                          options={allLanguages}
                          className="basic-multi-select "
                          classNamePrefix="select"
                          placeholder="Select languages you know"
                          value={allLanguages.filter((lang) =>
                            selectedLanguages.includes(lang.value)
                          )}
                          onChange={(selectedOptions) => {
                            setSelectedLanguages(
                              selectedOptions.map((option) => option.value)
                            );

                            const selectedLanguageValues = selectedOptions
                              .map((option) => option.value)
                              .join(",");

                            formik.setFieldValue(
                              "languages",
                              selectedLanguageValues
                            );
                          }}
                        />
                      </div>
                      {formik.values.languages == "" && (
                        <div className="tu-error-message">
                          Language Selection is required
                        </div>
                      )}
                    </div>

                    {userData.user_type == 2 && (
                      <div className="form-group">
                        <label className="tu-label">I can teach on</label>
                        <ul className="tu-status-filter">
                          <li>
                            <div className="tu-status-contnent">
                              <div className="tu-check tu-checksm">
                                <input
                                  type="checkbox"
                                  id="online"
                                  name="teach_at_online"
                                  checked={formik.values.teach_at_online}
                                  onChange={formik.handleChange}
                                  {...formik.getFieldProps("teach_at_online")}
                                />
                                <label htmlFor="online">Online</label>
                              </div>
                            </div>
                          </li>
                          <li>
                            <div className="tu-status-contnent">
                              <div className="tu-check tu-checksm">
                                <input
                                  type="checkbox"
                                  id="offline"
                                  name="teach_at_offline"
                                  checked={formik.values.teach_at_offline}
                                  onChange={formik.handleChange}
                                  {...formik.getFieldProps("teach_at_offline")}
                                />
                                <label htmlFor="offline">Offline</label>
                              </div>
                            </div>
                          </li>
                        </ul>
                        {!formik.values.teach_at_online &&
                          !formik.values.teach_at_offline && (
                            <div className="tu-error-message">
                              One of teaching method is required
                            </div>
                          )}
                      </div>
                    )}

                    {userData?.user_type == 2 &&
                      formik.values.teach_at_offline === true && (
                        <div className="form-group">
                          <label className="tu-label">Postcode</label>
                          <div className="w-100">
                            <Select
                              isMulti
                              name="postcode_ids"
                              options={allPostcodes}
                              className="basic-multi-select"
                              classNamePrefix="select"
                              placeholder="Select postcode"
                              value={allPostcodes.filter((item) =>
                                selectedPostcode?.includes(item.value)
                              )}
                              onChange={(selectedOptions) => {
                                setSelectedPostcode(
                                  selectedOptions.map((option) => option.value)
                                );

                                const selectedPostcodeValues = selectedOptions
                                  .map((option) => option.value)
                                  .join(",");

                                formik.setFieldValue(
                                  "postcode_ids",
                                  selectedPostcodeValues
                                );
                              }}
                            />
                          </div>
                          {formik.values.postcode_ids == "" && (
                            <div className="tu-error-message">
                              Postcode is required
                            </div>
                          )}
                        </div>
                      )}

                    {userData.user_type == 2 && (
                      <>
                        <div className="w-100">
                          <div className="form-group-wrap align-items-start">
                            <div className="form-group form-group-half">
                              <label className="tu-label">
                                Hourly rate for one student
                              </label>
                              <div className="tu-placeholderholder">
                                <span
                                  className="input-group-text dolar-label"
                                  id="basic-addon2"
                                >
                                  <i class="fa-solid fa-dollar-sign"></i>
                                </span>
                                <input
                                  type="number"
                                  className="form-control"
                                  required
                                  placeholder="Your hourly fee"
                                  name="hourly_rate"
                                  min={0}
                                  {...formik.getFieldProps("hourly_rate")}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  style={{
                                    borderTopLeftRadius: 0,
                                    borderBottomLeftRadius: 0
                                  }}
                                  onWheel={(e) => e.target.blur()}
                                  value={formik?.values?.hourly_rate}
                                />
                                <div
                                  className="tu-placeholder"
                                  style={{ left: "60px" }}
                                >
                                  <span>Your hourly rate</span>
                                  <em>*</em>
                                </div>
                              </div>

                              {(formik.values.hourly_rate < 0 ||
                                !formik.values.hourly_rate) &&
                                formik.touched.hourly_rate && (
                                  <div className="tu-error-message">
                                    Hourly Rate is required
                                  </div>
                                )}
                            </div>
                          </div>

                          <div className="form-group-wrap align-items-start">
                            <div className="form-group form-group-half">
                              <div className="tu-check tu-checksm">
                                <input
                                  type="checkbox"
                                  id="allowMultipleRate"
                                  checked={showMultipleRate}
                                  onChange={handleCheckboxChange}
                                />
                                <label
                                  className="tu-label"
                                  htmlFor="allowMultipleRate"
                                >
                                  Allow Multiple Hourly Rate ?
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                        {showMultipleRate && (
                          <div className="form-group-wrap align-items-start">
                            <div className="form-group form-group-half">
                              <label className="tu-label">
                                Hourly rate for two student
                              </label>
                              <div className="tu-placeholderholder">
                                <span
                                  className="input-group-text dolar-label"
                                  id="basic-addon2"
                                >
                                  <i class="fa-solid fa-dollar-sign"></i>
                                </span>
                                <input
                                  type="number"
                                  className="form-control"
                                  placeholder="Your hourly fee"
                                  name="hourly_rate2"
                                  style={{
                                    borderTopLeftRadius: 0,
                                    borderBottomLeftRadius: 0
                                  }}
                                  min={0}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  onWheel={(e) => e.target.blur()}
                                  {...formik.getFieldProps("hourly_rate2")}
                                  value={formik?.values?.hourly_rate2}
                                />
                                <div
                                  className="tu-placeholder"
                                  style={{ left: "60px" }}
                                >
                                  <span>Your hourly rate 2</span>
                                  <em>*</em>
                                </div>
                              </div>
                            </div>

                            <div className="form-group form-group-half">
                              <label className="tu-label">
                                Hourly rate for three student
                              </label>
                              <div className="tu-placeholderholder">
                                <span
                                  className="input-group-text dolar-label"
                                  id="basic-addon2"
                                >
                                  <i class="fa-solid fa-dollar-sign"></i>
                                </span>
                                <input
                                  type="number"
                                  className="form-control"
                                  placeholder="Your hourly fee"
                                  name="hourly_rate3"
                                  style={{
                                    borderTopLeftRadius: 0,
                                    borderBottomLeftRadius: 0
                                  }}
                                  min={0}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  onWheel={(e) => e.target.blur()}
                                  {...formik.getFieldProps("hourly_rate3")}
                                  value={formik?.values?.hourly_rate3}
                                />
                                <div
                                  className="tu-placeholder"
                                  style={{ left: "60px" }}
                                >
                                  <span>Your hourly rate 3</span>
                                  <em>*</em>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                    <div className="form-group">
                      <label className="tu-label">A brief introduction</label>
                      <div className="tu-placeholderholder">
                        <textarea
                          className="form-control"
                          placeholder="Enter description"
                          name="introduction"
                          value={introduction}
                          maxLength={500}
                          onChange={handleIntroductionChange}
                        ></textarea>
                        <div className="tu-placeholder">
                          <span>Enter description</span>
                        </div>
                      </div>
                      <div className="tu-input-counter">
                        <span>Characters left:</span>
                        <b>{500 - introduction.length}</b>/<em> 500</em>
                      </div>
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

export default UserPersonalDetails;
