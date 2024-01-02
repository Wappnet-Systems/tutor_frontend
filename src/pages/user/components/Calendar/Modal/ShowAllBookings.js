/* eslint-disable jsx-a11y/anchor-is-valid */
import moment from "moment";
import avatarImage from "../../../../../assets/banner/avatar_image.webp";
import { Modal } from "react-bootstrap";

const ShowAllBookings = ({
  showAll,
  onClose,
  selectedDay,
  handleEventClick
}) => {
  const handleClose = () => {
    onClose();
  };
  return (
    <>
      <Modal show={showAll} onHide={() => handleEventClick}>
        <Modal.Header>
          <h4>
            All Bookings of&nbsp;
            {selectedDay && selectedDay.length > 0
              ? moment(selectedDay?.[0]?.start).format("ddd DD MMMM, YYYY")
              : ""}
          </h4>
          <a
            href="javascript:void(0);"
            className="tu-close "
            type="button"
            data-bs-dismiss="modal"
            aria-label="Close"
            onClick={handleClose}
          >
            <i className="icon icon-x"></i>
          </a>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: "500px", overflowY: "auto" }}>
          <div className="row">
            <div className="d-flex flex-wrap justify-content-between">
              {selectedDay &&
                selectedDay.map((event, index) => (
                  <div
                    className="tu-savedwrapper w-100 mb-3 gap-6"
                    style={{ cursor: "pointer" }}
                    key={index}
                    onClick={() => handleEventClick(event)} // Add this line
                  >
                    <div className="tu-savedinfo">
                      <figure>
                        {event?.image === null ? (
                          <img src={avatarImage} alt="image" />
                        ) : (
                          <img src={event?.image} alt={`img ${event?.title}`} />
                        )}
                      </figure>
                      <div className="tu-savedtites">
                        <h4>{event?.title}</h4>
                        <p>{event?.email}</p>
                      </div>
                    </div>
                    <div className="tu-savedinfo" style={{ flex: "0px" }}>
                      <h5>Booking Id : {event?.bookingId}</h5>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ShowAllBookings;
