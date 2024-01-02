/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-script-url */
import moment from "moment";
import React, { useState } from "react";
import avatarImage from "../../../../../assets/banner/avatar_image.webp";
import { BookingModes } from "../../Bookings/CommonEnum";
import { Button, Modal } from "react-bootstrap";

const ShowOneBooking = ({
  show,
  event,
  onClose,
  handleEventClick,
  setShow
}) => {
  const [showSlot, setShowSlot] = useState(false);
  const [showInvitee, setShowInvitee] = useState(false);

  // Group slots by date
  // const groupedSlots = event?.slot?.reduce((groups, slot) => {
  //   const date = moment(slot.date).format("YYYY-MM-DD");
  //   if (!groups[date]) {
  //     groups[date] = [];
  //   }
  //   groups[date].push(slot);
  //   return groups;
  // }, {});

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

  const handleClose = () => {
    onClose();
  };

  return (
    <>
      <Modal show={show} onHide={() => handleEventClick}>
        <Modal.Header>
          <h5>Student Details</h5>
          <a
            onClick={handleClose}
            className="tu-close"
            style={{ cursor: "pointer" }}
          >
            <i className="icon icon-x"></i>
          </a>
        </Modal.Header>
        <Modal.Body>
          <div className="tu-bookingwrapper p-0">
            <div className="tu-bookingperson">
              <figure>
                {event?.image === null ? (
                  <img src={avatarImage} alt="image" />
                ) : (
                  <img src={event?.image} alt="image" />
                )}
              </figure>
              <div className="tu-bookername">
                <h4>{event?.title}</h4>
                {event?.totalAmount === null ? (
                  <span>$0.00</span>
                ) : (
                  <span>${event?.totalAmount}.00</span>
                )}
              </div>
            </div>
            <ul className="tu-bookingonfo booking-modal">
              <li>
                <span>Booking date:</span>
                <h6>{moment(event?.created_at).format("ddd DD MMMM, YYYY")}</h6>
                <a
                  className="tu-bookingdetails cursor-pointer"
                  data-user_id="2"
                  data-booking_id={event?.bookingId}
                  onClick={() => {
                    setShow(false);
                    setShowSlot(true);
                  }}
                >
                  See booking details
                </a>
              </li>
              <li>
                <span>Booking ID:</span>
                <h6>{event?.bookingId}</h6>
              </li>

              {event?.bookingUser?.length > 1 ? (
                <li>
                  <span>Invitees</span>
                  <h6>{event?.bookingUser?.length} &nbsp;invitees</h6>
                  <a
                    className="tu-bookingdetails cursor-pointer"
                    data-user_id="2"
                    data-booking_id={event?.bookingId}
                    onClick={() => {
                      setShow(false);
                      setShowInvitee(true);
                    }}
                  >
                    See all invitees
                  </a>
                </li>
              ) : (
                ""
              )}
              {event?.mode === null ? (
                ""
              ) : (
                <li>
                  <span>Booking mode:</span>
                  <h6>{getModeStatusLabel(event?.mode)}</h6>
                </li>
              )}

              {event?.mode === BookingModes.OFFLINE ? (
                <li>
                  <span>Booking address:</span>
                  <h6>{event?.address}</h6>
                </li>
              ) : (
                ""
              )}

              {event?.bookingSubject?.length === 0 ? (
                ""
              ) : (
                <li>
                  <span>Subject for:</span>
                  <h6>
                    {event?.bookingSubject?.map((subject, index) => {
                      return (
                        <>
                          {subject?.subject?.subject_name}
                          {index < event?.bookingSubject?.length - 1
                            ? ", "
                            : ""}
                        </>
                      );
                    })}
                  </h6>
                </li>
              )}
              {event?.specialComment === null ? (
                ""
              ) : (
                <li>
                  <span>Special comments:</span>
                  <span>{event?.specialComment}</span>
                </li>
              )}
              {event?.review?.length === 0
                ? ""
                : event?.review?.map((review, index) => {
                    return (
                      <li key={index}>
                        <span>Review:</span>
                        <span>{review?.remarks}</span>
                      </li>
                    );
                  })}

              {event?.rejectionReason === "" ? (
                ""
              ) : (
                <li>
                  <span>Reason of reject request:</span>
                  <span>{event?.rejectionReason}</span>
                </li>
              )}
            </ul>
          </div>
        </Modal.Body>
      </Modal>

      <Modal show={showSlot} onHide={() => setShowSlot(false)}>
        <Modal.Header>
          <div className="tu-popimghead">
            <img src={event?.image || avatarImage} alt="Tutor" />
            <h5>{event?.title} booking details</h5>
          </div>
          <a
            className="tu-close"
            data-bs-dismiss="modal"
            aria-label="Close"
            onClick={() => setShowSlot(false)}
          >
            <i className="icon icon-x"></i>
          </a>
        </Modal.Header>
        <Modal.Body className="tu-bookedslotwrapper">
          <div>
            <div
              className="mCustomScrollBox mCS-light mCSB_vertical mCSB_inside"
              tabIndex="0"
            >
              <div id="mCSB_2_container" className="mCSB_container" dir="ltr">
                {event?.slot?.length === 0 ? (
                  <div className="tu-bookedslots">
                    <div className="tu-freelanceremptylist w-100">
                      <div className="tu-freelanemptytitle">
                        <h4>Oops! No slots for this user</h4>
                        <p>
                          We're sorry but there are no slots available for this
                          user.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="tu-bookedslots" key={event?.slot?.date}>
                    <h5>
                      {moment(event?.slot?.date).format("ddd DD MMMM, YYYY")}
                    </h5>
                    <ul className="tu-checkout tu-checkoutvtwo">
                      {/* {slots.map((slot, index) => ( */}
                      <li>
                        <span>
                          {moment(event?.slot?.from_time).format("HH:mm")}
                          &nbsp; - &nbsp;
                          {moment(event?.slot?.to_time).format("HH:mm")}
                        </span>
                      </li>
                      {/* ))} */}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Modal.Body>
        {/* <Modal.Footer>
          <Button variant="danger" onClick={() => setShowSlot(false)}>
            Close
          </Button>
        </Modal.Footer> */}
      </Modal>

      <Modal show={showInvitee} onHide={() => setShowInvitee(false)}>
        <Modal.Header>
          <div className="tu-popimghead">
            <h5>Invitees details</h5>
          </div>
          <a
            className="tu-close"
            data-bs-dismiss="modal"
            aria-label="Close"
            onClick={() => setShowInvitee(false)}
          >
            <i className="icon icon-x"></i>
          </a>
        </Modal.Header>
        <Modal.Body className="tu-bookedslotwrapper">
          <div className="mCustomScrollbar _mCS_2">
            <div
              id="mCSB_2"
              className="mCustomScrollBox mCS-light mCSB_vertical mCSB_inside"
              tabIndex="0"
            >
              <div id="mCSB_2_container" className="mCSB_container" dir="ltr">
                {event?.bookingUser?.map((invitee, index) => (
                  <div className="tu-savedwrapper w-100 mb-3" key={index}>
                    <div className="tu-savedinfo">
                      <figure>
                        {invitee?.student?.image === null ? (
                          <img src={avatarImage} alt="image" />
                        ) : (
                          <img
                            src={invitee?.student?.image}
                            alt={`img ${invitee?.student?.first_name}`}
                          />
                        )}
                      </figure>
                      <div className="tu-savedtites">
                        <h4>
                          {invitee?.student?.first_name +
                            " " +
                            invitee?.student?.last_name}
                        </h4>
                        <p>{invitee?.student?.email}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal.Body>
        {/* <Modal.Footer>
          <Button variant="danger" onClick={() => setShowInvitee(false)}>
            Close
          </Button>
        </Modal.Footer> */}
      </Modal>
    </>
  );
};

export default ShowOneBooking;
