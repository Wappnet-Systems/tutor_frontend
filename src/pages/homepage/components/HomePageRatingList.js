/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useEffect, useState } from "react";
import zigZagImg from "../../../assets/banner/zigzag-line.svg";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import avatarImage from "../../../assets/banner/avatar_image.webp";
import { Link } from "react-router-dom";
import { getHomepageRatingList } from "../service/HomepageService";
import { useSelector } from "react-redux";
import {
  addUserBookMark,
  deleteBookMark
} from "../../user-listing/service/UserListingService";
import { toast } from "react-toastify";
import { Badge, Stack } from "react-bootstrap";

const HomePageRatingList = () => {
  const [ratingList, setRatingList] = useState([]);
  const userDataMain = useSelector((state) => state.userData?.userData);

  const getRatingList = () => {
    getHomepageRatingList().then((response) => {
      setRatingList(response?.data?.data);
    });
  };

  useEffect(() => {
    getRatingList();
  }, []);

  const handleAddBookMark = (userId) => {
    if (userId) {
      addUserBookMark(userId).then((res) => {
        toast.success(res?.data?.message?.[0]);
        getRatingList();
      });
    }
  };

  const handleDeleteBookMark = (userId) => {
    if (userId) {
      deleteBookMark(userId).then((res) => {
        toast.success(res?.data?.message?.[0]);
        getRatingList();
      });
    }
  };

  return (
    <div>
      <section className="tu-main-section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="tu-maintitle text-center">
                <img src={zigZagImg} alt="img" />
                <h4>Our featured instructors</h4>
                <h2>Every instructor is professional and highly qualified</h2>
                <p>
                  Accusamus et iusidio dignissimos ducimus blanditiis
                  praesentium voluptatum deleniti atque corrupti quos dolores
                  etmquasa molestias epturi sint occaecati cupiditate non
                  providente mikume molareshe.
                </p>
              </div>
            </div>
          </div>
          <div
            id="tu-featurelist"
            className="splide tu-featurelist  tu-splidedots "
          >
            <Splide
              options={{
                rewind: true,
                width: "100%",
                gap: "1.5rem",
                perPage: 3,
                pagination: false,
                arrows: true,
                breakpoints: {
                  991: {
                    perPage: 2,
                    pagination: true,
                    arrows: false,
                    focus: "center"
                  },
                  767: {
                    perPage: 1
                  }
                }
              }}
            >
              {ratingList?.map((rating) => {
                return (
                  <SplideSlide key={rating?.id}>
                    <div className="tu-featureitem">
                      <figure>
                        <Link to={`/search-listing-view/${rating?.id}`}>
                          {rating?.image !== null ? (
                            <img src={rating?.image} alt="image-description" />
                          ) : (
                            <img src={avatarImage} alt="image-description" />
                          )}
                        </Link>
                        <span className="tu-featuretag">FEATURED</span>
                      </figure>
                      <div className="tu-authorinfo">
                        <div className="tu-authordetail">
                          <figure>
                            {rating?.image !== null ? (
                              <img
                                src={rating?.image}
                                alt="image-description"
                              />
                            ) : (
                              <img src={avatarImage} alt="image-description" />
                            )}
                          </figure>
                          <div className="tu-authorname">
                            <h5>
                              <a href="tutor-detail.html">
                                {rating?.first_name} {rating?.last_name}
                              </a>
                              <i
                                className="icon icon-check-circle tu-greenclr"
                                data-tippy-trigger="mouseenter"
                                data-tippy-html="#tu-verifed"
                                data-tippy-interactive="true"
                                data-tippy-placement="top"
                              ></i>
                            </h5>
                            <span>{rating?.address}</span>
                          </div>
                          <ul className="tu-authorlist">
                            {rating?.hourly_rate === null ? (
                              <li>
                                <span>
                                  Starting from:
                                  <em>$0/hr</em>
                                </span>
                              </li>
                            ) : (
                              <li>
                                <span>
                                  Starting from:
                                  <em>${rating?.hourly_rate}/hr</em>
                                </span>
                              </li>
                            )}

                            <li>
                              <span>
                                Mobile:<em>{rating?.contact_number}</em>
                              </span>
                            </li>
                            <li>
                              <span>
                                Whatsapp:<em>{rating?.whatsapp}</em>
                              </span>
                            </li>
                            <li>
                              <span>
                                Qualification:
                                <em>
                                  {rating?.education_details &&
                                  rating?.education_details?.length > 0
                                    ? rating?.education_details[0]?.course_name
                                    : ""}
                                </em>
                              </span>
                            </li>
                          </ul>
                          {rating?.tutor_badge.length > 0 ? (
                            <span className="">Badge: &nbsp; &nbsp;</span>
                          ) : (
                            ""
                          )}

                          {rating?.tutor_badge?.map((item, index) => {
                            const badgeColors = {
                              Mentor: "primary",
                              "Master Mentor": "secondary",
                              "Outstanding Feedback": "success",
                              "Subject Matter Expert": "danger",
                              Experienced: "light",
                              Veteran: "dark"
                            };
                            const badgeTitle = item?.badge?.title;
                            const backgroundColor =
                              badgeColors[badgeTitle] || "info"; // Default to "info" color if title not found

                            return (
                              <Stack direction="horizontal" key={index}>
                                <Badge
                                  pill
                                  bg={backgroundColor}
                                  className="mx-1"
                                >
                                  {badgeTitle}
                                </Badge>
                              </Stack>
                            );
                          })}
                        </div>
                        <div className="tu-instructors_footer">
                          <div className="tu-rating">
                            <i className="fas fa-star"></i>
                            {rating?.avg_rating === null ? (
                              <h6>0.0/5.0</h6>
                            ) : (
                              <h6>{rating?.avg_rating}/5.0</h6>
                            )}

                            <span>({rating?.total_reviews})</span>
                          </div>
                          <div
                            className="tu-instructors_footer-right"
                            style={{ marginTop: "12px" }}
                          >
                            {userDataMain?.user_type === 3 && (
                              <div
                                className={`tu-iconheart`}
                                onClick={() => {
                                  rating?.student_bookmarks?.length > 0
                                    ? handleDeleteBookMark(
                                        rating?.student_bookmarks?.[0]?.id
                                      )
                                    : handleAddBookMark(rating?.id);
                                }}
                              >
                                <i
                                  className={`icon icon-heart ${
                                    rating?.student_bookmarks?.length > 0
                                      ? "tu-colorred"
                                      : ""
                                  }`}
                                ></i>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </SplideSlide>
                );
              })}
            </Splide>
          </div>
          <div className="tu-mainbtn">
            <Link to="/search-listing" className="tu-primbtn-lg">
              <span>Explore all instructors</span>
              <i className="icon icon-chevron-right"></i>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePageRatingList;
