/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useEffect, useState } from "react";
import ReactDatePicker from "react-datepicker";
import Select from "react-select";
import avatarImage from "../../../../assets/banner/avatar_image.webp";
import moment from "moment";
import { Link } from "react-router-dom";
import AddReviewPopup from "./Modal/AddReviewPopup";
import { BookingStatusType } from "./CommonEnum";
import { BookingModes } from "./CommonEnum";
import ReactPaginate from "react-paginate";
import StudentsSlotsDetails from "./Modal/StudentsSlotsDetails";
import PaymentPopup from "./Modal/PaymentPopup";
import { useSelector } from "react-redux";
import StudentInviteesDetails from "./Modal/StudentInviteesPopup";
import { bookingService } from "../../service/booking.service";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const StudentBookings = () => {
  let userData = useSelector((state) => state.userData?.userData);
  const [selectedToDate, setSelectedToDate] = useState(null);
  const [selectedFromDate, setSelectedFromDate] = useState(null);
  const [todateError, setToDateError] = useState(null);
  const [fromdateError, setFromDateError] = useState(null);
  const [allBooking, setAllBooking] = useState([]);
  const [showReviewPopup, setShowReviewPopup] = useState(false);
  const [showInviteePopup, setShowInviteePopup] = useState(false);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [selectedBookingIndex, setSelectedBookingIndex] = useState(null);
  const [bookingId, setBookingId] = useState(null);
  const [bookingAmount, setBookingAmount] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const limit = 10;
  const sort = "DESC";

  const handleCloseModal = () => {
    setShowReviewPopup(false);
    setShowPaymentPopup(false);
    setShowInviteePopup(false);
    setSelectedBookingIndex(null);
    setBookingAmount(null);
    getBookingList();
  };
  const handleToDateChange = (date) => {
    setSelectedToDate(date);
    if (date && selectedFromDate && date < selectedFromDate) {
      setToDateError("End date cannot be before start date");
    } else {
      setToDateError(null);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const handleFromDateChange = (date) => {
    setSelectedFromDate(date);
    if (date && selectedToDate && date > selectedToDate) {
      setFromDateError("Start date cannot be after end date");
    } else {
      setFromDateError(null);
    }
  };

  const getBookingList = () => {
    const toDate = selectedToDate
      ? moment(selectedToDate).format("YYYY-MM-DD")
      : null;

    const fromDate = selectedFromDate
      ? moment(selectedFromDate).format("YYYY-MM-DD")
      : null;

    const status = selectedStatus?.value;
    bookingService
      .getBooking(limit, sort, currentPage, toDate, fromDate, status)
      .then((response) => {
        setAllBooking(response?.data?.data?.bookingDetail?.data);
        setTotalCount(response?.data?.data?.bookingDetail?.totalItem);
      });
  };

  useEffect(() => {
    getBookingList();
  }, [selectedStatus, selectedToDate, selectedFromDate, currentPage]);

  const handleResetSearch = () => {
    setSelectedStatus(null);
    setSelectedToDate(null);
    setSelectedFromDate(null);
    setFromDateError(null);
    setToDateError(null);
    getBookingList();
  };

  const BookingOption = [
    { value: "0", label: "Pending" },
    { value: "1", label: "Accepted" },
    { value: "2", label: "Rejected" },
    { value: "3", label: "Payment Pending" },
    { value: "4", label: "Ongoing" },
    { value: "5", label: "Completed" },
    { value: "6", label: "Cancelled" },
    { value: "7", label: "Payment Failed" },
    { value: "8", label: "Payment Completed" }
  ];

  const getModeStatusLabel = (mode) => {
    switch (mode) {
      case BookingModes.ONLINE:
        return "Online";
      case BookingModes.OFFLINE:
        return "Offline";
      default:
        return "Unknown";
    }
  };

  const getBookingStatusLabel = (status) => {
    switch (status) {
      case BookingStatusType.PENDING:
        return "Pending";
      case BookingStatusType.ACCEPTED:
        return "Accepted";
      case BookingStatusType.REJECTED:
        return "Rejected";
      case BookingStatusType.PAYMENT_PENDING:
        return "Payment Pending";
      case BookingStatusType.ONGOING:
        return "Ongoing";
      case BookingStatusType.COMPLETED:
        return "Completed";
      case BookingStatusType.CANCELLED:
        return "Cancelled";
      case BookingStatusType.PAYMENT_FAILED:
        return "Payment Failed";
      case BookingStatusType.PAYMENT_COMPLETED:
        return "Payment Completed";
      default:
        return "Unknown";
    }
  };

  const pageCount = Math.max(Math.ceil(totalCount / limit), 1);

  const handlePageClick = (selectedPage) => {
    setCurrentPage(selectedPage?.selected + 1);
  };

  const handleCancel = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, cancel it!"
    }).then((result) => {
      if (result.isConfirmed) {
        bookingService.cancelRequest(id).then((res) => {
          toast.success("Booking Cancelled Successfully");
          getBookingList();
        });
      }
    });
  };
  const handleReset = () => {
    setSelectedStatus(null);
    setSelectedToDate(null);
    setSelectedFromDate(null);
    getBookingList();
    setFromDateError(null);
    setToDateError(null);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedStatus]);

  return (
    <>
      <div className="tu-boxwrapper booking-box booking_page">
        <div className="tu-boxarea">
          <div className="tu-boxsm ">
            <div className="tu-boxsmtitle">
              <h4 className="w-40 booking-title">My Bookings</h4>
              <div className="booking-filter-box d-none d-md-flex w-60 gap-2 justify-content-end">
                <span>Filter by : </span>
                <Select
                  className="w-60"
                  placeholder="All Status"
                  options={BookingOption}
                  onChange={(selectedOption) => {
                    setSelectedStatus(selectedOption);
                  }}
                  value={
                    selectedStatus
                      ? { value: selectedStatus, label: selectedStatus?.label }
                      : null
                  }
                />
                <button
                  type="reset"
                  onClick={handleReset}
                  className="btn btn-color-muted btn-active-light-primary m-0 p-0"
                  style={{ fontSize: "x-large", border: "none" }}
                >
                  <i className="fa-solid fa-rotate"></i>
                </button>
              </div>
            </div>
          </div>
          <div className="tu-boxsm d-flex gap-2">
            <div className="booking-filter-box d-flex d-md-none w-100 gap-2 justify-content-start">
              <span>Filter by : </span>
              <Select
                className="w-60"
                placeholder="All Status"
                options={BookingOption}
                onChange={(selectedOption) => {
                  setSelectedStatus(selectedOption);
                }}
                value={
                  selectedStatus
                    ? { value: selectedStatus, label: selectedStatus?.label }
                    : null
                }
              />
              <button
                type="reset"
                onClick={handleReset}
                className="btn btn-color-muted btn-active-light-primary m-0 p-0"
                style={{ fontSize: "x-large", border: "none" }}
              >
                <i className="fa-solid fa-rotate"></i>
              </button>
            </div>
            <div className=" w-100 gap-2">
              <h6 className="pt-2">Start Date :</h6>
              <div className="position-relative booking-datepicker">
                <ReactDatePicker
                  peekNextMonth
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  className="form-control mb-0 mb-lg-0"
                  dateFormat="dd-MM-yyyy"
                  name="from_date"
                  autoComplete="off"
                  onKeyDown={(e) => {
                    e.preventDefault();
                  }}
                  placeholderText="start Date"
                  selected={selectedFromDate}
                  onChange={handleFromDateChange}
                />
                <span
                  className="DatePicker_icon"
                  style={{ cursor: "pointer" }}
                  onClick={() => document.getElementsByName("date")[0].focus()}
                >
                  <div className="fa fa-calendar"></div>
                </span>
              </div>
              {fromdateError && <p className="text-danger">{fromdateError}</p>}
            </div>

            <div className=" w-100 gap-2">
              <h6 className="pt-2">End Date :</h6>
              <div className="position-relative booking-datepicker">
                <ReactDatePicker
                  peekNextMonth
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  className="form-control mb-0 mb-lg-0"
                  dateFormat="dd-MM-yyyy"
                  name="to_date"
                  autoComplete="off"
                  onKeyDown={(e) => {
                    e.preventDefault();
                  }}
                  placeholderText="End Date"
                  selected={selectedToDate}
                  onChange={handleToDateChange}
                />
                <span
                  className="DatePicker_icon"
                  style={{ cursor: "pointer" }}
                  onClick={() => document.getElementsByName("date")[0].focus()}
                >
                  <div className="fa fa-calendar"></div>
                </span>
              </div>
              {todateError && <p className="text-danger">{todateError}</p>}
            </div>
          </div>

          <div className="tu-box">
            {allBooking?.length === 0 ? (
              <div className="tu-bookingwrapper" style={{ padding: "66px" }}>
                <div className="tu-freelanceremptylist w-100">
                  <div className="tu-freelanemptytitle">
                    <h4>Oops! No data match with your keyword</h4>
                    <p>
                      We're sorry but there is no instructors found according to
                      your search criteria
                    </p>

                    <Link
                      to="/user/bookings"
                      className="tu-primbtn"
                      onClick={handleResetSearch}
                    >
                      Reset search &amp; start over
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              allBooking?.map((item, index) => {
                return (
                  <div className="tu-bookingwrapper" key={item?.booking?.id}>
                    <div className="tu-bookingperson">
                      <figure>
                        {item?.tutor?.image === null ? (
                          <img src={avatarImage} alt="Ava Nguyen" />
                        ) : (
                          <img
                            src={item?.booking?.tutor?.image}
                            alt="Ava Nguyen"
                          />
                        )}
                      </figure>
                      <div className="tu-bookername">
                        <h4>
                          <span>
                            <Link
                              to={`/search-listing-view/${item?.booking?.tutor?.id}`}
                              className="tu-name"
                              onClick={() => scrollToTop()}
                            >
                              {item?.booking?.tutor?.first_name}{" "}
                              {item?.booking?.tutor?.last_name}
                            </Link>
                          </span>

                          {item?.booking?.status === null ? (
                            ""
                          ) : (
                            <span className="tu-tagstatus tu-tagongoing">
                              {getBookingStatusLabel(item?.booking?.status)}
                            </span>
                          )}
                        </h4>
                        {item?.booking?.total_amount === null ? (
                          <span>$0.00</span>
                        ) : (
                          <span>${item?.booking?.total_amount}.00</span>
                        )}
                      </div>
                    </div>
                    <ul className="tu-bookingonfo">
                      <li>
                        <span>Booking date:</span>
                        <h6>
                          {moment(item?.booking?.created_at).format(
                            "ddd DD MMMM, YYYY"
                          )}
                        </h6>
                        <a
                          className="tu-bookingdetails cursor-pointer"
                          data-booking_id={item?.booking?.id}
                          onClick={() => {
                            setBookingId(item?.booking?.id);
                            setSelectedBookingIndex(index);
                          }}
                        >
                          See booking details
                        </a>
                      </li>
                      <li>
                        <span>Booking ID:</span>
                        <h6>{item?.booking?.id}</h6>
                      </li>
                      {item?.booking?.invitees?.length > 1 ? (
                        <li>
                          <span>Invitees</span>
                          <h6>
                            {item?.booking?.invitees?.length} &nbsp;invitees
                          </h6>
                          <a
                            className="tu-bookingdetails cursor-pointer"
                            data-user_id="2"
                            data-booking_id={item?.id}
                            onClick={() => {
                              setBookingId(item?.booking?.id);
                              setShowInviteePopup(true);
                            }}
                          >
                            See all invitees
                          </a>
                        </li>
                      ) : (
                        ""
                      )}

                      {item?.booking?.mode === null ? (
                        ""
                      ) : (
                        <li>
                          <span>Booking mode:</span>
                          <h6>{getModeStatusLabel(item?.booking?.mode)}</h6>
                        </li>
                      )}

                      {item?.booking?.mode === BookingModes.OFFLINE ? (
                        <li>
                          <span>Booking address:</span>
                          <h6>{item?.booking?.address}</h6>
                        </li>
                      ) : (
                        ""
                      )}

                      {item?.booking?.bookingSubjects?.length === 0 ? (
                        ""
                      ) : (
                        <li>
                          <span>Subject for:</span>
                          <h6>
                            {item?.booking?.bookingSubjects?.map(
                              (subject, index) => {
                                return (
                                  <>
                                    {subject?.subject?.subject_name}
                                    {index <
                                    item?.booking?.bookingSubjects?.length - 1
                                      ? ", "
                                      : ""}
                                  </>
                                );
                              }
                            )}
                          </h6>
                        </li>
                      )}

                      {item?.booking?.special_comments === null ? (
                        ""
                      ) : (
                        <li>
                          <span>Special comments:</span>
                          <span>{item?.booking?.special_comments}</span>
                        </li>
                      )}

                      {item?.booking?.reviews?.length === 0
                        ? ""
                        : item?.booking?.reviews?.map((review, index) => {
                            return (
                              <li key={index}>
                                <span>Review:</span>
                                <span>{review?.remarks}</span>
                              </li>
                            );
                          })}
                      {item?.booking?.rejection_reason === "" ? (
                        ""
                      ) : (
                        <li key={index}>
                          <span>Reason of reject request:</span>
                          <span>{item?.booking?.rejection_reason}</span>
                        </li>
                      )}
                    </ul>
                    <div
                      className={`tu-btnlist ${
                        item?.booking?.reviews?.length === 0
                          ? ""
                          : "justify-content-between"
                      }`}
                    >
                      {item?.booking?.reviews?.length === 0
                        ? ""
                        : item?.booking?.reviews?.map((review, index) => {
                            return (
                              <div key={index} className="d-flex gap-1 pt-2">
                                <div>{review?.rating}.0</div>
                                <span
                                  className={`tu-stars ${
                                    review.rating === 4
                                      ? "tu-fourstar"
                                      : review.rating === 3
                                      ? "tu-threestar"
                                      : review.rating === 2
                                      ? "tu-twostar"
                                      : review.rating === 1
                                      ? "tu-onestar"
                                      : ""
                                  } mt-1`}
                                >
                                  <span></span>
                                </span>
                              </div>
                            );
                          })}

                      {(item.booking?.status ==
                        BookingStatusType.PAYMENT_PENDING ||
                        item.booking?.status ==
                          BookingStatusType.PAYMENT_FAILED) &&
                        userData?.id === item?.booking?.student_user_id && (
                          <>
                            <button
                              onClick={() => {
                                setBookingId(item?.booking?.id);
                                setShowPaymentPopup(!showPaymentPopup);
                                setBookingAmount(
                                  parseInt(item?.booking?.total_amount)
                                );
                              }}
                              type="button"
                              className="tu-primbtn-lg tu-primbtn-orange"
                              style={{
                                height: "40px",
                                backgroundColor: "#6A307D"
                              }}
                            >
                              Make Payment
                            </button>
                          </>
                        )}

                      {item?.booking?.status == BookingStatusType.CANCELLED ||
                      item?.booking?.status == BookingStatusType.COMPLETED ||
                      item?.booking?.status ==
                        BookingStatusType.PAYMENT_COMPLETED ||
                      item?.booking?.status == BookingStatusType.ONGOING ||
                      item?.booking?.status == BookingStatusType.REJECTED ? (
                        ""
                      ) : userData?.id === item?.booking?.student_user_id ? (
                        <button
                          onClick={() => {
                            handleCancel(item?.booking?.id);
                          }}
                          type="button"
                          className="tu-primbtn-lg tu-primbtn-orange"
                          style={{
                            height: "40px"
                          }}
                        >
                          Cancel
                        </button>
                      ) : (
                        ""
                      )}

                      {item?.booking?.status == BookingStatusType.COMPLETED &&
                        item?.booking?.reviews?.length === 0 && (
                          <div className="tu-droplist">
                            <a
                              data-bs-toggle="collapse"
                              role="button"
                              onClick={() => {
                                setBookingId(item?.booking?.id);
                                setShowReviewPopup(!showReviewPopup);
                              }}
                              aria-controls="collapseExample874"
                            >
                              Add Reviews
                            </a>
                          </div>
                        )}

                      {(item?.booking?.status ==
                        BookingStatusType.PAYMENT_COMPLETED ||
                        item?.booking?.status == BookingStatusType.ONGOING) && (
                        <Link
                          className="tu-pb tu-btnorangesm wpguppy_start_chat"
                          data-receiver_id="2"
                          to={`/chat/${item?.booking?.tutor.id}`}
                        >
                          <i className="icon icon-message-square"></i>
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {showReviewPopup && (
        <AddReviewPopup onClose={handleCloseModal} booking_id={bookingId} />
      )}
      {showPaymentPopup && (
        <PaymentPopup
          onClose={handleCloseModal}
          booking_id={bookingId}
          booking_amount={bookingAmount}
        />
      )}
      {showInviteePopup && (
        <StudentInviteesDetails
          onClose={handleCloseModal}
          booking_id={bookingId}
          allBooking={allBooking}
        />
      )}
      {selectedBookingIndex !== null && (
        <StudentsSlotsDetails
          onClose={handleCloseModal}
          booking_id={bookingId}
          allBooking={allBooking}
        />
      )}
      {allBooking?.length >= 1 && (
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
    </>
  );
};

export default StudentBookings;
