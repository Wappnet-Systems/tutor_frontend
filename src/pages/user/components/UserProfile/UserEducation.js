import React, { useEffect, useState } from "react";
import UserReviewForSubmit from "./UserReviewForSubmit";
import { userService } from "../../service/userService";
import Modal from "react-bootstrap/Modal";
import Accordion from "react-bootstrap/Accordion";
import * as Yup from "yup";
import { useFormik } from "formik";
import ReactDatePicker from "react-datepicker";
import moment from "moment";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import UserMessageBanner from "../Banner/UserMessageBanner";
import { useDispatch } from "react-redux";
import { setEducationData } from "../../../../redux/actions/action";

const UserEducation = () => {
  const dispatch = useDispatch();
  const [userEducation, setUserEducation] = useState([]);
  const [show, setShow] = useState(false);
  const [selectedEducationId, setSelectedEducationId] = useState(0);

  const handleClose = () => {
    setShow(false);
    setSelectedEducationId(0);
    formik.resetForm();
  };

  const handleShow = () => setShow(true);

  useEffect(() => {
    getUserEducation();
  }, []);

  const validationSchema = Yup.object().shape({
    course_name: Yup.string().required("Degree Title is required"),
    university_name: Yup.string().required("University Name is required"),
    location: Yup.string().required("Location is required"),
    start_date: Yup.date().required("Start Date is required"),
    end_date: Yup.string(),
    description: Yup.string().required("Description is required"),
    is_ongoing: Yup.bool()
  });

  const formik = useFormik({
    initialValues: {
      course_name: "",
      university_name: "",
      location: "",
      start_date: "",
      end_date: "",
      description: "",
      is_ongoing: false
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      addUpdateUserEducation(values);
    }
  });

  const getUserEducation = () => {
    userService.getUserEducation().then((res) => {
      setUserEducation(res?.data?.data);
      dispatch(setEducationData(res?.data?.data));
    });
  };

  const addUpdateUserEducation = (values) => {
    let body = {
      ...values
    };

    if (!body.is_ongoing && !body?.end_date) {
      return;
    } else {
      // body.start_date = moment(body.start_date).format('YYYY-MM-DD');
      if (!body.is_ongoing && body?.end_date) {
        // body.end_date = moment(body.end_date).format('YYYY-MM-DD');
      } else {
        // body.end_date = moment(new Date()).format('YYYY-MM-DD');
        body.end_date = new Date();
      }

      if (selectedEducationId > 0) {
        userService
          .updateUserEducation(body, selectedEducationId)
          .then((res) => {
            toast.success(res?.data?.message?.[0]);
            handleClose();
            getUserEducation();
          });
      } else {
        userService.addUserEducation(body).then((res) => {
          toast.success(res?.data?.message?.[0]);
          handleClose();
          getUserEducation();
        });
      }
    }
  };

  const deleteUserEducation = (education) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      // icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        userService.deleteUserEducation(education.id).then((res) => {
          toast.success(res?.data?.message?.[0]);
          getUserEducation();
        });
      }
    });
  };

  const future_date_disable = new Date(moment().format("YYYY-MM-DD"));

  const editEducation = (education) => {
    setSelectedEducationId(education.id);
    formik.setFieldValue("course_name", education.course_name);
    formik.setFieldValue("university_name", education.university_name);
    formik.setFieldValue("location", education.location);
    formik.setFieldValue("start_date", new Date(education.start_date));
    formik.setFieldValue("end_date", new Date(education.end_date));
    formik.setFieldValue("description", education.description);
    formik.setFieldValue("is_ongoing", education.is_ongoing);
    handleShow();
  };

  return (
    <>
      <div className="tu-boxwrapper">
        <UserMessageBanner />
        <div className="tu-boxarea">
          <div className="tu-boxsm">
            <div className="tu-boxsmtitle">
              <h4>Education</h4>
              <a href="javascript: void(0)" onClick={handleShow}>
                Add Education
              </a>
            </div>
          </div>
          <div className="tu-box edu">
            {userEducation.length > 0 ? (
              <Accordion className="accordion tu-accordionedu">
                <div id="tu-edusortable" className="tu-edusortable">
                  {userEducation.map((education, key) => (
                    <Accordion.Item
                      eventKey={education.id}
                      className={
                        key != 0
                          ? "tu-accordion-item pt-0"
                          : "tu-accordion-item"
                      }
                    >
                      <Accordion.Header>
                        <div className="tu-expwrapper">
                          <div className="tu-accordionedu">
                            <div className="tu-expinfo ">
                              <div className="tu-accodion-holder">
                                <h5>{education.course_name}</h5>
                                <ul className="tu-branchdetail">
                                  <li>
                                    <i className="icon icon-home"></i>
                                    <span>{education.university_name}</span>
                                  </li>
                                  <li>
                                    <i className="icon icon-map-pin"></i>
                                    <span>{education.location}</span>
                                  </li>
                                  <li>
                                    <i className="icon icon-calendar"></i>
                                    <span>
                                      {moment(education.start_date).format(
                                        "MMMM YYYY"
                                      )}{" "}
                                      -{" "}
                                      {education.is_ongoing
                                        ? "Present"
                                        : moment(education.end_date).format(
                                            "MMMM YYYY"
                                          )}
                                    </span>
                                  </li>
                                </ul>
                              </div>
                              <div className="tu-icon-holder">
                                <a
                                  onClick={() => {
                                    deleteUserEducation(education);
                                  }}
                                >
                                  <i className="icon icon-trash-2 tu-deleteclr"></i>
                                </a>
                                <a
                                  onClick={() => {
                                    editEducation(education);
                                  }}
                                >
                                  <i className="icon icon-edit-3 tu-editclr"></i>
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Accordion.Header>
                      <Accordion.Body>
                        <div
                          id="flush-collapseOneba"
                          className="accordion-collapse collapse show"
                          data-bs-parent="#accordionFlushExampleaa"
                        >
                          <div className="tu-edubodymain">
                            <div className="tu-accordioneduc">
                              <p>{education.description}</p>
                            </div>
                          </div>
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>
                  ))}
                </div>
              </Accordion>
            ) : (
              <h6 className="bold opacity-50">No Education</h6>
            )}
          </div>
          <div className="tu-btnarea-two  pb-4 pe-4">
            <UserReviewForSubmit />
          </div>
        </div>
      </div>

      <Modal show={show} onHide={handleClose} className="mdl">
        <Modal.Header>
          <h5>Add/edit education</h5>
          <a onClick={handleClose} className="tu-close">
            <i className="icon icon-x"></i>
          </a>
        </Modal.Header>
        <Modal.Body>
          <form className="tu-themeform" onSubmit={formik.handleSubmit}>
            <fieldset>
              <div className="tu-themeform__wrap">
                <div className="form-group">
                  <label className="tu-label">Degree/course title</label>
                  <div className="tu-placeholderholder">
                    <input
                      type="text"
                      className="form-control tu-input-field"
                      placeholder="Enter title here"
                      {...formik.getFieldProps("course_name")}
                    />
                    <div className="tu-placeholder">
                      <span>Enter title here</span>
                      <em>*</em>
                    </div>
                  </div>
                  {formik.touched.course_name && formik.errors.course_name ? (
                    <div className="tu-error-message">
                      {formik.errors.course_name}
                    </div>
                  ) : null}
                </div>
                <div className="form-group">
                  <label className="tu-label">University/Institute title</label>
                  <div className="tu-placeholderholder">
                    <input
                      type="text"
                      className="form-control tu-input-field"
                      placeholder="Enter title here"
                      {...formik.getFieldProps("university_name")}
                    />
                    <div className="tu-placeholder">
                      <span>Enter title here</span>
                      <em>*</em>
                    </div>
                  </div>
                  {formik.touched.university_name &&
                  formik.errors.university_name ? (
                    <div className="tu-error-message">
                      {formik.errors.university_name}
                    </div>
                  ) : null}
                </div>
                <div className="form-group">
                  <label className="tu-label">Location</label>
                  <div className="tu-placeholderholder">
                    <input
                      type="text"
                      className="form-control tu-input-field"
                      placeholder="Enter location"
                      {...formik.getFieldProps("location")}
                    />
                    <div className="tu-placeholder">
                      <span>Enter location</span>
                      <em>*</em>
                    </div>
                  </div>
                  {formik.touched.location && formik.errors.location ? (
                    <div className="tu-error-message">
                      {formik.errors.location}
                    </div>
                  ) : null}
                </div>
                <div
                  className="form-group-wrap"
                  style={{ alignItems: "flex-start" }}
                >
                  <div className="form-group pb-0">
                    <label className="tu-label">Start & end date</label>
                  </div>
                  <div className="form-group form-group-half">
                    <div className="position-relative w-100">
                      <ReactDatePicker
                        peekNextMonth
                        showMonthDropdown
                        showYearDropdown
                        {...formik.getFieldProps("dob")}
                        dropdownMode="select"
                        className="form-control mb-3 mb-lg-0 cursor-pointer"
                        dateFormat="dd-MM-yyyy"
                        name="start_date"
                        maxDate={
                          formik.values.end_date < future_date_disable
                            ? formik.values.end_date
                            : future_date_disable
                        }
                        selected={formik.values.start_date}
                        onChange={(date) => {
                          formik.setFieldValue("start_date", date);
                        }}
                        autoComplete="off"
                        onKeyDown={(e) => {
                          e.preventDefault();
                        }}
                        placeholderText="Start Date"
                      />

                      <span
                        className="DatePicker_icon cursor-pointer"
                        onClick={() =>
                          document.getElementsByName("start_date")[0].focus()
                        }
                      >
                        <div className="fa fa-calendar"></div>
                      </span>
                    </div>
                    {formik.errors.start_date && formik.touched.start_date && (
                      <div className="tu-error-message">
                        {formik.errors.start_date}
                      </div>
                    )}
                  </div>
                  {formik.values.is_ongoing ? (
                    <></>
                  ) : (
                    <div className="form-group form-group-half">
                      <div className="position-relative w-100">
                        <ReactDatePicker
                          peekNextMonth
                          showMonthDropdown
                          showYearDropdown
                          dropdownMode="select"
                          className="form-control mb-3 mb-lg-0 cursor-pointer"
                          dateFormat="dd-MM-yyyy"
                          name="end_date"
                          minDate={formik.values.start_date}
                          selected={formik.values.end_date}
                          onChange={(date) => {
                            formik.setFieldValue("end_date", date);
                          }}
                          autoComplete="off"
                          onKeyDown={(e) => {
                            e.preventDefault();
                          }}
                          placeholderText="End Date"
                        />

                        <span
                          className="DatePicker_icon cursor-pointer"
                          onClick={() =>
                            document.getElementsByName("end_date")[0].focus()
                          }
                        >
                          <div className="fa fa-calendar"></div>
                        </span>
                      </div>
                      {!formik.values.end_date && formik.touched.end_date && (
                        <div className="tu-error-message">
                          End Date is required
                        </div>
                      )}
                    </div>
                  )}
                  <div className="form-group pt-0">
                    <div className="tu-check pt-1">
                      <input
                        type="checkbox"
                        id="expcheck2"
                        name="expcheck"
                        checked={formik.values.is_ongoing}
                        onChange={formik.handleChange}
                        {...formik.getFieldProps("is_ongoing")}
                      />
                      <label for="expcheck2">
                        This degree/course is currently ongoing
                      </label>
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <label className="tu-label">Description</label>
                  <div className="tu-placeholderholder">
                    <textarea
                      className="form-control tu-input-field"
                      maxLength="500"
                      placeholder="Enter description"
                      {...formik.getFieldProps("description")}
                    ></textarea>
                    <div className="tu-placeholder">
                      <span>Enter description</span>
                      <em>*</em>
                    </div>
                  </div>
                  {formik.touched.description && formik.errors.description ? (
                    <div className="tu-error-message">
                      {formik.errors.description}
                    </div>
                  ) : (
                    <div className="tu-input-counter">
                      <span>Characters left:</span>
                      <b>{500 - formik.values.description.length}</b>/
                      <em> 500</em>
                    </div>
                  )}
                </div>
                <div className="form-group tu-formbtn">
                  <button type="submit" className="tu-primbtn-lg">
                    Save & update changes
                  </button>
                </div>
              </div>
            </fieldset>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default UserEducation;
