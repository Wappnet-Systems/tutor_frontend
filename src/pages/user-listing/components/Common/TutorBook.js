import React, { Children, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng
} from "react-places-autocomplete";
import { FaMapMarkerAlt } from "react-icons/fa";
import { getAllSubjects, verifyEmail } from "../../service/UserListingService";
import { Col, Dropdown, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";

function mapDataToNodes(data) {
  let parent = [];
  data.tutorSubjects?.map((item) => {
    parent.push({
      value: item?.subject?.subject_name,
      label: item?.subject?.subject_name,
      id: item?.subject?.id
    });
  });
  return parent;
}

export const TutorBook = ({
  getBookingData,
  selectedSlots,
  tutorData,
  onSubmit
}) => {
  const animatedComponents = makeAnimated();
  const [subject, setSubject] = useState([]);
  const [expandedStates, setExpandedStates] = useState([true, false]);
  const [isEditing, setIsEditing] = useState(false);
  const [invitees, setInvitees] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedAddressError, setSelectedAddressError] = useState("");
  const [mainAddress, setMainAddress] = useState(null);
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [total, setTotal] = useState(null);
  const [isDiable, setIsDisable] = useState(false);
  const { id } = useParams();

  const validationSchema = Yup.object().shape({
    subject_ids: Yup.array().min(1, "Please select at least one subject"),
    lectureMode: Yup.string().required("Please select a lecture mode"),
    introduction: Yup.string()
      .required("Introduction is required")
      .max(500, "Introduction must be at most 500 characters")
  });

  const handleChangeData = (address) => {
    setSelectedAddress(address);
    if (mainAddress !== address) {
      setSelectedAddressError("Please select valid address");
    } else {
      setSelectedAddressError("");
    }
  };

  const handleSelectSingle = (newAddress) => {
    geocodeByAddress(newAddress)
      .then((results) => {
        const firstResult = results[0];
        return Promise.all([getLatLng(firstResult), firstResult]);
      })
      .then(([latLng, firstResult]) => {
        const { lat, lng } = latLng;
        const address = firstResult.formatted_address;
        setMainAddress(address);

        const lastAddressComponent =
          firstResult.address_components[
            firstResult.address_components.length - 1
          ];
        const postalCode = lastAddressComponent
          ? lastAddressComponent.long_name
          : null;

        const tutorPostalCodes = tutorData.tutor_postcodes.map(
          (item) => item.postcode.postcode
        );

        setSelectedAddress(address);
        setIsEditing(false); // Disable direct editing of the address

        if (postalCode && tutorPostalCodes.includes(postalCode)) {
          setLat(lat);
          setLng(lng);
          setSelectedAddressError("");
        } else {
          setLat(null);
          setLng(null);
          setSelectedAddressError("Tutor not available at selected address");
        }
      })
      .catch((error) => console.error("Error", error));
  };

  useEffect(() => {
    if (invitees.length === 0) {
      setTotal(selectedSlots?.slots.length * tutorData?.hourly_rate);
    } else if (invitees.length === 1) {
      setTotal(selectedSlots?.slots.length * tutorData?.hourly_rate2);
    } else if (invitees.length === 2) {
      setTotal(selectedSlots?.slots.length * tutorData?.hourly_rate3);
    }
  }, [invitees, selectedSlots]);

  const formik = useFormik({
    initialValues: {
      subject_ids: [],
      lectureMode: "",
      introduction: ""
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      let mode;
      if (values?.lectureMode === "online") {
        mode = 1;
      } else if (values?.lectureMode === "offline") {
        mode = 2;
      }

      if (
        (values?.lectureMode === "offline" && !selectedAddress) ||
        (values?.lectureMode === "offline" &&
          selectedAddress &&
          selectedAddressError)
      ) {
        return false;
      }

      const selectSots = selectedSlots?.slots.map(Number);
      const ids = values.subject_ids.map(Number);

      const obj = {
        mode: mode,
        address: selectedAddress,
        lat: lat?.toString(),
        lng: lng?.toString(),
        subject_ids: ids,
        invitee: invitees,
        slots: selectSots,
        tutor_id: Number(id),
        special_comments: values?.introduction,
        calculated_price: total
      };

      let error = false;
      for (let index = 0; index < invitees.length; index++) {
        const element = invitees[index];
        if (
          !element.email ||
          !element.first_name ||
          !element.last_name ||
          !element.contact_number ||
          element.contact_number?.length !== 10 ||
          !element.address
        ) {
          element.is_error = true;
          error = true;
        }
      }
      setInvitees(invitees);

      if (!error) {
        onSubmit(obj);
      }
    }
  });

  const allSubject = async () => {
    const subjectData = await getAllSubjects(id);
    setSubject(subjectData?.data?.data);
  };

  useEffect(() => {
    allSubject();
  }, []);

  const subjectOptions = mapDataToNodes(subject);

  const handleSide3Toggle = (index) => {
    const newExpandedStates = [...expandedStates];
    newExpandedStates[index] = !newExpandedStates[index];
    setExpandedStates(newExpandedStates);
  };

  const handleAddInvitee = () => {
    setIsDisable(false);
    if (invitees.length < 2) {
      setInvitees([
        ...invitees,
        {
          email: "",
          first_name: "",
          last_name: "",
          contact_number: "",
          address: "",
          lat: "",
          lng: "",
          is_email_verified: false,
          is_field_verified: false
        }
      ]);
    }
  };

  const handleDeleteInvitee = (index) => {
    const updatedInvitees = [...invitees];
    updatedInvitees.splice(index, 1);
    setInvitees(updatedInvitees);
  };

  const handleUserNameChange = (index, fieldName, value) => {
    const updatedUsers = [...invitees];
    updatedUsers[index][fieldName] = value;
    setInvitees(updatedUsers);
  };

  const getVerifyData = async (email, index) => {
    const data = {
      email: email
    };
    const resp = await verifyEmail(data);
    if (resp) {
      setIsDisable(true);
    }
    const user = resp?.data?.data;

    if (user) {
      const updatedInvitees = JSON.parse(JSON.stringify([...invitees]));
      updatedInvitees[index] = {
        email: email,
        first_name: user?.user?.first_name,
        last_name: user?.user?.last_name,
        contact_number: user?.user?.contact_number,
        address: user?.user?.address,
        lat: user?.user?.lat,
        lng: user?.user?.lng,
        is_email_verified: true,
        is_field_verified: user?.user?.first_name ? true : false,
        is_error: false
      };
      setInvitees(updatedInvitees);
    }
  };

  const resetStudentData = (index) => {
    setIsDisable(false);
    const updatedInvitees = [...invitees];
    updatedInvitees[index] = {
      ...updatedInvitees[index],
      email: "",
      first_name: "",
      last_name: "",
      contact_number: "",
      address: "",
      lat: "",
      lng: "",
      is_email_verified: false,
      is_field_verified: false,
      is_error: false
    };
    setInvitees(updatedInvitees);
  };

  const handleChange = (index, newAddress) => {
    const updatedUsers = [...invitees];
    updatedUsers[index].address = newAddress;
    setInvitees(updatedUsers);
  };

  const handleSelect = (newAddress, index) => {
    geocodeByAddress(newAddress)
      .then((results) => {
        const firstResult = results[0];
        return Promise.all([getLatLng(firstResult), firstResult]);
      })
      .then(([latLng, firstResult]) => {
        const { lat, lng } = latLng;
        const address = firstResult.formatted_address;

        const updatedUsers = [...invitees];
        updatedUsers[index].address = address;
        updatedUsers[index].lat = lat;
        updatedUsers[index].lng = lng;
        setInvitees(updatedUsers);
      })
      .catch((error) => console.error("Error", error));
  };

  const searchOptions = {
    // types: ["(address)"],
    componentRestrictions: { country: "au" }
  };

  const handleDropdownToggle = (isOpen) => {
    if (isOpen && !isEditing) {
      setIsEditing(true);
    }
  };

  return (
    <div>
      <form
        className="tu-themeform mt-2"
        onSubmit={formik.handleSubmit}
        noValidate
      >
        <fieldset>
          <div className="form-group-wrap align-items-start">
            <div className="form-group">
              <label className="tu-label w-100">Select subject</label>
              <Select
                isMulti
                name="subject_ids"
                id="subject_ids"
                className="basic-multi-select"
                classNamePrefix="select"
                placeholder="Select subject from list"
                components={animatedComponents}
                options={subjectOptions}
                onChange={(selectedOptions) => {
                  const selectedSubjectIds = selectedOptions.map(
                    (option) => option.id
                  );
                  formik.setFieldValue("subject_ids", selectedSubjectIds);
                }}
              />
              {formik.errors.subject_ids && formik.touched.subject_ids && (
                <div className="tu-error-message">
                  {formik.errors.subject_ids}
                </div>
              )}
            </div>
            <div className="form-group form-group-half">
              <label className="tu-label w-100">Select the Lecture Mode</label>
              {tutorData?.teach_at_online === true && (
                <div className="tu-check tu-signup-check p-0">
                  <input
                    type="radio"
                    id="online"
                    name="lectureMode"
                    value="online"
                    checked={formik.values.lectureMode === "online"}
                    onChange={formik.handleChange}
                  />
                  <label htmlFor="online">
                    <span>Online</span>
                  </label>
                </div>
              )}

              {tutorData?.teach_at_offline === true && (
                <div className="tu-check tu-signup-check p-0">
                  <input
                    type="radio"
                    id="offline"
                    name="lectureMode"
                    value="offline"
                    checked={formik.values.lectureMode === "offline"}
                    onChange={formik.handleChange}
                    disabled={formik.values.lectureMode === null} // Disable if lectureMode is null
                  />
                  <label htmlFor="offline">
                    <span>Offline</span>
                  </label>
                </div>
              )}

              {formik.errors.lectureMode && formik.touched.lectureMode && (
                <div className="tu-error-message">
                  {formik.errors.lectureMode}
                </div>
              )}
            </div>
            {formik?.values?.lectureMode === "offline" && (
              <>
                <div className="form-group form-group-half">
                  <label className="tu-label w-100">
                    <div className="d-flex justify-content-between align-items-center">
                      <span>Select Address</span>
                      <Dropdown
                        onToggle={handleDropdownToggle}
                        className="tu-dropdown"
                      >
                        <Dropdown.Toggle
                          id="dropdown-basic"
                          className="available_dropdown_btn"
                        >
                          Tutor available at
                          <i className="fa-solid fa-circle-info ms-2"></i>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          {tutorData?.tutor_postcodes.map((item, index) => (
                            <Dropdown.Item key={index}>
                              {item?.postcode?.place_name +
                                " (" +
                                item?.postcode?.postcode +
                                ")"}
                            </Dropdown.Item>
                          ))}
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                  </label>
                  <div className="tu-placeholderholder">
                    <PlacesAutocomplete
                      key={1}
                      value={selectedAddress}
                      onChange={handleChangeData}
                      onSelect={handleSelectSingle}
                      searchOptions={searchOptions}
                    >
                      {({
                        getInputProps,
                        suggestions,
                        getSuggestionItemProps,
                        loading
                      }) => {
                        return (
                          <div className="w-100 position-relative">
                            <input
                              {...getInputProps({
                                placeholder: "Search Places ...",
                                className: "form-control",
                                readOnly: !isEditing,
                                onClick: () => setIsEditing(true)
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
                                    ? {
                                        color: "#007BFF"
                                      }
                                    : {};

                                  return (
                                    <div
                                      {...getSuggestionItemProps(suggestion, {
                                        className,
                                        style,
                                        onClick: () =>
                                          handleSelectSingle(
                                            suggestion.description
                                          )
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
                        );
                      }}
                    </PlacesAutocomplete>
                  </div>
                  {formik?.values?.lectureMode === "offline" && (
                    <>
                      {selectedAddress && selectedAddressError !== "" && (
                        <div className="tu-error-message">
                          {selectedAddressError}
                        </div>
                      )}
                      {!selectedAddress && (
                        <div className="tu-error-message">
                          Address is required
                        </div>
                      )}
                    </>
                  )}
                </div>
              </>
            )}

            <div className="form-group">
              {invitees.length < 2 && (
                <button
                  type="button"
                  className="tu-primbtn-lg w-25"
                  onClick={handleAddInvitee}
                >
                  Add Invitee
                </button>
              )}
            </div>

            {invitees.length > 0 &&
              invitees.slice(0, 2).map((invitee, index) => (
                <div className="tu-box form-group">
                  <div
                    className="accordion tu-accordionedu"
                    id={`accordionFlushExample${index}`}
                    key={index}
                  >
                    <div id="tu-edusortable" className="tu-edusortable">
                      <div className="tu-accordion-item">
                        <div className="tu-expwrapper">
                          <div className="tu-accordionedu">
                            <div className="tu-expinfo">
                              <div className="tu-accodion-holder">
                                <h5
                                  className="collapsed"
                                  data-bs-toggle="collapse"
                                  data-bs-target="#flush-collapseOneba"
                                  aria-expanded="true"
                                  aria-controls="flush-collapseOneba"
                                >
                                  Invitee {index + 1}
                                </h5>
                              </div>
                              <div className="tu-icon-holder">
                                <a
                                  onClick={() => handleDeleteInvitee(index)}
                                  style={{ cursor: "pointer" }}
                                >
                                  <i className="icon icon-trash-2 tu-deleteclr"></i>
                                </a>
                              </div>
                              <i
                                className="icon icon-plus"
                                role="button"
                                data-bs-toggle="collapse"
                                data-bs-target={`#flush-collapseOneba${index}`}
                                aria-expanded={expandedStates[index]}
                                onClick={() => handleSide3Toggle(index)}
                                aria-controls={`flush-collapseOneba${index}`}
                              ></i>
                            </div>
                          </div>
                        </div>
                        <div
                          id={`flush-collapseOneba${index}`}
                          className={`accordion-collapse collapse ${
                            expandedStates[index] ? "show" : ""
                          }`}
                          data-bs-parent="#accordionFlushExampleaa"
                        >
                          <div className="tu-edubodymain">
                            <div className="form-group-wrap align-items-center">
                              <div className="form-group form-group-half">
                                <label className="tu-label w-100">Email</label>
                                <input
                                  type="text"
                                  className="w-100"
                                  id={`email-${index}`}
                                  name={`invitees[${index}].email`}
                                  value={invitees[index].email}
                                  disabled={invitees[index].is_email_verified}
                                  onChange={(e) =>
                                    handleUserNameChange(
                                      index,
                                      "email",
                                      e.target.value
                                    )
                                  }
                                  onBlur={formik.handleBlur}
                                />
                                {!invitees[index].email &&
                                invitees[index].is_error ? (
                                  <div className="tu-error-message">
                                    Email is required.
                                  </div>
                                ) : (
                                  <></>
                                )}
                              </div>
                              {invitee.email && (
                                <div className="d-flex align-items-center mt-4 ms-4 gap-2">
                                  {!isDiable && (
                                    <i
                                      className="fa-solid fa-check"
                                      style={{ cursor: "pointer" }}
                                      onClick={() =>
                                        getVerifyData(invitee.email, index)
                                      }
                                    ></i>
                                  )}

                                  <i
                                    className="fa-solid fa-arrows-rotate"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => resetStudentData(index)}
                                  ></i>
                                </div>
                              )}
                            </div>
                            {invitees[index].is_email_verified && (
                              <>
                                <div className="tu-accordioneduc d-flex">
                                  <div className="form-group-wrap align-items-start">
                                    <div className="form-group form-group-half">
                                      <label className="tu-label">
                                        First Name
                                      </label>
                                      <input
                                        className="w-100"
                                        type="text"
                                        id={`first_name-${index}`}
                                        name={`invitees[${index}].first_name`}
                                        disabled={
                                          invitees[index].is_field_verified
                                        }
                                        onChange={(e) => {
                                          handleUserNameChange(
                                            index,
                                            "first_name",
                                            e.target.value
                                          );
                                        }}
                                        onBlur={formik.handleBlur}
                                        value={invitees[index]?.first_name}
                                      />
                                      {!invitees[index].first_name &&
                                      invitees[index].is_error ? (
                                        <div className="tu-error-message">
                                          First name is required.
                                        </div>
                                      ) : (
                                        <></>
                                      )}
                                    </div>
                                    <div className="form-group form-group-half">
                                      <label className="tu-label">
                                        Last Name
                                      </label>
                                      <input
                                        type="text"
                                        className="w-100"
                                        id={`last_name-${index}`}
                                        name={`invitees[${index}].last_name`}
                                        disabled={
                                          invitees[index].is_field_verified
                                        }
                                        onChange={(e) => {
                                          handleUserNameChange(
                                            index,
                                            "last_name",
                                            e.target.value
                                          );
                                        }}
                                        onBlur={formik.handleBlur}
                                        value={invitees[index]?.last_name}
                                      />
                                      {!invitees[index].last_name &&
                                      invitees[index].is_error ? (
                                        <div className="tu-error-message">
                                          Last Name is required.
                                        </div>
                                      ) : (
                                        <></>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <div className="tu-accordioneduc d-flex">
                                  <div className="form-group-wrap align-items-start">
                                    <div className="form-group form-group-half">
                                      <label className="tu-label">
                                        Contact Number
                                      </label>
                                      <input
                                        type="number"
                                        className="w-100"
                                        id={`contact_number-${index}`}
                                        disabled={
                                          invitees[index].is_field_verified
                                        }
                                        name={`invitees[${index}].contact_number`}
                                        onChange={(e) => {
                                          handleUserNameChange(
                                            index,
                                            "contact_number",
                                            e.target.value
                                          );
                                        }}
                                        onBlur={formik.handleBlur}
                                        value={invitees[index]?.contact_number}
                                      />
                                      {!invitees[index].contact_number &&
                                      invitees[index].is_error ? (
                                        <div className="tu-error-message">
                                          Contact number is required.
                                        </div>
                                      ) : (
                                        <>
                                          {invitees[index]?.contact_number
                                            ?.length !== 10 &&
                                          invitees[index].is_error ? (
                                            <div className="tu-error-message">
                                              contact number must be 10 digit
                                            </div>
                                          ) : (
                                            ""
                                          )}
                                        </>
                                      )}
                                    </div>

                                    <div className="form-group form-group-half">
                                      <label className="tu-label">
                                        Address
                                      </label>
                                      <div className="tu-placeholderholder">
                                        <PlacesAutocomplete
                                          key={index}
                                          value={invitees[index].address}
                                          disabled={
                                            invitees[index].is_field_verified
                                          }
                                          onChange={(newAddress) =>
                                            handleChange(index, newAddress)
                                          }
                                          onSelect={(newAddress) =>
                                            handleSelect(newAddress, index)
                                          }
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
                                                  placeholder:
                                                    "Search Places ...",
                                                  className: "form-control"
                                                })}
                                              />
                                              <div className="autocomplete-dropdown-container">
                                                {loading && (
                                                  <div className="pt-16">
                                                    Loading...
                                                  </div>
                                                )}
                                                {suggestions &&
                                                  suggestions.map(
                                                    (suggestion) => {
                                                      const className =
                                                        suggestion.active
                                                          ? "suggestion-item--active"
                                                          : "suggestion-item";
                                                      const style =
                                                        suggestion.active
                                                          ? {
                                                              backgroundColor:
                                                                "#fafafa",
                                                              cursor: "pointer",
                                                              borderBottom:
                                                                "1px solid #CED4DA",
                                                              padding: "10px"
                                                            }
                                                          : {
                                                              backgroundColor:
                                                                "#ffffff",
                                                              cursor: "pointer",
                                                              borderBottom:
                                                                "1px solid #CED4DA",
                                                              padding: "10px"
                                                            };

                                                      const iconStyle =
                                                        suggestion.active
                                                          ? {
                                                              color: "#007BFF"
                                                            }
                                                          : {};

                                                      return (
                                                        <div
                                                          {...getSuggestionItemProps(
                                                            suggestion,
                                                            {
                                                              className,
                                                              style,
                                                              onClick: () =>
                                                                handleSelect(
                                                                  suggestion.description
                                                                )
                                                            }
                                                          )}
                                                        >
                                                          <FaMapMarkerAlt
                                                            className="location-icon"
                                                            style={iconStyle}
                                                          />
                                                          &nbsp;
                                                          <span className="pt-16 address-suggetion">
                                                            {
                                                              suggestion.description
                                                            }
                                                          </span>
                                                          <br />
                                                        </div>
                                                      );
                                                    }
                                                  )}
                                              </div>
                                            </div>
                                          )}
                                        </PlacesAutocomplete>
                                      </div>
                                      {!invitees[index].address &&
                                      invitees[index].is_error ? (
                                        <div className="tu-error-message">
                                          Address is required.
                                        </div>
                                      ) : (
                                        <></>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
          <div className="form-group">
            <label className="tu-label w-100">Total Price: ${total}</label>
          </div>
          <div className="form-group">
            <label className="tu-label">Notes</label>
            <div className="tu-placeholderholder">
              <textarea
                className="form-control"
                placeholder="Enter description"
                name="introduction"
                maxLength={500}
                onChange={formik.handleChange}
                style={{ height: "200px" }}
              ></textarea>
              <div className="tu-placeholder">
                <span>Enter description</span>
              </div>
            </div>
            {formik.errors.introduction && formik.touched.introduction && (
              <div className="tu-error-message">
                {formik.errors.introduction}
              </div>
            )}
            <div className="tu-input-counter">
              <span>Characters left:</span>
              <b>{500 - formik.values.introduction.length}</b>/<em> 500</em>
            </div>
          </div>
          <div className="form-group tu-formbtn">
            <button type="submit" className="tu-primbtn-lg">
              Save
            </button>
          </div>
        </fieldset>
      </form>
    </div>
  );
};
