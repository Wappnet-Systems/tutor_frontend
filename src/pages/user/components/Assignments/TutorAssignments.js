import { useFormik } from "formik";
import * as Yup from "yup";
import React, { useEffect, useState } from "react";
import moment from "moment";
import { Modal } from "react-bootstrap";
import Select from "react-select";
import ReactDatePicker from "react-datepicker";
import { toast } from "react-toastify";
import pdfImg from "../../../../assets/general/pdf.png";
import avatarImage from "../../../../assets/banner/avatar_image.jpg";
import { Link } from "react-router-dom";
import { AssignmentStatusType } from "../Bookings/CommonEnum";
import TutorFeedback from "./TutorFeedback";
import Swal from "sweetalert2";
import UserMessageBanner from "../Banner/UserMessageBanner";
import ReactPaginate from "react-paginate";
import UserSubmissionDetails from "./UserSubmissionDetails";
import DescriptionWithModal from "./DescriptionWithModal";
import { assignmentService } from "../../service/assignmentServices";

const TutorAssignments = () => {
  const [show, setShow] = useState(false);
  const [assignmentId, setAssignmentId] = useState(null);
  const [showFeedbackPopup, setShowFeedbackPopup] = useState(false);
  const [showAssignmentDetailsPopup, setShowAssignmentDetailsPopup] =
    useState(false);
  const [showBookings, setShowBookings] = useState(false);
  const [showDeadline, setShowDeadline] = useState(false);
  const [isItemForUpdate, setIsItemForUpdate] = useState(false);
  const [itemIdForUpdate, setItemIdForUpdate] = useState(null);
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const [selectedDescription, setSelectedDescription] = useState("");
  const [bookedStudentList, setBookedStudentList] = useState([]);
  const [tutorAssignmentList, setTutorAssignmentList] = useState([]);
  const [bookedStudentId, setBookedStudentId] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState({
    value: undefined,
    label: undefined
  });
  const [selectedBooking, setSelectedBooking] = useState({
    value: undefined,
    label: undefined,
    startDate: undefined,
    endDate: undefined
  });
  const [studentError, setStudentError] = useState("");
  const [bookingError, setBookingError] = useState("");
  const [fileUploadError, setFileUploadError] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [editAssignmentData, setEditAssignmentData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const limit = 10;
  const sort = "DESC";
  const pageCount = Math.max(Math.ceil(totalCount / limit), 1);
  const past_date_disable = new Date(moment().format("YYYY-MM-DD"));

  const handlePageClick = (selectedPage) => {
    setCurrentPage(selectedPage.selected + 1);
  };

  const handleFileChange = (event) => {
    setFileUploadError(true);
    const file = event.target.files[0];
    if (
      file &&
      (file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "application/pdf")
    ) {
      setSelectedFile(file);
      formik.setFieldValue("file", file);
      setFileUploadError(false);

      if (isItemForUpdate && editAssignmentData) {
        setEditAssignmentData({
          ...editAssignmentData,
          media: URL.createObjectURL(file),
          media_type: file.type.startsWith("image/") ? "image" : "pdf"
        });
      }
    } else {
      toast.error("Please select a valid PDF, JPG, or PNG file.");
    }
  };

  const handleRemoveSelectedFile = () => {
    setSelectedFile(null);
    if (isItemForUpdate) {
      if (editAssignmentData?.media) {
        setEditAssignmentData({
          ...editAssignmentData,
          media: "",
          media_type: ""
        });
      }
    }
    formik.setFieldValue("file", null);
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    target_completion_date: Yup.date().required("Deadline is required")
  });

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      student_user_id: "",
      booking_id: "",
      target_completion_date: "",
      file: null
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const formData = new FormData();
      if (selectedFile) {
        formData.append("file", selectedFile);
      }
      formData.append("media", editAssignmentData?.media);
      formData.append("title", values?.title);
      formData.append("description", values?.description);
      formData.append("student_user_id", selectedStudent?.value);
      formData.append("target_completion_date", values?.target_completion_date);
      formData.append("booking_id", selectedBooking?.value);

      if (!itemIdForUpdate) {
        assignmentService?.addStudentAssignment(formData).then((response) => {
          toast.success(response?.data?.message?.[0]);
          getTutorAssignments();
          handleClose();
        });
      } else {
        assignmentService
          ?.updateUserAssignment(itemIdForUpdate, formData)
          .then((response) => {
            toast.success(response?.data?.message?.[0]);
            getTutorAssignments();
            handleClose();
          });
      }
    }
  });
  const handleShow = () => setShow(true);
  const handleClose = () => {
    setShow(false);
    setShowFeedbackPopup(false);
    setShowBookings(false);
    setShowDeadline(false);
    setShowAssignmentDetailsPopup(false);
    setIsItemForUpdate(false);
    setShowDescriptionModal(false);
    setEditAssignmentData(null);
    formik.resetForm();
    setSelectedStudent({
      value: undefined,
      label: undefined
    });
    setSelectedBooking({
      value: undefined,
      label: undefined
    });
    formik.setFieldValue("file", null);
    setSelectedFile(null);
  };

  const validateStudent = (selectedOption) => {
    if (selectedOption?.value == undefined) {
      setStudentError("Student selection is required");
    } else {
      setSelectedStudent({
        value: selectedOption?.value,
        label: selectedOption?.label
      });
      setStudentError("");
      if (selectedOption?.value) {
        assignmentService
          .getBookedStudentById(selectedOption?.value)
          .then((response) => {
            setBookedStudentId(response?.data?.data);
          });
      }
      setShowBookings(true);
      setSelectedBooking({
        value: undefined,
        label: undefined
      });
    }
  };

  const handleStudentSelectionChange = (studentVal) => {
    validateStudent(studentVal);
  };

  const handleStudentSelectionBlur = () => {
    if (!selectedStudent.value) {
      setStudentError("Student selection is required");
    }
  };

  const handleStudentBookingChange = (BookVal) => {
    validateBooking(BookVal);
  };
  const handleStudentBookingBlur = () => {
    if (!selectedBooking.value) {
      setBookingError("Booking id is required");
    }
  };

  const validateBooking = (selectedOption) => {
    if (selectedOption?.value == undefined) {
      setBookingError("Booking id is required");
    } else {
      setSelectedBooking({
        value: selectedOption?.value,
        label: selectedOption?.label
      });
      setBookingError("");
      formik.setFieldValue(
        "target_completion_date",
        new Date(selectedOption?.end_date)
      );
      setShowDeadline(true);
    }
  };

  const getBookedStudents = () => {
    assignmentService.getBookedStudent().then((response) => {
      setBookedStudentList(response?.data?.data);
    });
  };

  const getTutorAssignments = () => {
    assignmentService
      .getTutorAssignmentData(limit, sort, currentPage)
      .then((response) => {
        setTutorAssignmentList(response?.data?.data?.data);
        setTotalCount(response?.data?.data?.totalItem);
      });
  };

  useEffect(() => {
    getBookedStudents();
    getTutorAssignments();
  }, [currentPage]);

  const getStudentStatusLabel = (status) => {
    switch (status) {
      case AssignmentStatusType.PENDING:
        return "Pending";
      case AssignmentStatusType.DELAYED:
        return "Ongoing";
      case AssignmentStatusType.COMPLETED:
        return "Completed";
      case AssignmentStatusType.CANCELLED:
        return "Cancelled";
      default:
        return "Unknown";
    }
  };

  const deleteUserAssignment = (assign_id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        assignmentService?.deleteUserAssignment(assign_id).then((response) => {
          toast.success(response?.data?.message?.[0]);
          getTutorAssignments();
        });
      }
    });
  };

  const editUserAssignment = (updateId) => {
    setItemIdForUpdate(updateId);
    assignmentService?.getAssignmentById(updateId).then((response) => {
      setEditAssignmentData(response?.data?.data);
      setIsItemForUpdate(true);
      setShow(true);
      setShowBookings(true);
      setShowDeadline(true);
      formik.setFieldValue("title", response?.data?.data?.title);
      formik.setFieldValue("description", response?.data?.data?.description);
      formik.setFieldValue(
        "target_completion_date",
        new Date(response?.data?.data?.target_completion_date)
      );
      setSelectedStudent({
        value: response?.data?.data?.student?.id,
        label: response?.data?.data?.student?.first_name
      });
      setSelectedBooking({
        value: response?.data?.data?.booking?.id,
        label:
          response?.data?.data?.booking?.id +
          " (" +
          (moment(response?.data?.data?.booking?.booking_start_date).format(
            "DD-MM-YYYY"
          ) +
            " to " +
            moment(response?.data?.data?.booking?.booking_end_date).format(
              "DD-MM-YYYY"
            )) +
          ")",
        startDate: response?.data?.data?.booking?.booking_start_date,
        endDate: response?.data?.data?.booking?.booking_end_date
      });
    });
  };

  const handleShowModal = (description) => {
    setSelectedDescription(description);
    setShowDescriptionModal(true);
  };

  const renderDescription = (description) => {
    const maxLength = 20;
    if (description.split(" ").length > maxLength) {
      const words = description.split(" ");
      const truncatedDescription = words.slice(0, maxLength).join(" ");

      return (
        <>
          {truncatedDescription}...{" "}
          <button
            className="show_more_btn"
            onClick={() => handleShowModal(description)}
          >
            Show More
          </button>
        </>
      );
    }
    return description;
  };

  return (
    <>
      <div className="tu-boxwrapper booking-box assignment_box">
        <UserMessageBanner />
        <div className="tu-boxarea pb-3">
          <div className="tu-boxsm">
            <div className="tu-boxsmtitle">
              <h4>Assignments</h4>
              <a
                className=""
                style={{ cursor: "pointer" }}
                onClick={handleShow}
              >
                Add Assignment
              </a>
            </div>
          </div>
          <div className="tu-box">
            {tutorAssignmentList?.length > 0 ? (
              <>
                {tutorAssignmentList?.map((item) => {
                  return (
                    <>
                      <div className="tu-bookingwrapper" key={item?.id}>
                        <div className="tu-bookingperson">
                          <figure>
                            {item?.student?.image === null ? (
                              <img src={avatarImage} alt="Avatar Image" />
                            ) : (
                              <img
                                src={item?.student?.image}
                                alt={`image ${item?.student?.first_name}`}
                              />
                            )}
                          </figure>
                          <div className="tu-bookername row align-items-center">
                            <h4 className="col-12 col-sm-8 col-md-9">
                              {item?.student?.first_name +
                                " " +
                                item?.student?.last_name}
                              {item?.status === null ? (
                                ""
                              ) : (
                                <span className="tu-tagstatus tu-tagongoing">
                                  {getStudentStatusLabel(item?.status)}
                                </span>
                              )}
                            </h4>

                            <div className="tu-icon-holder col-12 col-sm-4 col-md-3 mb-2 mb-sm-0 justify-content-end">
                              <a
                                href="javascript:void(0)"
                                className="tutor_view_submission"
                                onClick={() => {
                                  setAssignmentId(item?.id);
                                  setShowAssignmentDetailsPopup(
                                    !showAssignmentDetailsPopup
                                  );
                                }}
                              >
                                <i className="icon icon-book-open"></i>
                              </a>
                              {item?.status !== 1 && (
                                <>
                                  <a
                                    href="javascript:void(0)"
                                    onClick={() => {
                                      editUserAssignment(item?.id);
                                    }}
                                  >
                                    <i className="icon icon-edit-3 tu-editclr"></i>
                                  </a>
                                  <a
                                    href="javascript:void(0)"
                                    onClick={() => {
                                      deleteUserAssignment(item?.id);
                                    }}
                                  >
                                    <i className="icon icon-trash-2 tu-deleteclr"></i>
                                  </a>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <ul className="tu-bookingonfo">
                          <li>
                            <span>Assignment Question:</span>
                            <h6 className="m-0">{item?.title}</h6>
                          </li>
                          <li>
                            <span>Description: </span>
                            <p className="m-0">
                              {renderDescription(item?.description)}
                            </p>
                          </li>
                          {/* <li>
                            <span>Booking End date:</span>
                            <h6>
                              {moment(item?.booking?.booking_end_date).format(
                                "DD-MM-YYYY h:mm A"
                              )}
                            </h6>
                          </li> */}
                          <li>
                            <span>Deadline</span>
                            <h6>
                              {moment(item.target_completion_date).format(
                                "DD-MM-YYYY"
                              )}
                            </h6>
                          </li>
                        </ul>
                        {item?.status !== 1 && (
                          <div className="tu-btnlist justify-content-center justify-content-sm-end">
                            <button
                              className="tu-primbtn"
                              onClick={() => {
                                setAssignmentId(item?.id);
                                setShowFeedbackPopup(!showFeedbackPopup);
                              }}
                            >
                              Marks assignment as completed
                            </button>
                          </div>
                        )}
                      </div>
                    </>
                  );
                })}
              </>
            ) : (
              <div className="text-secondary fw-bold text-center p-3 w-100">
                No Record Found
              </div>
            )}
          </div>
        </div>
        {tutorAssignmentList?.length >= 1 && (
          <nav className="tu-pagination">
            <ReactPaginate
              pageCount={pageCount}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={handlePageClick}
              containerClassName="pagination"
              activeClassName="active"
              previousLabel={<i className="icon icon-chevron-left"></i>}
              nextLabel={<i className="icon icon-chevron-right"></i>}
            />
          </nav>
        )}
      </div>

      {showAssignmentDetailsPopup && assignmentId && (
        <UserSubmissionDetails
          show={showAssignmentDetailsPopup}
          onHide={handleClose}
          assignment_id={assignmentId}
        />
      )}

      {showFeedbackPopup && (
        <TutorFeedback
          show={showFeedbackPopup}
          onHide={handleClose}
          assignment_Id={assignmentId}
          getTutorAssignments={getTutorAssignments}
        />
      )}

      {showDescriptionModal && selectedDescription && (
        <DescriptionWithModal
          show={showDescriptionModal}
          onHide={handleClose}
          description={selectedDescription}
        />
      )}

      <Modal show={show} onHide={handleClose} className="mdl">
        <Modal.Header>
          <h5>{isItemForUpdate ? "Edit Assignment" : "Add Assignment"}</h5>
          <a
            onClick={handleClose}
            className="tu-close"
            style={{ cursor: "pointer" }}
          >
            <i className="icon icon-x"></i>
          </a>
        </Modal.Header>
        <Modal.Body>
          <form className="tu-themeform" onSubmit={formik.handleSubmit}>
            <fieldset>
              <div className="tu-themeform__wrap align-items-start">
                <div className="form-group">
                  <label className="tu-label">Title</label>
                  <div className="tu-placeholderholder">
                    <input
                      type="text"
                      className="form-control"
                      required
                      placeholder="Assignment title"
                      name="title"
                      {...formik.getFieldProps("title")}
                      value={formik.values?.title}
                    />
                    <div className="tu-placeholder">
                      <span>Assignment title</span>
                      <em>*</em>
                    </div>
                  </div>
                  {formik.touched.title && formik.errors.title ? (
                    <div className="tu-error-message">
                      {formik.errors.title}
                    </div>
                  ) : null}
                </div>

                <div className="form-group form-group-half">
                  <label className="tu-label">Select Student</label>
                  <div className="w-100">
                    <Select
                      name="student_user_id"
                      placeholder="Select student"
                      options={bookedStudentList?.tutorStudents?.map(
                        (item) => ({
                          value: item?.student_id,
                          label: item?.student_first_name
                        })
                      )}
                      onChange={(selectedOption) => {
                        handleStudentSelectionChange(selectedOption);
                      }}
                      onBlur={handleStudentSelectionBlur}
                      value={selectedStudent}
                      isDisabled={isItemForUpdate ? true : false}
                    />
                  </div>
                  {studentError && (
                    <div className="tu-error-message">{studentError}</div>
                  )}
                </div>
                {showBookings && (
                  <div className="form-group form-group-half">
                    <label className="tu-label">Bookings</label>
                    <div className="w-100">
                      <Select
                        name="booking_id"
                        placeholder="Select Booking"
                        options={bookedStudentId?.map((item) => ({
                          value: item?.id,
                          label:
                            item?.id +
                            " (" +
                            (moment(item?.booking_start_date).format(
                              "DD-MM-YYYY"
                            ) +
                              " to " +
                              moment(item?.booking_end_date).format(
                                "DD-MM-YYYY"
                              )) +
                            ")",
                          startDate: item?.booking_end_date,
                          end_date: item?.booking_end_date
                        }))}
                        onChange={(selectedOption) => {
                          handleStudentBookingChange(selectedOption);
                        }}
                        onBlur={handleStudentBookingBlur}
                        value={selectedBooking}
                        isDisabled={isItemForUpdate ? true : false}
                      />
                    </div>
                    {bookingError && (
                      <div className="tu-error-message">{bookingError}</div>
                    )}
                  </div>
                )}

                {showDeadline && (
                  <div className="form-group form-group-half">
                    <label className="tu-label">Deadline</label>
                    <div className="position-relative w-100">
                      <ReactDatePicker
                        peekNextMonth
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        className="form-control mb-3 mb-lg-0 cursor-pointer"
                        dateFormat="dd-MM-yyyy"
                        name="target_completion_date"
                        selected={formik.values.target_completion_date}
                        minDate={past_date_disable}
                        onChange={(date) => {
                          formik.setFieldValue("target_completion_date", date);
                        }}
                        onBlur={formik.handleBlur}
                        autoComplete="off"
                        onKeyDown={(e) => {
                          e.preventDefault();
                        }}
                        placeholderText="Target complete date"
                      />

                      <span
                        className="DatePicker_icon cursor-pointer"
                        onClick={() =>
                          document
                            .getElementsByName("target_completion_date")[0]
                            .focus()
                        }
                      >
                        <div className="fa fa-calendar"></div>
                      </span>
                    </div>
                    {formik.touched.target_completion_date &&
                    !formik.values.target_completion_date ? (
                      <div className="tu-error-message">
                        Deadline is required
                      </div>
                    ) : null}
                  </div>
                )}

                <div className="form-group">
                  <label className="tu-label">Assignment Description</label>
                  <div className="tu-placeholderholder">
                    <textarea
                      className="form-control"
                      placeholder="Enter description"
                      name="description"
                      value={formik.values.description}
                      {...formik.getFieldProps("description")}
                    ></textarea>
                    <div className="tu-placeholder">
                      <span>Enter description</span>
                    </div>
                  </div>
                  {formik.errors.description && formik.touched.description && (
                    <div className="tu-error-message">
                      {formik.errors.description}
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <label className="tu-label">Upload Assignment</label>
                  <div className="tu-uploadphoto position-relative">
                    <>
                      {selectedFile || editAssignmentData?.media ? (
                        <>
                          <div className="file-upload">
                            {selectedFile ? (
                              <div className="selected-file">
                                {selectedFile.type.startsWith("image/") ? (
                                  <img
                                    src={URL.createObjectURL(selectedFile)}
                                    alt="Selected"
                                    className="m-0"
                                    style={{ maxHeight: "200px" }}
                                  />
                                ) : (
                                  <div>
                                    {selectedFile.type ===
                                      "application/pdf" && (
                                      <div>
                                        <img
                                          src={pdfImg}
                                          alt="pdf image"
                                          className="m-0"
                                        />
                                      </div>
                                    )}
                                  </div>
                                )}
                                <button
                                  className="handle-remove-btn"
                                  title="Remove File"
                                  onClick={handleRemoveSelectedFile}
                                >
                                  <i className="icon icon-x"></i>
                                </button>
                              </div>
                            ) : (
                              <>
                                {editAssignmentData?.media !== null && (
                                  <div className="selected-file">
                                    {editAssignmentData?.media_type.startsWith(
                                      "image/"
                                    ) ? (
                                      <img
                                        src={editAssignmentData?.media}
                                        alt="Selected"
                                        className="m-0"
                                        style={{ maxHeight: "200px" }}
                                      />
                                    ) : (
                                      <div>
                                        {editAssignmentData?.media_type ===
                                          "application/pdf" && (
                                          <div>
                                            <a
                                              href={editAssignmentData?.media}
                                              target="_blank"
                                              rel="noreferrer"
                                            >
                                              <img
                                                src={pdfImg}
                                                alt="pdf image"
                                                className="m-0"
                                              />
                                            </a>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                    <button
                                      className="handle-remove-btn"
                                      title="Remove File"
                                      onClick={handleRemoveSelectedFile}
                                    >
                                      <i className="icon icon-x"></i>
                                    </button>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        </>
                      ) : (
                        <>
                          <i className="icon icon-grid"></i>
                          <h5>
                            <label htmlFor="file3">Click here</label> to upload
                            a file
                            <input
                              type="file"
                              id="file3"
                              name="file"
                              accept=".pdf,.jpg,.png"
                              onChange={handleFileChange}
                              onBlur={formik.handleBlur}
                            />
                          </h5>

                          <svg>
                            <rect width="100%" height="100%"></rect>
                          </svg>
                        </>
                      )}
                    </>
                  </div>
                  {fileUploadError && (
                    <div className="error-message">{fileUploadError}</div>
                  )}
                </div>

                <div className="form-group tu-formbtn">
                  <button type="submit" className="tu-primbtn">
                    Save & update
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

export default TutorAssignments;
