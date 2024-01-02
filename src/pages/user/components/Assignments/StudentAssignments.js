import React, { useEffect, useState } from "react";
import avatarImage from "../../../../assets/banner/avatar_image.jpg";
import { Link } from "react-router-dom";
import moment from "moment";
import AddSubmission from "./AddSubmission";
import TutorAssignmentDetails from "./TutorAssignmentDetails";
import UserSubmissionDetails from "./UserSubmissionDetails";
import pdfImg from "../../../../assets/general/pdf.png";
import DescriptionWithModal from "./DescriptionWithModal";
import { AssignmentStatusType } from "../Bookings/CommonEnum";
import ReactPaginate from "react-paginate";
import { assignmentService } from "../../service/assignmentServices";

const StudentAssignments = () => {
  const [assignmentList, setAssignmentList] = useState([]);
  const [showUploadAssignment, setShowUploadAssignment] = useState(false);
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const [selectedDescription, setSelectedDescription] = useState("");
  const [assignmentId, setAssignmentId] = useState(null);
  const [showAssignmentDetailsPopup, setShowAssignmentDetailsPopup] =
    useState(false);
  const [showSubmissionDetailsPopup, setShowSubmissionDetailsPopup] =
    useState(false);
  const [currentStatusType, setCurrentStatusType] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const limit = 10;
  const sort = "DESC";
  const pageCount = Math.max(Math.ceil(totalCount / limit), 1);

  const handlePageClick = (selectedPage) => {
    setCurrentPage(selectedPage.selected + 1);
  };

  const handleClose = () => {
    setShowUploadAssignment(false);
    setShowAssignmentDetailsPopup(false);
    setShowSubmissionDetailsPopup(false);
    setShowDescriptionModal(false);
  };

  const handleShowModal = (description) => {
    setSelectedDescription(description);
    setShowDescriptionModal(true);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const getAssignments = () => {
    assignmentService
      .getTutorAssignmentData(limit, sort, currentPage)
      .then((response) => {
        setAssignmentList(response?.data?.data?.data);
        setTotalCount(response?.data?.data?.totalItem);
      });
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

  useEffect(() => {
    getAssignments();
  }, [currentPage]);

  return (
    <>
      <div className="tu-boxwrapper booking-box">
        <div className="tu-boxarea pb-3">
          <div className="tu-boxsm">
            <div className="tu-boxsmtitle">
              <h4>Assignments</h4>
            </div>
          </div>
          <div className="tu-box">
            {assignmentList?.length > 0 ? (
              <>
                {assignmentList?.map((item, index) => {
                  return (
                    <>
                      <div className="tu-bookingwrapper" key={item?.id}>
                        <div className="tu-bookingperson">
                          <figure>
                            {item?.student?.image === null ? (
                              <img src={avatarImage} alt="Avtar Image" />
                            ) : (
                              <img
                                src={item?.tutor?.image}
                                alt={`image ${item?.student?.first_name}`}
                              />
                            )}
                          </figure>
                          <div className="tu-bookername row align-items-center">
                            <h4 className="col-12 col-sm-8 col-md-9">
                              <Link
                                to={`/search-listing-view/${item?.tutor?.id}`}
                                onClick={() => scrollToTop()}
                              >
                                {item?.tutor?.first_name +
                                  " " +
                                  item?.tutor?.last_name}
                              </Link>
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
                                onClick={() => {
                                  setAssignmentId(item?.id);
                                  setShowSubmissionDetailsPopup(
                                    !showSubmissionDetailsPopup
                                  );
                                  setCurrentStatusType(item?.status);
                                }}
                              >
                                {item?.status === 1 ? (
                                  <i className="icon icon-book-open"></i>
                                ) : (
                                  <i className="icon icon-edit-3 tu-editclr"></i>
                                )}
                              </a>
                            </div>
                          </div>
                        </div>
                        <ul className="tu-bookingonfo">
                          <li>
                            <span>Assignment Question:</span>
                            <h6>{item?.title}</h6>
                          </li>
                          <li>
                            <span>Description: </span>
                            <p>{renderDescription(item?.description)}</p>
                          </li>
                          {item.media !== null && (
                            <li>
                              <span>Media:</span>
                              <a
                                className="d-inline-block mb-3"
                                href={item?.media}
                                target="_blank"
                                rel="noreferrer"
                              >
                                {item?.media_type === "application/pdf" ? (
                                  <img
                                    src={pdfImg}
                                    alt="image pdf"
                                    style={{ maxHeight: "200px" }}
                                  />
                                ) : (
                                  <img
                                    src={item?.media}
                                    alt="image media"
                                    style={{
                                      maxHeight: "150px",
                                      maxWidth: "150px"
                                    }}
                                  />
                                )}
                              </a>
                            </li>
                          )}

                          <li>
                            <span>Deadline</span>
                            <h6>
                              {moment(item.target_completion_date).format(
                                "DD-MM-YYYY h:mm A"
                              )}
                            </h6>
                          </li>
                          {item?.status === 1 && (
                            <li>
                              <span>Tutor Review </span>
                              <h6>{item?.tutor_review}</h6>
                            </li>
                          )}
                        </ul>
                        {item?.status !== 1 && (
                          <div className="tu-btnlist">
                            <a
                              className="tu-primbtn upload_submission_btn"
                              onClick={() => {
                                setAssignmentId(item?.id);
                                setShowUploadAssignment(!showUploadAssignment);
                              }}
                            >
                              <i className="fa-solid fa-plus"></i>
                            </a>
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
        {assignmentList?.length >= 1 && (
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

      {showSubmissionDetailsPopup && assignmentId && (
        <UserSubmissionDetails
          show={showSubmissionDetailsPopup}
          onHide={handleClose}
          assignment_id={assignmentId}
          current_status_type={currentStatusType}
        />
      )}

      {showAssignmentDetailsPopup && assignmentId && (
        <TutorAssignmentDetails
          show={showAssignmentDetailsPopup}
          onHide={handleClose}
          assignment_id={assignmentId}
        />
      )}

      {showUploadAssignment && (
        <AddSubmission
          show={showUploadAssignment}
          onHide={handleClose}
          assignment_Id={assignmentId}
          getAssignmentList={getAssignments}
        />
      )}

      {showDescriptionModal && selectedDescription && (
        <DescriptionWithModal
          show={showDescriptionModal}
          onHide={handleClose}
          description={selectedDescription}
        />
      )}
    </>
  );
};

export default StudentAssignments;
