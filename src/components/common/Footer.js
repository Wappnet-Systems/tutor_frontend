import { useFormik } from "formik";
import * as Yup from "yup";
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { userService } from "../../pages/user/service/userService";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import SiteLogoWhite from "../../assets/login/logo_white.png";

const Footer = () => {
  const userData = useSelector((state) => state.userData?.userData);
  const [issueSubjectList, setIssueSubjectList] = useState([]);
  const [selectedTitle, setSelectedTitle] = useState("");
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);

  const validationSchema = Yup.object().shape({
    feedback_subject_id: Yup.string()
      .required("Issue subject is required")
      .notOneOf([""], "Issue Subject is required"),
    description: Yup.string()
      .required("description is required")
      .test("no-only-space", "Only space is not allowed", (value) => {
        return !/^\s+$/.test(value);
      })
  });

  const formik = useFormik({
    initialValues: {
      feedback_subject_id: "",
      description: "",
      other_subject: ""
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      values["feedback_subject_id"] = Number(values?.feedback_subject_id);
      if (
        (selectedTitle === "Other" && !values?.other_subject) ||
        (selectedTitle === "Other" && /^\s+$/.test(values.other_subject))
      ) {
        return false;
      }

      if (selectedTitle !== "Other") {
        values["other_subject"] = "";
      } else {
        values["other_subject"] = values.other_subject.trim();
      }
      values["description"] = values.description.trim();

      userService?.AddUserFeedback(values).then((response) => {
        toast.success(response?.data?.message?.[0]);
        handleClose();
        formik.resetForm();
        setSelectedTitle("");
      });
    }
  });

  const handleSelectChange = (e) => {
    const selectedValue = e.target.value;
    const selectedIssue = issueSubjectList.find(
      (item) => item.id === selectedValue
    );

    if (selectedIssue) {
      setSelectedTitle(selectedIssue.title);
    } else {
      setSelectedTitle("");
    }

    formik.handleChange(e);
  };

  const handleClose = () => {
    formik.resetForm();
    setSelectedTitle("");
    setShow(false);
  };

  useEffect(() => {
    userService?.getFeedbackSubject().then((response) => {
      setIssueSubjectList(response?.data?.data?.feedbackSubjects);
    });
  }, []);

  return (
    <footer>
      <div className="tu-footerdark">
        <div className="container">
          <div className="row">
            <div className="col-lg-7">
              <strong className="tu-footerlogo">
                <Link to="/">
                  <img
                    src={SiteLogoWhite}
                    alt="Site logo"
                    style={{ maxWidth: "180px" }}
                  />
                </Link>
              </strong>
              <p className="tu-footerdescription">
                Accusamus etidio dignissimos ducimus blanditiis praesentium
                volupta eleniti atquete corrupti quolores etmquasa molestias
                epturi sinteam occaecati cupiditate non providente mikume
                molareshe.
              </p>
              <ul className="tu-socialmedia">
                <li className="tu-facebookv3">
                  <Link to="https://www.facebook.com/" target="_blank">
                    <i className="fab fa-facebook-f"></i>
                  </Link>
                </li>
                <li className="tu-twitterv3">
                  <Link to="https://twitter.com/?lang=en" target="_blank">
                    <i className="fab fa-twitter"></i>
                  </Link>
                </li>
                <li className="tu-linkedinv3">
                  <Link to="https://www.linkedin.com" target="_blank">
                    <i className="fab fa-linkedin-in"></i>
                  </Link>
                </li>
                <li className="tu-dribbblev3">
                  <Link to="https://dribbble.com/" target="_blank">
                    <i className="fab fa-dribbble"></i>
                  </Link>
                </li>
                <li className="tu-twitchv3">
                  <Link to="https://www.twitch.tv/" target="_blank">
                    <i className="fab fa-twitch"></i>
                  </Link>
                </li>
              </ul>
            </div>
            <div className="col-lg-5">
              <h5 className="tu-footertitle">
                Feel free to share your question
              </h5>
              <ul className="tu-footerlist tu-footericonlist">
                <li>
                  <Link to="tel:+6287777263549">
                    <i className="icon icon-phone-call"></i>
                    <em>+62 877 77263549</em>
                    <span>( Mon to Sun 9am - 11pm GMT )</span>
                  </Link>
                </li>
                <li>
                  <Link to="mailto:hello@youremailid.co.uk">
                    <i className="icon icon-mail"></i>
                    <em>hello@youremailid.co.uk</em>
                  </Link>
                </li>
                <li>
                  <Link to="tel:+681109998263">
                    <i className="icon icon-printer"></i>
                    <em>+62 811 09998263</em>
                  </Link>
                </li>
                <li>
                  <Link to="tel:(+33)775559375">
                    <i className="fab fa-whatsapp"></i>
                    <em>(+33)7 75 55 9375</em>
                    <span>( Mon to Sun 9am - 11pm GMT )</span>
                  </Link>
                </li>
              </ul>
            </div>

            <div className="col-12">
              <div className="  tu-seperator">
                <div className="tu-custom-footer">
                  <h5 className="tu-footertitle">Useful links</h5>
                  <ul className="tu-footerlist row">
                    <li className="col-4">
                      <Link to="/about-us">About us</Link>
                    </li>
                    {localStorage?.getItem("access_token") && (
                      <li className="col-4">
                        <Link to="javascript:void(0)" onClick={handleShow}>
                          Help & support
                        </Link>
                      </li>
                    )}

                    <li className="col-4">
                      <Link to="/faq">F.A.Q</Link>
                    </li>
                    <li className="col-4">
                      <Link to="/terms-and-conditions">Terms & condition</Link>
                    </li>
                    <li className="col-4">
                      <Link to="/privacy-policy">Privacy policy</Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="tu-footercopyright">
          <div className="container">
            <div className="tu-footercopyright_content">
              <p>Tutor(v 0.0.8) &copy; 2023 All Rights Reserved.</p>
            </div>
          </div>
        </div>
      </div>

      <Modal show={show} onHide={handleClose} className="mdl">
        <Modal.Header>
          <h5>Help & Support</h5>
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
                  <label className="tu-label">Issue Subject</label>
                  <div className="tu-select">
                    <select
                      id="selectIssue"
                      data-placeholder="Select issue"
                      data-placeholderinput="Select issue"
                      className="form-control"
                      name="feedback_subject_id"
                      {...formik.getFieldProps("feedback_subject_id")}
                      onChange={(e) => handleSelectChange(e)}
                      onBlur={formik.handleBlur}
                      required
                    >
                      <option label="Select Issue from list" value=""></option>
                      {issueSubjectList?.map((item) => {
                        return (
                          <option key={item?.id} value={item?.id}>
                            {item?.title}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  {formik.errors.feedback_subject_id &&
                    formik.touched.feedback_subject_id && (
                      <div className="tu-error-message">
                        {formik.errors.feedback_subject_id}
                      </div>
                    )}
                </div>
                {selectedTitle === "Other" && (
                  <div className="form-group">
                    <label className="tu-label">Other Subject</label>
                    <div className="tu-placeholderholder">
                      <input
                        type="text"
                        className="form-control"
                        required
                        placeholder="Assignment title"
                        name="other_subject"
                        onChange={formik.handleChange}
                        value={formik?.values?.other_subject}
                      />
                      <div className="tu-placeholder">
                        <span>Subject title</span>
                        <em>*</em>
                      </div>
                    </div>
                    {selectedTitle === "Other" &&
                      !formik.values?.other_subject && (
                        <div className="tu-error-message">
                          Other subject is required
                        </div>
                      )}
                    {selectedTitle === "Other" &&
                      formik.values?.other_subject &&
                      /^\s+$/.test(formik.values.other_subject) && (
                        <div className="tu-error-message">
                          Only space is not allowed
                        </div>
                      )}
                  </div>
                )}

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
    </footer>
  );
};

export default Footer;
