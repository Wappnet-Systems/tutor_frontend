import { useFormik } from "formik";
import * as Yup from "yup";
import React from "react";
import { Modal } from "react-bootstrap";
import { userService } from "../../service/userService";
import { toast } from "react-toastify";
import { assignmentService } from "../../service/assignmentServices";

const TutorFeedback = ({
  show,
  onHide,
  assignment_Id,
  getTutorAssignments
}) => {
  const validationSchema = Yup.object().shape({
    tutor_review: Yup.string().required("Feedback is required")
  });
  const formik = useFormik({
    initialValues: {
      tutor_review: ""
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      assignmentService
        ?.assignmentCompletion(assignment_Id, values)
        .then((response) => {
          toast.success(response?.data?.message?.[0]);
          getTutorAssignments();
          handleClose();
        });
    }
  });

  const handleClose = () => {
    onHide();
  };
  return (
    <>
      <Modal show={show} onHide={handleClose} className="mdl">
        <Modal.Header>
          <h5>Feedback</h5>
          <a
            onClick={handleClose}
            className="tu-close"
            style={{ cursor: "pointer" }}
          >
            <i className="icon icon-x"></i>
          </a>
        </Modal.Header>
        <Modal.Body>
          <form className="tu-themeform" onSubmit={formik.handleSubmit}>
            <fieldset>
              <div className="tu-themeform__wrap align-items-start">
                <div className="form-group">
                  <label className="tu-label">Assignment feedback</label>
                  <div className="tu-placeholderholder">
                    <textarea
                      className="form-control"
                      placeholder="Enter feedback"
                      name="tutor_review"
                      {...formik.getFieldProps("tutor_review")}
                    ></textarea>
                    <div className="tu-placeholder">
                      <span>Enter Feedback</span>
                    </div>
                  </div>
                  {formik.errors.tutor_review &&
                    formik.touched.tutor_review && (
                      <div className="tu-error-message">
                        {formik.errors.tutor_review}
                      </div>
                    )}
                </div>
                <div className="form-group tu-formbtn">
                  <button type="submit" className="tu-primbtn">
                    Save
                  </button>
                </div>
              </div>
            </fieldset>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default TutorFeedback;
