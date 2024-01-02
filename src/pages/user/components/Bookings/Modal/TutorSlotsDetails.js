/* eslint-disable jsx-a11y/anchor-is-valid */
import moment from "moment";
import React from "react";
import avatarImage from "../../../../../assets/banner/avatar_image.webp";

const TutorsSlotsDetails = ({ onClose, booking_id, allBooking }) => {
  const handleClose = () => {
    onClose();
  };

  const filteredBooking = allBooking?.find((item) => item?.id === booking_id);

  if (!filteredBooking) {
    return null;
  }

  const booking = filteredBooking;

  // Group slots by date
  const groupedSlots = booking?.slots?.reduce((groups, slot) => {
    const date = moment(slot.date).format("YYYY-MM-DD");
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(slot);
    return groups;
  }, {});

  return (
    <>
      <div
        className="modal fade d-block tuturn-profilepopup tu-uploadprofile tuturn-popup show"
        tabIndex={-1}
        id="tuturn-modal-popup"
        aria-modal="true"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered booking-slot-details">
          <div className="tuturn-modalcontent modal-content">
            <div id="tuturn-model-body">
              <div className="modal-header">
                <div className="tu-popimghead">
                  <img
                    src={booking?.student?.image || avatarImage}
                    alt="Tutor"
                  />
                  <h5>
                    {booking?.student?.first_name}&nbsp;
                    {booking?.student?.last_name} booking details
                  </h5>
                </div>
                <a
                  className="tu-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={handleClose}
                >
                  <i className="icon icon-x"></i>
                </a>
              </div>
              <div className="modal-body tu-bookedslotwrapper">
                <div className="mCustomScrollbar _mCS_2">
                  <div
                    id="mCSB_2"
                    className="mCustomScrollBox mCS-light mCSB_vertical mCSB_inside"
                    tabIndex="0"
                  >
                    <div
                      id="mCSB_2_container"
                      className="mCSB_container"
                      dir="ltr"
                    >
                      {booking?.slots?.length === 0 ? (
                        <div className="tu-bookedslots">
                          <div className="tu-freelanceremptylist w-100">
                            <div className="tu-freelanemptytitle">
                              <h4>Oops! No slots for this user</h4>
                              <p>
                                We're sorry but there are no slots available for
                                this user.
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        groupedSlots &&
                        Object.entries(groupedSlots)
                          .sort(([dateA, slotsA], [dateB, slotsB]) => {
                            // Convert date strings to moment objects for comparison
                            const dateAMoment = moment(dateA, "YYYY-MM-DD");
                            const dateBMoment = moment(dateB, "YYYY-MM-DD");
                            return dateAMoment - dateBMoment;
                          })
                          .map(([date, slots]) => (
                            <div className="tu-bookedslots" key={date}>
                              <h5>
                                {moment(date).format("ddd DD MMMM, YYYY")}
                              </h5>
                              <ul className="tu-checkout tu-checkoutvtwo">
                                {slots
                                  .sort((slotA, slotB) => {
                                    // Convert time strings to moment objects for comparison
                                    const timeAMoment = moment(
                                      slotA.from_time,
                                      "YYYY-MM-DDTHH:mm:ss.SSSZ"
                                    );
                                    const timeBMoment = moment(
                                      slotB.from_time,
                                      "YYYY-MM-DDTHH:mm:ss.SSSZ"
                                    );
                                    return timeAMoment - timeBMoment;
                                  })
                                  .map((slot, index) => (
                                    <li key={index}>
                                      <span>
                                        {moment(slot.from_time).format("HH:mm")}{" "}
                                        - {moment(slot.to_time).format("HH:mm")}
                                      </span>
                                    </li>
                                  ))}
                              </ul>
                            </div>
                          ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
};

export default TutorsSlotsDetails;
