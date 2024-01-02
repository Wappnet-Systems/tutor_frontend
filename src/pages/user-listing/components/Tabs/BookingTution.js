import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import {
  bookingData,
  getUserBookingData,
} from "../../service/UserListingService";
import { CalendarView } from "../Common/CalenderView";
import TimePicker from "rc-time-picker";
import "rc-time-picker/assets/index.css";
import { TutorBook } from "../Common/TutorBook";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const BookingTution = ({ id, tutorData }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [getBookingData, setGetBookingData] = useState(null);
  const [selectedSlots, setSelectedSlots] = useState({ slots: [] });
  const [endTimeError, setEndTimeError] = useState("");

  const navigate = useNavigate();

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const validationSchema = Yup.object().shape({
    selectedStartDate: Yup.date().required("Please select a start date"),
    selectedEndDate: Yup.date()
      .required("Please select an end date")
      .min(Yup.ref("selectedStartDate"), "End date must be after start date"),
  });

  const formik = useFormik({
    initialValues: {
      selectedStartDate: null,
      selectedEndDate: null,
      selectedDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      selectedStartTime: null,
      selectedEndTime: null,
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);

      const startTime = moment(values.selectedStartTime, "HH:mm");
      const endTime = moment(values.selectedEndTime, "HH:mm");

      if (startTime.isSameOrAfter(endTime)) {
        setEndTimeError("End time must be after start time.");
        setSubmitting(false);
        return;
      } else {
        setEndTimeError(""); // Clear the error message if validation passes
      }

      const formattedStartDate = moment(values.selectedStartDate).format(
        "MMM DD YYYY"
      );
      const formattedEndDate = moment(values.selectedEndDate).format(
        "MMM DD YYYY"
      );

      const object = {
        from_date: formattedStartDate,
        to_date: formattedEndDate,
      };

      try {
        await getUserBookingData(id, object).then((bookingData) => {
          setGetBookingData(bookingData?.data?.data);
        });
      } catch (error) {
        console.error(error);
        setSubmitting(false);
      }
    },
  });

  const handleSelectedSlotsChange = (newSelectedSlots) => {
    setSelectedSlots(newSelectedSlots);
  };

  const handleTutorBookingSubmit = async (obj) => {
    try {
      const response = await bookingData(obj);
      toast.success(response?.data?.message?.[0]);
      navigate("/user/bookings");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="tu-tabswrapper">
      <div className="tu-tabstitle">
        <h4>Please select booking details</h4>
      </div>

      <div className="tu-listinginfo_service">
        <form
          className="tu-themeform"
          onSubmit={formik.handleSubmit}
          noValidate
        >
          <fieldset>
            <div className="tu-themeform__wrap">
              <div className="tu-description">
                <div className="form-group-wrap align-items-start">
                  <div className="form-group form-group-half">
                    <label className="tu-label">I need a service from</label>
                    <div className="position-relative w-100">
                      <DatePicker
                        selected={startDate}
                        onChange={(date) => {
                          formik.setFieldValue("selectedStartDate", date);
                          setStartDate(date);
                        }}
                        className="w-100"
                        selectsStart
                        minDate={new Date()}
                        startDate={startDate}
                        endDate={endDate}
                        placeholderText="Starting date*"
                        name="selectedStartDate"
                        id="selectedStartDate"
                        autoComplete="off"
                      />
                      <span
                        className="DatePicker_icon cursor-pointer"
                        onClick={() =>
                          document
                            .getElementsByName("selectedStartDate")[0]
                            .focus()
                        }
                      >
                        <div className="fa fa-calendar"></div>
                      </span>
                    </div>

                    {formik.errors.selectedStartDate &&
                      formik.touched.selectedStartDate && (
                        <div className="tu-error-message">
                          {formik.errors.selectedStartDate}
                        </div>
                      )}
                  </div>
                  <div className="form-group form-group-half">
                    <label className="tu-label w-100">Till date</label>
                    <div className="position-relative w-100">
                      <DatePicker
                        selected={endDate}
                        onChange={(date) => {
                          formik.setFieldValue("selectedEndDate", date);
                          setEndDate(date);
                        }}
                        className="w-100"
                        selectsEnd
                        startDate={startDate}
                        endDate={endDate}
                        minDate={startDate}
                        placeholderText="Ending date*"
                        id="selectedEndDate"
                        name="selectedEndDate"
                        autoComplete="off"
                      />
                      <span
                        className="DatePicker_icon cursor-pointer"
                        onClick={() =>
                          document
                            .getElementsByName("selectedEndDate")[0]
                            .focus()
                        }
                      >
                        <div className="fa fa-calendar"></div>
                      </span>
                    </div>
                    {formik.errors.selectedEndDate &&
                      formik.touched.selectedEndDate && (
                        <div className="tu-error-message">
                          {formik.errors.selectedEndDate}
                        </div>
                      )}
                  </div>
                </div>
                <div className="form-group-wrap align-items-start">
                  <div className="form-group form-group-half">
                    <label className="tu-label w-100">Select Start Time</label>
                    <TimePicker
                      showSecond={false}
                      minuteStep={1}
                      value={formik.values.selectedStartTime}
                      onChange={(time) => {
                        formik.setFieldValue("selectedStartTime", time);
                      }}
                      className="tu-timepicker w-100"
                      placeholder="Start Time"
                    />
                  </div>
                  <div className="form-group form-group-half">
                    <label className="tu-label w-100">Select End Time</label>
                    <TimePicker
                      showSecond={false}
                      minuteStep={1}
                      value={formik.values.selectedEndTime}
                      onChange={(time) => {
                        formik.setFieldValue("selectedEndTime", time);
                      }}
                      className="tu-timepicker w-100"
                      placeholder="End Time"
                    />
                    {endTimeError && (
                      <div className="tu-error-message">{endTimeError}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="tu-label w-100">Select Days</label>
              <ul className="d-flex flex-wrap ps-0">
                {daysOfWeek.map((day) => (
                  <li key={day}>
                    <div className="tu-check tu-checksm tu-box w-100 p-0">
                      <input
                        type="checkbox"
                        id={`expcheck${day}`}
                        name="selectedDays"
                        value={day}
                        checked={formik.values.selectedDays.includes(day)}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      <label htmlFor={`expcheck${day}`}>{day}</label>
                    </div>
                  </li>
                ))}
              </ul>
              {formik.touched.selectedDays && formik.errors.selectedDays && (
                <div className="tu-error-message">
                  {formik.errors.selectedDays}
                </div>
              )}
            </div>
            <div className="form-group w-50 tu-formbtn">
              <button className="tu-primbtn-lg" type="submit">
                Show availability
              </button>
            </div>
          </fieldset>
        </form>
      </div>
      {getBookingData !== null && (
        <>
          <div className="form-group-wrap">
            <div className="form-group">
              <label className="tu-label w-100">Select slots</label>
              <CalendarView
                getBookingData={getBookingData}
                id={id}
                tutorData={tutorData}
                selectedSlots={selectedSlots}
                onSelectedSlotsChange={handleSelectedSlotsChange}
                selectedDays={formik.values.selectedDays}
                selectedStartTime={formik.values.selectedStartTime}
                selectedEndTime={formik.values.selectedEndTime}
                startDate={formik?.values?.selectedStartDate}
                endDate={formik?.values?.selectedEndDate}
              />
              <TutorBook
                id={id}
                getBookingData={getBookingData}
                selectedSlots={selectedSlots}
                tutorData={tutorData}
                onSubmit={handleTutorBookingSubmit}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};
