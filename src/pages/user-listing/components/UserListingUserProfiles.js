/* eslint-disable no-undef */
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  addUserBookMark,
  deleteBookMark,
  getAllUserData,
  getUserDataByFilters
} from "../service/UserListingService";
import ReactPaginate from "react-paginate";
import avatarImage from "../../../assets/banner/avatar_image.webp";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { Badge, Stack } from "react-bootstrap";

const UserListingUserProfiles = ({
  filteredData,
  filtersApplied,
  isIconClicked,
  handleClearFilters,
  setFilteredData,
  setFiltersApplied,
  filterdCount,
  setfilteredCount,
  currentPage,
  setCurrentPage
}) => {
  const location = useLocation();
  const { searchQuery } = location.state || {};
  const { id: categoryId } = useParams(); //
  const userDataMain = useSelector((state) => state.userData?.userData);
  const [userData, setUserData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const limit = 10;
  const sort = "ASC";
  const navigate = useNavigate();
  const [isFirstRender, setIsFirstRender] = useState(true);

  const access_token = localStorage.getItem("access_token");

  const handleLinkClick = () => {
    if (!access_token) {
      navigate("/login");
    }
  };

  const getAllUserDataApi = () => {
    // if (filtersApplied) {
    //   setUserData(filteredData);
    //   setTotalCount(filterdCount);
    // }
    // else {
    getAllUserData(limit, sort, currentPage).then((response) => {
      setUserData(response?.data?.data?.data);
      setTotalCount(response?.data?.data?.totalItem);
      setfilteredCount(response?.data?.data?.totalItem);
    });
    // }
  };

  useEffect(() => {
    if (filtersApplied === true) {
      setUserData(filteredData);
      setTotalCount(filterdCount);
    } else if (!filtersApplied && !isFirstRender) {
      getAllUserDataApi();
    }
  }, [filtersApplied, filteredData, isFirstRender]);

  useEffect(() => {
    setIsFirstRender(false);
  }, []);

  // useEffect(() => {
  //   getAllUserDataApi();
  // }, []);

  const filteredUserData = userData?.filter((item) => {
    const matchesCategory =
      !categoryId ||
      item?.tutor_subjects?.some(
        (subject) => subject?.category_id === categoryId
      );
    const matchesSearch =
      !searchQuery ||
      item?.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item?.last_name.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const handleApplyFilters = () => {
    const filters = {
      search: searchQuery,
      category: categoryId,
      limit: 10,
      sort: "ASC",
      page: currentPage
    };

    getUserDataByFilters(filters).then((response) => {
      setFilteredData(response?.data?.data?.data);
      // setFiltersApplied(true);
      setfilteredCount(response?.data?.data?.totalItem);
    });
  };

  useEffect(() => {
    handleApplyFilters();
  }, []);

  const handlePageClick = (selectedPage) => {
    setCurrentPage(selectedPage.selected + 1);
  };

  const pageCount = Math.max(Math.ceil(totalCount / limit), 1);

  const handleAddBookMark = (userId) => {
    if (userId) {
      addUserBookMark(userId)
        .then((res) => {
          toast.success(res?.data?.message?.[0]);
          getAllUserData(limit, sort, currentPage).then((response) => {
            setUserData(response?.data?.data?.data);
            setTotalCount(response?.data?.data?.totalItem);
          });
        })
        .catch((err) => {});
    }
  };

  const handleDeleteBookMark = (userId) => {
    if (userId) {
      deleteBookMark(userId).then((res) => {
        toast.success(res?.data?.message?.[0]);
        getAllUserData(limit, sort, currentPage).then((response) => {
          setUserData(response?.data?.data?.data);
          setTotalCount(response?.data?.data?.totalItem);
        });
      });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <>
      <div className="tu-listinginfo-holder tu-listing-tutors">
        {filteredUserData?.length === 0 ? (
          <div className="tu-freelanceremptylist">
            <div className="tu-freelanemptytitle">
              <h4>Oops! No data match with your keyword</h4>
              <p>
                We're sorry but there is no instructors found according to your
                search criteria
              </p>

              <Link
                to="/search-listing"
                className="tu-primbtn"
                onClick={handleClearFilters}
              >
                Reset search &amp; start over
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className={`${isIconClicked ? "row gy-4" : ""}`}>
              {filteredUserData?.map((item) => {
                return (
                  <div
                    key={item.id}
                    className={`${isIconClicked ? "col-md-6 col-xxl-6" : ""}`}
                  >
                    <div className="tu-listinginfo">
                      {userDataMain?.user_type === 3 &&
                        item?.student_bookmarks?.length > 0 && (
                          <span className="tu-cardtag"></span>
                        )}

                      <div key={item?.id} className="tu-listinginfo_wrapper">
                        <div className="tu-listinginfo_title align-items-start">
                          <div className="tu-listinginfo-img">
                            {item?.image === null ? (
                              <img
                                src={avatarImage}
                                alt="imge"
                                style={{
                                  height: "115px",
                                  width: "115px",
                                  marginRight: "10px"
                                }}
                              />
                            ) : (
                              <img
                                src={item?.image}
                                alt="imge"
                                style={{
                                  height: "115px",
                                  width: "115px",
                                  marginRight: "10px",
                                  objectFit: "cover"
                                }}
                              />
                            )}

                            <div className="tu-listing-heading">
                              <h5>
                                <Link
                                  to={`/search-listing-view/${item?.id}`}
                                  onClick={() => scrollToTop()}
                                >
                                  {item?.first_name} {item?.last_name}
                                </Link>
                                <i
                                  className="icon icon-check-circle tu-greenclr"
                                  data-tippy-trigger="mouseenter"
                                  data-tippy-html="#tu-verifed"
                                  data-tippy-interactive="true"
                                  data-tippy-placement="top"
                                ></i>
                              </h5>
                              <div className="tu-listing-location">
                                {item?.avg_rating === null ? (
                                  ""
                                ) : (
                                  <span className="me-2">
                                    {item?.avg_rating}.0
                                    <i className="fa-solid fa-star"></i>
                                  </span>
                                )}
                                {item?.total_reviews === 0 ? (
                                  ""
                                ) : (
                                  <span className="me-2">
                                    <em className="p-0">
                                      ({item?.total_reviews})
                                    </em>
                                  </span>
                                )}
                                {item?.address === null ? (
                                  ""
                                ) : (
                                  <address>
                                    <i className="icon icon-map-pin"></i>
                                    {item?.address}
                                  </address>
                                )}
                              </div>
                              <span>{item?.tag_line}</span>

                              <div className="d-flex">
                                {item?.tutor_badge.length > 0 ? (
                                  <span style={{ fontSize: "smaller" }}>
                                    Badge:{" "}
                                  </span>
                                ) : (
                                  ""
                                )}
                                {item?.tutor_badge?.map((item, index) => {
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
                                    <Stack
                                      className="d-flex"
                                      direction="horizontal"
                                      key={index}
                                    >
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
                            </div>
                          </div>
                          <div
                            className={`${
                              isIconClicked
                                ? "tu-listinginfo_price_grid "
                                : "tu-listinginfo_price"
                            }`}
                          >
                            <span className={`${isIconClicked ? "fs-6" : ""}`}>
                              Starting from:
                            </span>
                            <h5>${item?.hourly_rate}/hr</h5>
                          </div>
                        </div>
                        <div className="tu-listinginfo_description">
                          <p>{item?.introduction}</p>
                        </div>

                        {item?.teach_at_online === true ||
                        item?.teach_at_offline === true ? (
                          <div className="tu-listinginfo_service">
                            <h6>You can get teaching service direct at</h6>
                            <ul className="tu-service-list">
                              {item?.teach_at_online === true && (
                                <li>
                                  <span>
                                    <i className="icon icon-video tu-orangeclr"></i>
                                    Online
                                  </span>
                                </li>
                              )}
                              {item?.teach_at_offline === true && (
                                <li>
                                  <span>
                                    <i className="icon icon-map-pin tu-colorblue"></i>
                                    Offline
                                  </span>
                                </li>
                              )}
                            </ul>
                          </div>
                        ) : (
                          ""
                        )}

                        {item?.teach_at_offline === true && (
                          <div className="tu-listinginfo_postcode mt-2 d-flex flex-wrap align-items-center">
                            <h6 className="m-0">Available at:</h6>

                            <ul className="ms-2 p-0 d-flex flex-wrap ">
                              {item?.tutor_postcodes?.map((item2, index2) => {
                                return (
                                  <li>
                                    <span key={item2?.id}>
                                      {item2?.postcode?.place_name +
                                        " (" +
                                        item2?.postcode?.postcode +
                                        ") "}
                                      {index2 !==
                                        item?.tutor_postcodes?.length - 1 &&
                                        ", "}
                                    </span>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        )}

                        <div className="tu-listinginfo_btn">
                          <>
                            {userDataMain?.user_type !== 2 && (
                              <div
                                className={`tu-iconheart `}
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                  if (userDataMain?.user_type === undefined) {
                                    handleLinkClick();
                                  } else if (
                                    item?.student_bookmarks?.length > 0
                                  ) {
                                    handleDeleteBookMark(
                                      item.student_bookmarks[0].id
                                    );
                                  } else {
                                    handleAddBookMark(item?.id);
                                  }
                                }}
                              >
                                <i
                                  className={`icon icon-heart ${
                                    item?.student_bookmarks?.length > 0
                                      ? "tu-colorred"
                                      : ""
                                  }`}
                                ></i>
                                <span>Add to bookmark</span>
                              </div>
                            )}
                          </>

                          <div className="tu-btnarea">
                            <Link
                              to={`/search-listing-view/${item?.id}`}
                              className="tu-primbtn"
                              onClick={() => scrollToTop()}
                            >
                              View full profile
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
      {filteredUserData?.length >= 1 && (
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
            forcePage={currentPage - 1}
          />
        </nav>
      )}
    </>
  );
};

export default UserListingUserProfiles;
