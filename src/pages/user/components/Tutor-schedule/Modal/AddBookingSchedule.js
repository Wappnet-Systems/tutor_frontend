/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import TimePicker from "rc-time-picker";
import ReactDatePicker from "react-datepicker";
import { Button, Modal } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { tutorScheduleService } from "../../../service/tutorScheduleService";
import moment from "moment";
import { toast } from "react-toastify";

const AddBookingSchedule = ({
  onClose,
  show,
  selectedDay,
  getAllScheduleData
}) => {
  const [userTimeZone, setUserTimeZone] = useState(null);

  const validationSchema = Yup.object().shape({
    from_date: Yup.date().required("Start Date is required"),
    to_date: Yup.date()
      .required("End Date is required")
      .min(Yup.ref("from_date"), "End Date must be after Start Date"),
    from_time: Yup.date()
      .required("Start Time is required")
      .test(
        "is-greater-than-current-time",
        "Start Time must be greater than current time",
        function (value) {
          const currentTime = moment();
          const selectedDate = moment(this.parent.from_date);
          const selectedDateTime = moment(selectedDate).set({
            hour: value.getHours(),
            minute: value.getMinutes(),
            second: value.getSeconds()
          });
          return selectedDateTime.isAfter(currentTime);
        }
      ),
    to_time: Yup.date()
      .required("End Time is required")
      .min(Yup.ref("from_time"), "End Time must be after Start Time")
  });

  useEffect(() => {
    const getUserTimeZone = () => {
      if ("Intl" in window && "DateTimeFormat" in Intl) {
        setUserTimeZone(
          Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC"
        );
      } else {
        setUserTimeZone("UTC");
      }
    };

    getUserTimeZone();
  }, []);

  const handleSubmit = async (values) => {
    try {
      const fromDateUtc = new Date(values.from_date).toISOString();
      const toDateUtc = new Date(values.to_date).toISOString();

      const fromTimeUtc = new Date(values.from_time).toISOString();

      const toTimeUtc = new Date(values.to_time).toISOString();

      await tutorScheduleService.addTutorSchedule(
        fromDateUtc,
        toDateUtc,
        fromTimeUtc,
        toTimeUtc,
        parseInt(selectedDay),
        userTimeZone
      );
      toast.success("Your schedule has been added successfully");
      getAllScheduleData();
      handleClose();
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  const initialValues = {
    from_date: "",
    to_date: "",
    from_time: "",
    to_time: ""
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: handleSubmit
  });

  const handleClose = () => {
    onClose();
  };

  const filterDates = (date) => {
    // Filter out the dates that do not match the selectedDay
    const dayOfWeek = moment(date).isoWeekday();
    return dayOfWeek === selectedDay;
  };

  return (
    <>
      <Modal show={show} onHide={() => !show}>
        <Modal.Header>
          <h5>Add Your Schedule</h5>
          <a
            onClick={handleClose}
            className="tu-close"
            style={{ cursor: "pointer" }}
          >
            <i className="icon icon-x"></i>
          </a>
        </Modal.Header>
        <Modal.Body>
          <form
            className="tu-themeform"
            id="tu-booking-decline-form"
            onSubmit={formik.handleSubmit}
          >
            <fieldset>
              <div className="tu-themeform__wrap">
                <div className="form-group-wrap align-items-start">
                  <div className="form-group form-group-half">
                    <label className="tu-label">Start Date :</label>
                    <div className="position-relative w-100">
                      <ReactDatePicker
                        peekNextMonth
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        className="form-control mb-3 mb-lg-0"
                        dateFormat="dd-MM-yyyy"
                        name="from_date"
                        autoComplete="off"
                        onKeyDown={(e) => {
                          e.preventDefault();
                        }}
                        placeholderText="Start Date"
                        selected={formik.values.from_date}
                        onChange={(date) =>
                          formik.setFieldValue("from_date", date)
                        }
                        onBlur={formik.handleBlur}
                        minDate={new Date()}
                        filterDate={filterDates}
                      />
                      <span
                        className="DatePicker_icon"
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          document.getElementsByName("from_date")[0].focus()
                        }
                      >
                        <div className="fa fa-calendar"></div>
                      </span>
                    </div>

                    {formik.touched.from_date && formik.errors.from_date && (
                      <div className="tu-error-message">
                        {formik.errors.from_date}
                      </div>
                    )}
                  </div>

                  <div className="form-group form-group-half">
                    <label className="tu-label">End Date :</label>
                    <div className="position-relative w-100">
                      <ReactDatePicker
                        peekNextMonth
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        className="form-control mb-3 mb-lg-0"
                        dateFormat="dd-MM-yyyy"
                        name="to_date"
                        autoComplete="off"
                        onKeyDown={(e) => {
                          e.preventDefault();
                        }}
                        placeholderText="End Date"
                        selected={formik.values.to_date}
                        onChange={(date) =>
                          formik.setFieldValue("to_date", date)
                        }
                        onBlur={formik.handleBlur}
                        minDate={formik.values.from_date}
                        filterDate={filterDates}
                      />
                      <span
                        className="DatePicker_icon"
                        style={{ cursor: "pointer" }} // Apply the pointer cursor style
                        onClick={() =>
                          document.getElementsByName("to_date")[0]?.focus()
                        }
                      >
                        <div className="fa fa-calendar"></div>
                      </span>
                    </div>
                    {formik.touched.to_date && formik.errors.to_date && (
                      <div className="tu-error-message">
                        {formik.errors.to_date}
                      </div>
                    )}
                  </div>

                  <div className="form-group form-group-half">
                    <label className="tu-label">Start Time :</label>
                    <div className="position-relative w-100">
                      <TimePicker
                        showSecond={false}
                        minuteStep={1}
                        value={formik.values.from_time}
                        onChange={(time) => {
                          formik.setFieldValue("from_time", time);
                        }}
                        className="tu-timepicker w-100"
                        placeholder="Start Time"
                        onBlur={formik.handleBlur("from_time")}
                      />
                    </div>
                    {formik.touched.from_time && formik.errors.from_time && (
                      <div className="tu-error-message">
                        {formik.errors.from_time}
                      </div>
                    )}
                  </div>
                  <div className="form-group form-group-half">
                    <label className="tu-label">End Time :</label>
                    <div className="position-relative w-100">
                      <TimePicker
                        showSecond={false}
                        minuteStep={1}
                        value={formik.values.to_time}
                        onChange={(time) => {
                          formik.setFieldValue("to_time", time);
                        }}
                        className="tu-timepicker w-100"
                        placeholder="End Time"
                        onBlur={formik.handleBlur("to_time")}
                      />
                    </div>
                    {formik.touched.to_time && formik.errors.to_time && (
                      <div className="tu-error-message">
                        {formik.errors.to_time}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </fieldset>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            style={{ background: "#6A307D", padding: "10px 30px" }}
            className="fs-5 fw-bold"
            onClick={formik.handleSubmit}
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddBookingSchedule;
