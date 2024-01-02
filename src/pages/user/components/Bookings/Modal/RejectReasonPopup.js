/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { toast } from "react-toastify";
import { bookingService } from "../../../service/booking.service";

const RejectReasonPopup = ({ onClose, booking_id, getBookingList, status }) => {
  const handleClose = () => {
    onClose();
  };

  const updateRequestData = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const declineReason = formData.get("decline_reason");
    const declineReasonDesc = formData.get("decline_reason_desc");

    const rejection_reason = declineReason + "." + declineReasonDesc;

    bookingService
      .updateRequest({
        id: booking_id,
        status: 2,
        rejection_reason,
      })
      .then((response) => {
        toast.success("Request is successfully declined");
        handleClose();
        getBookingList(); // Refresh the list
      })
      .catch((error) => {
        toast.error("Error declining request");
      });
  };

  return (
    <>
      <div
        className="modal fade tuturn-profilepopup tu-uploadprofile tuturn-popup show"
        tabindex={-1}
        id="tuturn-modal-popup"
        style={{ display: "block", paddingLeft: "0px" }}
        aria-modal="true"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="tuturn-modalcontent modal-content">
            <div id="tuturn-model-body">
              <div className="modal-header">
                <h5>Decline appointment</h5>
                <a
                  className="tu-close "
                  type="button"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={handleClose}
                >
                  <i className="icon icon-x"></i>
                </a>
              </div>
              <div className="modal-body">
                <form
                  className="tu-themeform"
                  id="tu-booking-decline-form"
                  onSubmit={updateRequestData}
                >
                  <fieldset>
                    <div className="tu-themeform__wrap">
                      <div className="form-group">
                        <label className="tu-label">Choose reason</label>
                        <div className="tu-select">
                          <select
                            name="decline_reason"
                            data-placeholder="Type or select from list"
                            className="form-control"
                            required=""
                          >
                            <option label="Select reason from list"></option>
                            <option value="Instructor not available ">
                              Instructor not available
                            </option>
                            <option value="Not available to serve this time ">
                              Not available to serve this time
                            </option>
                            <option value="Unkown requests ">
                              Unkown requests
                            </option>
                            <option value="Lack of important details from user ">
                              Lack of important details from user
                            </option>
                            <option value="Web designing ">
                              Web designing
                            </option>
                            <option value="Miscellaneous ">
                              Miscellaneous
                            </option>
                          </select>
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="tu-label">A little description</label>
                        <textarea
                          className="form-control tu-textarea cancle-app-value"
                          name="decline_reason_desc"
                          placeholder="Enter description"
                        ></textarea>
                      </div>
                      <div className="form-group tu-formbtn">
                        <button
                          type="submit"
                          className="tu-primbtn tu-redbtn tu-decline-submit"
                        >
                          Decline appointment
                        </button>
                      </div>
                    </div>
                  </fieldset>
                  <input
                    type="hidden"
                    name="booking_order_id"
                    id="booking_order_id"
                    value="879"
                  />
                  <input
                    type="hidden"
                    name="booking_action_type"
                    id="booking_action_type"
                    value="decline"
                  />
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
};

export default RejectReasonPopup;
