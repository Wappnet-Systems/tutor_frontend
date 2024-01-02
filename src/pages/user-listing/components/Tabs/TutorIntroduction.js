/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable jsx-a11y/role-supports-aria-props */
import moment from "moment";
import React, { useRef, useState } from "react";
import "@splidejs/splide/dist/css/themes/splide-default.min.css";
import { Splide, SplideSlide } from "@splidejs/react-splide";

export const TutorIntroduction = ({ tutorData }) => {
  const thumbnailSplideRef = useRef(null);
  const mainSplideRef = useRef(null);

  const [isEduExpanded, setIsEduExpanded] = useState([]);

  const handleEduToggle = (index) => {
    const updatedExpanded = [...isEduExpanded];
    updatedExpanded[index] = !updatedExpanded[index];
    setIsEduExpanded(updatedExpanded);
  };

  const tutorSubjectDetails = tutorData?.tutor_subjects;

  const mediaItems = tutorData?.media_gallery;

  const groupedSubjects = tutorSubjectDetails?.reduce((groups, subject) => {
    const categoryId = subject?.category_id;
    if (!groups[categoryId]) {
      groups[categoryId] = {
        category_id: categoryId,
        category_name: subject?.subject_category?.category_name,
        subject: []
      };
    }

    groups[categoryId].subject.push({
      id: subject?.subject?.id,
      subject_name: subject?.subject?.subject_name
    });
    return groups;
  }, {});

  return (
    <div
      className="tab-pane fade show active"
      id="home"
      role="tabpanel"
      aria-labelledby="home-tab"
    >
      <div className="tu-tabswrapper">
        <div className="tu-tabstitle">
          <h4>A brief introduction</h4>
        </div>
        <div className="tu-description">
          <p>{tutorData?.introduction}</p>
        </div>
      </div>

      <div className="tu-tabswrapper">
        <div className="tu-tabstitle">
          <h4>Education</h4>
        </div>
        <div className="accordion tu-accordionedu" id="accordionFlushExampleaa">
          <div id="tu-edusortable" className="tu-edusortable">
            {tutorData?.education_details?.map((education, index) => (
              <div className="tu-accordion-item" key={index}>
                <div className="tu-expwrapper">
                  <div className="tu-accordionedu">
                    <div className="tu-expinfo">
                      <div className="tu-accodion-holder">
                        <h5
                          className="collapsed"
                          data-bs-toggle="collapse"
                          data-bs-target={`#flush-collapse-${index}`}
                          aria-expanded={isEduExpanded[index]}
                          onClick={() => handleEduToggle(index)}
                          aria-controls={`flush-collapse-${index}`}
                        >
                          {education?.course_name}
                        </h5>
                        <ul className="tu-branchdetail">
                          <li>
                            <i className="icon icon-home"></i>
                            <span>{education?.university_name}</span>
                          </li>
                          <li>
                            <i className="icon icon-map-pin"></i>
                            <span>{education?.location}</span>
                          </li>
                          <li>
                            <i className="icon icon-calendar"></i>
                            <span>
                              {moment(education?.start_date).format(
                                "DD-MM-YYYY"
                              )}{" "}
                              &nbsp; to &nbsp;
                              {moment(education?.end_date).format("DD-MM-YYYY")}
                            </span>
                          </li>
                        </ul>
                      </div>
                      <i
                        className="icon icon-plus"
                        role="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#flush-collapse-${index}`}
                        aria-expanded={isEduExpanded[index]}
                        onClick={() => handleEduToggle(index)}
                        aria-controls={`flush-collapse-${index}`}
                      ></i>
                    </div>
                  </div>
                </div>
                <div
                  id={`flush-collapse-${index}`}
                  data-bs-parent="#accordionFlushExampleaa"
                  className={`accordion-collapse collapse ${
                    isEduExpanded[index] ? "show" : ""
                  }`}
                >
                  <div className="tu-edubodymain">
                    <div className="tu-accordioneduc">
                      <p>{education?.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {tutorData?.tutor_subjects?.length > 0 && (
        <div className="tu-tabswrapper">
          <div className="tu-tabstitle">
            <h4>I can teach</h4>
          </div>
          {Object.values(groupedSubjects).map((subjectGroup, index) => (
            <ul className="tu-icanteach tu-branchdetail" key={index}>
              <li>
                <div className="tu-tech-title">
                  <h6>{subjectGroup.category_name}</h6>
                </div>
                <ul className="tu-serviceslist">
                  {subjectGroup.subject.map((subject, subIndex) => (
                    <>
                      {subject?.subject_name !== undefined && (
                        <li key={subIndex}>
                          <a>{subject.subject_name}</a>
                        </li>
                      )}
                    </>
                  ))}
                </ul>
              </li>
            </ul>
          ))}
        </div>
      )}

      {tutorData?.media_gallery?.length > 0 && (
        <div className="tu-tabswrapper tu-view-media">
          <div className="tu-tabstitle">
            <h4>Media gallery</h4>
          </div>

          <div className="tu-slider-holder">
            <div id="tu_splide" className="tu-sync splide">
              <Splide
                options={{
                  rewind: true,
                  width: "100%",
                  height: "100%",
                  gap: "1rem"
                }}
                onMoved={(splide) => {
                  thumbnailSplideRef.current.go(splide.index);
                }}
                ref={mainSplideRef}
              >
                {mediaItems.map((item, index) => (
                  <>
                    <SplideSlide key={index}>
                      <figure className="tu-sync__content">
                        {item?.media_type === "video" ? (
                          <>
                            <video
                              controls
                              style={{
                                width: "100%",
                                maxHeight: "400px"
                              }}
                            >
                              <source src={item?.media} type="video/mp4" />
                              Your browser does not support the video tag.
                            </video>
                          </>
                        ) : (
                          <img
                            src={item?.media}
                            style={{
                              maxHeight: "400px"
                            }}
                            alt="image"
                          />
                        )}
                      </figure>
                    </SplideSlide>
                  </>
                ))}
              </Splide>
            </div>
            <div
              id="tu_splidev2"
              className={`tu-syncthumbnail splide ${
                mediaItems.length <= 4 ? "hide-arrows" : ""
              }`}
            >
              <Splide
                options={{
                  rewind: true,
                  fixedWidth:
                    mediaItems.length === 1
                      ? "100%"
                      : mediaItems.length === 2
                      ? "50%"
                      : mediaItems.length === 3
                      ? "33.33%"
                      : "25%",
                  height: "100%",
                  gap: "0.5rem",
                  isNavigation: true,
                  pagination: false
                }}
                onMoved={(splide) => {
                  mainSplideRef.current.go(splide.index);
                }}
                ref={thumbnailSplideRef}
              >
                {mediaItems.map((item, index) => (
                  <>
                    <SplideSlide key={index}>
                      <figure className="tu-syncthumbnail__content">
                        {item?.media_type === "video" ? (
                          <>
                            <video
                              width="100%"
                              height="100px"
                              style={{ objectFit: "cover" }}
                            >
                              <source src={item?.media} type="video/mp4" />
                              Your browser does not support the video tag.
                            </video>
                            <span className="tu-servicesvideo"></span>
                          </>
                        ) : (
                          <img
                            src={item?.media}
                            alt="image"
                            style={{
                              height: "100px",
                              objectFit: "cover"
                            }}
                          />
                        )}
                      </figure>
                    </SplideSlide>
                  </>
                ))}
              </Splide>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
