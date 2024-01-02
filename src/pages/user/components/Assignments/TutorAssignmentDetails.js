import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import pdfImg from "../../../../assets/general/pdf.png";
import { assignmentService } from "../../service/assignmentServices";

const TutorAssignmentDetails = ({ show, onHide, assignment_id }) => {
  const [assignmentData, setAssignmentData] = useState({});
  useEffect(() => {
    assignmentService.getAssignmentById(assignment_id).then((response) => {
      setAssignmentData(response?.data?.data);
    });
  }, []);

  const handleClose = () => {
    onHide();
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} className="mdl">
        <Modal.Header>
          <h5>Assignment Details</h5>
          <a
            onClick={handleClose}
            className="tu-close"
            style={{ cursor: "pointer" }}
          >
            <i className="icon icon-x"></i>
          </a>
        </Modal.Header>
        <Modal.Body>
          <ul className="p-0">
            <li>
              <h6>Question:</h6>
              <p>{assignmentData?.title}</p>
            </li>
            <li>
              <h6>Description:</h6>
              <p>{assignmentData?.description}</p>
            </li>
            <li>
              <h6>Media</h6>
              <a
                className="d-inline-block"
                href={assignmentData?.media}
                target="_blank"
                rel="noreferrer"
              >
                {assignmentData?.media_type === "application/pdf" ? (
                  <img
                    src={pdfImg}
                    alt="image pdf"
                    style={{ maxHeight: "200px" }}
                  />
                ) : (
                  <img
                    src={assignmentData?.media}
                    alt="image media"
                    style={{ maxHeight: "200px" }}
                  />
                )}
              </a>
            </li>
          </ul>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default TutorAssignmentDetails;
