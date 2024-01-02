/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import avatarImage from "../../../../../assets/banner/avatar_image.webp";

const TutorInviteesDetails = ({ onClose, booking_id, allBooking }) => {
  const handleClose = () => {
    onClose();
  };

  const filteredInvitees = allBooking?.find((item) => item?.id === booking_id);

  if (!filteredInvitees) {
    return null;
  }

  const invitees = filteredInvitees;

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
                  <h5>Invitees details</h5>
                </div>
                <a
                  className="tu-close"
                  data-bs-dismiss="modal"
                  style={{ cursor: "pointer" }}
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
                      {invitees?.bookingUsers?.map((invitee, index) => (
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
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
};

export default TutorInviteesDetails;
