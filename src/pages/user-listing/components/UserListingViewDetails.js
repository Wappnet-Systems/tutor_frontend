/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable jsx-a11y/role-supports-aria-props */
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../../../components/Layout";
import {
  addUserBookMark,
  deleteBookMark,
  getUserDataByID
} from "../service/UserListingService";
import avatarImage from "../../../assets/banner/avatar_image.webp";
import { Badge, Stack, Tab, Tabs } from "react-bootstrap";
import { BookingTution } from "./Tabs/BookingTution";
import { SidebarView } from "./SidebarView/SidebarView";
import { TutorIntroduction } from "./Tabs/TutorIntroduction";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import TutorReviews from "./Tabs/TutorReviews";
import { userService } from "../../user/service/userService";
import { CopyToClipboard } from "react-copy-to-clipboard";

const UserListingViewDetails = () => {
  const userDataMain = useSelector((state) => state.userData?.userData);
  const [showAllLanguages, setShowAllLanguages] = useState(false);
  const { id } = useParams();
  const [tutorData, setTutorData] = useState({});
  const [tutorLanguage, setTutorLanguage] = useState(null);
  const [allLanguages, setAllLanguages] = useState([]);
  const [activeTab, setActiveTab] = useState(1);
  const [showTab, setShowTab] = useState(false);
  const navigate = useNavigate();

  const access_token = localStorage.getItem("access_token");

  const handleLinkClick = () => {
    if (!access_token) {
      navigate("/login");
    }
  };
  const handleBookmarkClick = () => {
    setActiveTab(3);
    setShowTab(true);
  };

  useEffect(() => {
    getTutorById();
  }, []);

  const getTutorById = () => {
    getUserDataByID(id).then((response) => {
      setTutorData(response?.data?.data);
      setTutorLanguage(response?.data?.data?.languages);
    });
  };

  const handleAddBookMark = (userId) => {
    if (userId) {
      addUserBookMark(userId)
        .then((res) => {
          toast.success(res?.data?.message?.[0]);
          getTutorById();
        })
        .catch((err) => {});
    }
  };

  const handleDeleteBookMark = (userId) => {
    if (userId) {
      deleteBookMark(userId).then((res) => {
        toast.success(res?.data?.message?.[0]);
        getTutorById();
      });
    }
  };

  const [textToCopy, setTextToCopy] = useState("");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    toast.success("Website link copied!");
  };

  useEffect(() => {
    getLanguages();
  }, []);

  useEffect(() => {
    setTextToCopy(tutorData?.website || "");
  }, [tutorData]);

  const getLanguages = () => {
    userService.getLanguage().then((resp) => {
      let lang = [];
      for (let index = 0; index < resp?.data?.data?.length; index++) {
        const element = resp?.data?.data[index];
        lang.push({
          value: element?.id,
          label: element?.language
        });
      }
      lang = lang?.filter((item) => item?.id === tutorData?.language);
      setAllLanguages(lang);
    });
  };

  return (
    <>
      <Layout>
        <main className="tu-main tu-bgmain single-profile">
          <section className="tu-main-section">
            <div className="container">
              <div className="row gy-4">
                {tutorData && (
                  <>
                    <div className="col-xl-8 col-xxl-8">
                      <div className="tu-tutorprofilewrapp">
                        {userDataMain?.user_type === 3 &&
                          tutorData?.student_bookmarks?.length > 0 && (
                            <span className="tu-cardtag"></span>
                          )}

                        <div className="tu-profileview">
                          <figure>
                            {tutorData?.image === null ? (
                              <img src={avatarImage} alt="image-description" />
                            ) : (
                              <img
                                src={tutorData?.image}
                                alt="image-description"
                              />
                            )}
                          </figure>
                          <div className="tu-protutorinfo">
                            <div className="tu-protutordetail">
                              <div className="tu-productorder-content">
                                <figure>
                                  <img src={tutorData?.image} alt="images" />
                                </figure>
                                <div className="tu-product-title">
                                  <h3>
                                    {tutorData?.first_name}{" "}
                                    {tutorData?.last_name}
                                    <i
                                      className="icon icon-check-circle tu-greenclr"
                                      data-tippy-trigger="mouseenter"
                                      data-tippy-html="#tu-verifed"
                                      data-tippy-interactive="true"
                                      data-tippy-placement="top"
                                    ></i>
                                  </h3>
                                  <h5>{tutorData?.tag_line}</h5>
                                </div>
                                <div className="tu-listinginfo_price">
                                  <span>Starting from:</span>
                                  <h4>${tutorData?.hourly_rate}/hr</h4>
                                </div>
                              </div>
                              <ul className="tu-tutorreview">
                                {tutorData?.avg_rating === null ? (
                                  ""
                                ) : (
                                  <li>
                                    <span>
                                      <i className="fa fa-star tu-coloryellow">
                                        <em>
                                          {tutorData?.avg_rating}
                                          <span>/5.0</span>
                                        </em>
                                      </i>
                                    </span>
                                  </li>
                                )}
                                {tutorData?.total_reviews === 0 ? (
                                  ""
                                ) : (
                                  <li>
                                    <span>
                                      <em>({tutorData?.total_reviews})</em>
                                    </span>
                                  </li>
                                )}

                                <li>
                                  <span>
                                    <i className="icon icon-map-pin">
                                      <span className="m-0">
                                        {tutorData?.address}
                                      </span>
                                    </i>
                                  </span>
                                </li>
                              </ul>

                              <div className="tu-detailitem">
                                <h6 className="m-0">Languages I know</h6>
                                <div className="tu-languagelist">
                                  <ul className="tu-languages">
                                    {/* {showAllLanguages */}
                                    {allLanguages.map((item, index) => {
                                      return (
                                        <>
                                          {tutorLanguage?.includes(
                                            item.value
                                          ) && (
                                            <li>
                                              <span key={item.value}>
                                                {item.label}
                                              </span>
                                            </li>
                                          )}
                                        </>
                                      );
                                    })}

                                    {/* // : allLanguages
                                      //     .filter((item) =>
                                      //       tutorLanguage?.includes(item.value)
                                      //     )
                                      //     .slice(0, 2)
                                      //     .map((matchedLanguage, index) => (
                                      //       <li>
                                      //         <span key={matchedLanguage.value}>
                                      //           {matchedLanguage.label}
                                      //         </span>
                                      //       </li>
                                      //     ))} */}

                                    {/* {!showAllLanguages &&
                                      tutorLanguage?.length > 5 && (
                                        <li>
                                          <a
                                            className="tu-showmore tu-tippytooltip"
                                            href="javascript:void(0);"
                                            onClick={() =>
                                              setShowAllLanguages(true)
                                            }
                                          >
                                            show more
                                          </a>
                                        </li>
                                      )} */}
                                  </ul>
                                </div>
                              </div>
                              {tutorData?.tutor_badge?.length > 0 && (
                                <div className="tu-detailitem">
                                  <h6>Badges</h6>
                                  <div className="tu-languagelist mt-1">
                                    <ul className="tu-languages">
                                      <li className="d-flex flex-wrap gap-1">
                                        {tutorData?.tutor_badge?.map(
                                          (item, index) => {
                                            const badgeColors = {
                                              Mentor: "primary",
                                              "Master Mentor": "secondary",
                                              "Outstanding Feedback": "success",
                                              "Subject Matter Expert": "danger",
                                              Experienced: "light",
                                              Veteran: "dark"
                                            };
                                            const badgeTitle =
                                              item?.badge?.title;
                                            const backgroundColor =
                                              badgeColors[badgeTitle] || "info"; // Default to "info" color if title not found
                                            return (
                                              <>
                                                <Stack
                                                  direction="horizontal"
                                                  key={index}
                                                >
                                                  <Badge
                                                    pill
                                                    bg={backgroundColor}
                                                    className="me-1"
                                                  >
                                                    {badgeTitle}
                                                  </Badge>
                                                </Stack>
                                              </>
                                            );
                                          }
                                        )}
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                              )}

                              {tutorData?.teach_at_offline && (
                                <div className="tu-detailitem">
                                  <h6 className="m-0">Available at</h6>
                                  <div className="tu-languagelist">
                                    <ul className="tu-languages">
                                      {tutorData?.tutor_postcodes?.map(
                                        (item2, index2) => {
                                          return (
                                            <li>
                                              <span key={item2?.id}>
                                                {item2?.postcode?.place_name +
                                                  " (" +
                                                  item2?.postcode?.postcode +
                                                  ") "}
                                              </span>
                                            </li>
                                          );
                                        }
                                      )}
                                    </ul>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="tu-actionbts">
                          {tutorData?.website === "" ? (
                            ""
                          ) : (
                            <div className="tu-userurl d-flex gap-2">
                              <i className="icon icon-globe"></i>
                              <a
                                href={
                                  tutorData?.website?.startsWith("https://")
                                    ? `${tutorData?.website}`
                                    : `//${tutorData?.website}`
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                value={textToCopy}
                                onChange={(e) => setTextToCopy(e.target.value)}
                              >
                                {tutorData?.website}
                              </a>
                              <CopyToClipboard
                                text={textToCopy}
                                onCopy={handleCopy}
                              >
                                <i
                                  className="icon icon-copy"
                                  style={{ cursor: "pointer" }}
                                ></i>
                              </CopyToClipboard>
                            </div>
                          )}

                          {userDataMain?.user_type !== 2 && (
                            <>
                              <ul className="tu-profilelinksbtn">
                                <li>
                                  <div
                                    className="tu-linkheart"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => {
                                      if (
                                        userDataMain?.user_type === undefined
                                      ) {
                                        handleLinkClick();
                                      } else if (
                                        tutorData?.student_bookmarks?.length > 0
                                      ) {
                                        handleDeleteBookMark(
                                          tutorData.student_bookmarks[0].id
                                        );
                                      } else {
                                        handleAddBookMark(tutorData?.id);
                                      }
                                    }}
                                  >
                                    <i
                                      className={`icon icon-heart ${
                                        tutorData?.student_bookmarks?.length > 0
                                          ? "tu-colorred"
                                          : ""
                                      }`}
                                    ></i>
                                    <span>Add to bookmark</span>
                                  </div>
                                </li>

                                <li>
                                  <button
                                    className="tu-primbtn"
                                    onClick={() => {
                                      if (
                                        userDataMain?.user_type === undefined
                                      ) {
                                        handleLinkClick();
                                      } else {
                                        handleBookmarkClick();
                                      }
                                    }}
                                  >
                                    Book a tution
                                  </button>
                                </li>
                              </ul>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="tu-detailstabs">
                        <Tabs
                          activeKey={activeTab}
                          onSelect={(tab) => setActiveTab(tab)}
                          // defaultActiveKey={2}
                          className="nav nav-tabs tu-nav-tabs"
                          id="uncontrolled-tab-example"
                        >
                          <Tab
                            eventKey={1}
                            title={
                              <>
                                <i className="icon icon-home"></i>
                                <span>Introduction</span>
                              </>
                            }
                          >
                            <TutorIntroduction tutorData={tutorData} />
                          </Tab>

                          <Tab
                            eventKey={2}
                            title={
                              <>
                                <i className="icon icon-message-circle"></i>
                                <span>Reviews</span>
                              </>
                            }
                          >
                            <TutorReviews />
                          </Tab>
                          {showTab && userDataMain?.user_type !== 2 && (
                            <Tab
                              eventKey={3}
                              title={
                                <div onClick={handleLinkClick}>
                                  <i className="fa-solid fa-book-bible"></i>
                                  <span>Book a tution</span>
                                </div>
                              }
                            >
                              <BookingTution id={id} tutorData={tutorData} />
                            </Tab>
                          )}
                        </Tabs>
                      </div>
                    </div>
                    <SidebarView tutorData={tutorData} />
                  </>
                )}
              </div>
            </div>
          </section>
        </main>
      </Layout>
    </>
  );
};

export default UserListingViewDetails;
