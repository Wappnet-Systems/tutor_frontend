import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import pdfImg from "../../../../assets/general/pdf.png";
import { assignmentService } from "../../service/assignmentServices";

const AddSubmission = ({ show, onHide, assignment_Id, getAssignmentList }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const validationSchema = Yup.object().shape({
    description: Yup.string().required("description is required")
  });
  const formik = useFormik({
    initialValues: {
      description: ""
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const formData = new FormData();
      if (selectedFile) {
        formData.append("image", selectedFile);
      }
      formData.append("description", values?.description);
      assignmentService
        ?.addSubmission(assignment_Id, formData)
        .then((response) => {
          toast.success(response?.data?.message?.[0]);
          getAssignmentList();
          handleClose();
        });
    }
  });

  const handleClose = () => {
    onHide();
  };

  const handleRemoveSelectedFile = () => {
    setSelectedFile(null);
    formik.setFieldValue("file", null);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (
      file &&
      (file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "application/pdf")
    ) {
      setSelectedFile(file);
      formik.setFieldValue("file", file);
    } else {
      toast.error("Please select a valid PDF, JPG, or PNG file.");
    }
  };
  return (
    <>
      <Modal show={show} onHide={handleClose} className="mdl">
        <Modal.Header>
          <h5>Add Submission</h5>
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
                  <label className="tu-label">Description</label>
                  <div className="tu-placeholderholder">
                    <textarea
                      className="form-control"
                      placeholder="Enter feedback"
                      name="description"
                      {...formik.getFieldProps("description")}
                    ></textarea>
                    <div className="tu-placeholder">
                      <span>Enter Description</span>
                    </div>
                  </div>
                  {formik.errors.description && formik.touched.description && (
                    <div className="tu-error-message">
                      {formik.errors.description}
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <label className="tu-label">Add Submission</label>
                  <div className="tu-uploadphoto position-relative">
                    <div className="file-upload">
                      {selectedFile ? (
                        <div className="selected-file">
                          {selectedFile.type.startsWith("image/") ? (
                            <img
                              src={URL.createObjectURL(selectedFile)}
                              alt="Selected"
                              className="m-0"
                            />
                          ) : (
                            <div>
                              {selectedFile.type === "application/pdf" && (
                                <div>
                                  <img
                                    src={pdfImg}
                                    alt="pdf image"
                                    className="m-0"
                                  />
                                  <span>{selectedFile.name}</span>
                                </div>
                              )}
                            </div>
                          )}
                          <button
                            className="handle-remove-btn"
                            title="Remove File"
                            onClick={handleRemoveSelectedFile}
                          >
                            <i className="icon icon-x"></i>
                          </button>
                        </div>
                      ) : (
                        <>
                          <i className="icon icon-grid"></i>
                          <h5>
                            <label htmlFor="file3">Click here</label> to upload
                            a file
                            <input
                              type="file"
                              id="file3"
                              name="file"
                              accept=".pdf,.jpg,.png"
                              onChange={handleFileChange}
                              onBlur={formik.handleBlur}
                            />
                          </h5>

                          <svg>
                            <rect width="100%" height="100%"></rect>
                          </svg>
                        </>
                      )}
                    </div>
                  </div>
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

export default AddSubmission;
