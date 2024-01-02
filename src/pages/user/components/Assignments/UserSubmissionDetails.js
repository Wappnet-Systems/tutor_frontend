import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import pdfImg from "../../../../assets/general/pdf.png";
import moment from "moment";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { assignmentService } from "../../service/assignmentServices";

const UserSubmissionDetails = ({
  show,
  onHide,
  assignment_id,
  current_status_type
}) => {
  const userData = useSelector((state) => state.userData?.userData);
  const [submissionData, setSubmissionData] = useState({});
  const handleClose = () => {
    onHide();
  };

  useEffect(() => {
    assignmentService.getAssignmentById(assignment_id).then((response) => {
      setSubmissionData(response?.data?.data);
    });
  }, []);

  const handleDeleteSubmission = (submissionId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        assignmentService
          ?.deleteSubmissionById(submissionId)
          .then((response) => {
            toast.success(response?.data?.message?.[0]);
            handleClose();
          });
      }
    });
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} className="mdl">
        <Modal.Header>
          <h5>Submission Details</h5>
          <a
            onClick={handleClose}
            className="tu-close"
            style={{ cursor: "pointer" }}
          >
            <i className="icon icon-x"></i>
          </a>
        </Modal.Header>
        <Modal.Body>
          <div className="">
            <ul className="submission_container m-0 p-0">
              {submissionData?.submissions?.length > 0 ? (
                <>
                  {submissionData?.submissions?.map((item, index) => {
                    return (
                      <>
                        <li className="p-2 border">
                          <div className="d-flex flex-wrap justify-content-between align-align-items-center mb-1">
                            <h5 className="m-0 col-12 col-sm-6">
                              Submission {index + 1}
                            </h5>
                            <p className="m-0 submission_created col-12 col-sm-6">
                              Created At :{" "}
                              {moment(item?.created_at).format(
                                "DD-MM-YYYY h:mm A"
                              )}
                            </p>
                          </div>
                          {userData?.user_type !== 2 &&
                            current_status_type !== 1 && (
                              <div className="d-flex justify-content-end">
                                <a
                                  href="javascript:void(0)"
                                  className="submission-delete"
                                  onClick={() =>
                                    handleDeleteSubmission(item?.id)
                                  }
                                >
                                  <i className="icon icon-trash-2 tu-deleteclr"></i>
                                </a>
                              </div>
                            )}
                          <div className="row align-items-center">
                            {item?.media && (
                              <div className="col-12 mb-3">
                                <a href={item?.media} target="_blank">
                                  {item?.media_type === "application/pdf" ? (
                                    <img
                                      src={pdfImg}
                                      alt="image pdf"
                                      style={{ maxHeight: "150px" }}
                                    />
                                  ) : (
                                    <img
                                      src={item?.media}
                                      alt="image media"
                                      style={{ maxHeight: "150px" }}
                                    />
                                  )}
                                </a>
                              </div>
                            )}

                            <div className="col-12">
                              <p className="m-0">
                                <b>Description :</b>
                              </p>
                              <span className="text-secondary fs-6">
                                {item?.description}
                              </span>
                            </div>
                          </div>
                        </li>
                      </>
                    );
                  })}
                </>
              ) : (
                <li className="text-secondary fw-bold text-center">
                  No Submission Found
                </li>
              )}
            </ul>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default UserSubmissionDetails;
