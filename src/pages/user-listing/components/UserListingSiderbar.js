/* eslint-disable jsx-a11y/role-supports-aria-props */
import React, { useEffect, useRef, useState } from "react";
import Select from "react-select";
import {
  getAllCity,
  getAllCountry,
  getAllUserData,
  getPostcode,
  getUserDataByFilters,
  userEducationCategory
  // userEducationCategory
} from "../service/UserListingService";
import { Link, useLocation } from "react-router-dom";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng
} from "react-places-autocomplete";
import { FaMapMarkerAlt } from "react-icons/fa";

const UserListingSiderbar = ({
  setFilteredData,
  setFiltersApplied,
  selectedCategory,
  educationCategory,
  handleCategoryChange,
  setSelectSubject,
  selectSubject,
  isSide2Expanded,
  setIsSide2Expanded,
  setEducaionCategory,
  setSelectedCategory,
  selectedRatings,
  bookingStatus,
  selectedAddress,
  gender,
  hourly_rate_max,
  hourly_rate_mix,
  setSelectedRatings,
  setBookingStatus,
  handleClearFilters,
  setMaxPrice,
  setMinPrice,
  setGender,
  isSide1abExpanded,
  isGenderExpanded,
  isSide3Expanded,
  isSide1aExpanded,
  setIsSidelabExpanded,
  setIsSide3Expanded,
  setIsSidelaExpanded,
  setIsGenderExpanded,
  setfilteredCount,
  currentPage,
  setCurrentPage,
  searchQuery,
  handleApplyFilters,
  setSelectedPostcode,
  selectedPostcode
}) => {
  // Set initial state for collapsible
  const [allPostcodes, setAllPostcodes] = useState([]);

  const [subjectsToShow, setSubjectsToShow] = useState(5);
  const isInitialRender = useRef(true);
  const genderOptions = [
    {
      value: "1",
      label: "Male"
    },
    {
      value: "2",
      label: "Female"
    },
    {
      value: "3",
      label: "Other"
    }
  ];

  const handleSide2Toggle = () => {
    setIsSide2Expanded(!isSide2Expanded);
  };

  const handleSide3Toggle = () => {
    setIsSide3Expanded(!isSide3Expanded);
  };

  const handleGenderToggle = () => {
    setIsGenderExpanded(!isGenderExpanded);
  };

  const handleSidelaToggle = () => {
    setIsSidelaExpanded(!isSide1aExpanded);
  };

  const handleSidelabToggle = () => {
    setIsSidelabExpanded(!isSide1abExpanded);
  };

  useEffect(() => {
    userEducationCategory().then((educationDetails) => {
      setEducaionCategory(educationDetails?.data?.data);
    });
    getPostcodes();
  }, []);

  const getPostcodes = () => {
    getPostcode().then((resp) => {
      let postcode = [];
      for (let index = 0; index < resp.data.data.length; index++) {
        const element = resp.data.data[index];
        postcode.push({
          value: element.id,
          label: element?.place_name + "(" + element?.postcode + ")"
        });
      }
      setAllPostcodes(postcode);
    });
  };

  /** handle change rating */

  const handleRatingChange = (event) => {
    const selectedRating = event.target.value;
    if (selectedRatings.includes(selectedRating)) {
      setSelectedRatings(
        selectedRatings.filter((rating) => rating !== selectedRating)
      );
    } else {
      setSelectedRatings([selectedRating]);
    }
  };

  /** handle change booking status */
  const handleBookingStatus = (value) => {
    if (bookingStatus.includes(value)) {
      setBookingStatus(bookingStatus.filter((status) => status !== value));
    } else {
      setBookingStatus([...bookingStatus, value]);
    }
  };

  // const selectedCategoryIds = selectedCategory?.value || "";

  // const handleApplyFilters = () => {
  //   setFiltersApplied(true);

  //   const filters = {
  //     booking_type: bookingStatus, // Hardcoded as in your URL example
  //     location: selectedAddress, // Hardcoded as in your URL example
  //     rating: selectedRatings,
  //     gender: gender,
  //     hourly_rate_max: hourly_rate_max,
  //     hourly_rate_min: hourly_rate_mix,
  //     search: searchQuery,
  //     subject: selectSubject
  //       .filter((item) => item.checked)
  //       .map((item) => item.id)
  //       .join(","),
  //     category: selectedCategoryIds,
  //     limit: 10,
  //     sort: "ASC",
  //     page: currentPage,
  //     postcode:
  //       selectedPostcode && selectedPostcode?.map((item) => item).join(",")
  //   };

  //   getUserDataByFilters(filters).then((response) => {
  //     setfilteredCount(response?.data?.data?.totalItem);
  //     setFilteredData(response?.data?.data?.data);
  //     setFiltersApplied(true);
  //   });
  // };

  useEffect(() => {
    if (!isInitialRender.current) {
      handleApplyFilters();
    } else {
      isInitialRender.current = false;
    }
  }, [currentPage]);

  return (
    <>
      <aside className="tu-asidewrapper sidebar-select">
        <div className="tu-aside-menu">
          {/* Education level holder */}
          <div className="tu-aside-holder">
            <div
              className="tu-asidetitle"
              data-bs-toggle="collapse"
              data-bs-target="#side2"
              role="button"
              aria-expanded={isSide2Expanded}
              onClick={handleSide2Toggle}
            >
              <h5>Education level</h5>
            </div>
            <div
              id="side2"
              className={`collapse ${isSide2Expanded ? "show" : ""}`}
            >
              <div className="tu-aside-content">
                <div className="tu-filterselect">
                  <Select
                    placeholder="Select category"
                    options={educationCategory?.map((item) => ({
                      value: item?.id,
                      label: item?.category_name
                    }))}
                    value={selectedCategory}
                    onChange={(selectedOption) => {
                      handleCategoryChange(selectedOption); // Update other logic based on category change
                    }}
                    // onChange={handleCategoryChange}
                  />
                </div>

                {selectedCategory !== null && (
                  <div className="tu-filterselect">
                    <h6>Choose subjects</h6>
                    <ul className="tu-categoriesfilter">
                      <li>
                        <div className="tu-check tu-checksm">
                          {selectSubject
                            ?.slice(0, subjectsToShow)
                            .map((item) => (
                              <React.Fragment key={item.id}>
                                <input
                                  type="checkbox"
                                  id={item.id}
                                  value={item.id}
                                  checked={item.checked || false}
                                  onChange={() => {
                                    item.checked = !item.checked;
                                    setSelectSubject([...selectSubject]); // Trigger re-render
                                  }}
                                />
                                <label htmlFor={item.id}>
                                  {item.subject_name}
                                </label>
                              </React.Fragment>
                            ))}
                        </div>
                      </li>
                    </ul>
                    {selectSubject?.length > 5 && (
                      <div className="show-more">
                        {subjectsToShow === 5 ? (
                          <button
                            className="tu-readmorebtn tu-show_more"
                            onClick={() =>
                              setSubjectsToShow(selectSubject.length)
                            }
                          >
                            Show all
                          </button>
                        ) : (
                          <button
                            className="tu-readmorebtn tu-show_more"
                            onClick={() => setSubjectsToShow(5)}
                          >
                            Show less
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Price range holder */}
          <div className="tu-aside-holder">
            <div
              className="tu-asidetitle"
              data-bs-toggle="collapse"
              data-bs-target="#side3"
              role="button"
              aria-expanded={isSide3Expanded}
              onClick={handleSide3Toggle}
            >
              <h5>Price range</h5>
            </div>
            <div
              id="side3"
              className={`collapse ${isSide3Expanded ? "show" : ""}`}
            >
              <div className="tu-aside-content">
                <div
                  className="tu-rangevalue"
                  data-bs-target="#tu-rangecollapse"
                  role="list"
                  aria-expanded="false"
                >
                  <div className="tu-areasizebox">
                    <input
                      type="number"
                      className="form-control tu-input-field"
                      placeholder="Min price"
                      name="hourly_rate_min"
                      id="tu-min-value"
                      value={hourly_rate_mix}
                      onChange={(e) => setMinPrice(e.target.value)}
                    />
                    <input
                      type="number"
                      className="form-control tu-input-field"
                      placeholder="Max price"
                      id="tu-max-value"
                      name="hourly_rate_max"
                      value={hourly_rate_max}
                      onChange={(e) => setMaxPrice(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Gender holder  */}
          <div className="tu-aside-holder">
            <div
              className="tu-asidetitle"
              data-bs-toggle="collapse"
              data-bs-target="#side2"
              role="button"
              aria-expanded={isGenderExpanded}
              onClick={handleGenderToggle}
            >
              <h5>Gender</h5>
            </div>
            <div
              id="side2"
              className={`collapse ${isGenderExpanded ? "show" : ""}`}
            >
              <div className="tu-aside-content">
                <div className="tu-filterselect">
                  <Select
                    placeholder="Select Gender"
                    options={genderOptions}
                    name="gender"
                    value={
                      gender !== ""
                        ? {
                            value: gender,
                            label: genderOptions?.find(
                              (option) => option.value === gender
                            )?.label
                          }
                        : ""
                    }
                    onChange={(gender) => setGender(gender?.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Rating holder */}
          <div className="tu-aside-holder">
            <div
              className="tu-asidetitle"
              data-bs-toggle="collapse"
              data-bs-target="#side1a"
              role="button"
              aria-expanded={isSide1aExpanded}
              onClick={handleSidelaToggle}
            >
              <h5>Rating</h5>
            </div>
            <div
              id="side1a"
              className={`collapse ${isSide1aExpanded ? "show" : ""}`}
            >
              <div className="tu-aside-content">
                <ul className="tu-categoriesfilter">
                  <li>
                    <div className="tu-check tu-checksm">
                      <input
                        type="checkbox"
                        id="rate5"
                        value="5"
                        name="rating"
                        checked={selectedRatings.includes("5")}
                        onChange={handleRatingChange}
                      />
                      <label htmlFor="rate5">
                        <span className="tu-stars">
                          <span></span>
                        </span>
                        <em className="tu-totalreview">
                          <span>
                            5.0/<em>5.0</em>
                          </span>
                        </em>
                      </label>
                    </div>
                  </li>
                  <li>
                    <div className="tu-check tu-checksm">
                      <input
                        type="checkbox"
                        id="rate4"
                        value="4"
                        name="rating"
                        checked={selectedRatings.includes("4")}
                        onChange={handleRatingChange}
                      />
                      <label htmlFor="rate4">
                        <span className="tu-stars tu-fourstar">
                          <span></span>
                        </span>
                        <em className="tu-totalreview">
                          <span>
                            4.0/<em>5.0</em>
                          </span>
                        </em>
                      </label>
                    </div>
                  </li>
                  <li>
                    <div className="tu-check tu-checksm">
                      <input
                        type="checkbox"
                        id="rate3"
                        value="3"
                        name="rating"
                        checked={selectedRatings.includes("3")}
                        onChange={handleRatingChange}
                      />
                      <label htmlFor="rate3">
                        <span className="tu-stars tu-threestar">
                          <span></span>
                        </span>
                        <em className="tu-totalreview">
                          <span>
                            3.0/<em>5.0</em>
                          </span>
                        </em>
                      </label>
                    </div>
                  </li>
                  <li>
                    <div className="tu-check tu-checksm">
                      <input
                        type="checkbox"
                        id="rate2"
                        value="2"
                        name="rating"
                        checked={selectedRatings.includes("2")}
                        onChange={handleRatingChange}
                      />
                      <label htmlFor="rate2">
                        <span className="tu-stars tu-twostar">
                          <span></span>
                        </span>
                        <em className="tu-totalreview">
                          <span>
                            2.0/<em>5.0</em>
                          </span>
                        </em>
                      </label>
                    </div>
                  </li>
                  <li>
                    <div className="tu-check tu-checksm">
                      <input
                        type="checkbox"
                        id="rate1"
                        value="1"
                        name="rating"
                        checked={selectedRatings.includes("1")}
                        onChange={handleRatingChange}
                      />
                      <label htmlFor="rate1">
                        <span className="tu-stars tu-onestar">
                          <span></span>
                        </span>
                        <em className="tu-totalreview">
                          <span>
                            1.0/<em>5.0</em>
                          </span>
                        </em>
                      </label>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Miscellaneous holder  */}
          <div className="tu-aside-holder">
            <div
              className="tu-asidetitle"
              data-bs-toggle="collapse"
              data-bs-target="#side1ab"
              role="button"
              aria-expanded={isSide1abExpanded}
              onClick={handleSidelabToggle}
            >
              <h5>Miscellaneous</h5>
            </div>
            <div
              id="side1ab"
              className={`collapse ${isSide1abExpanded ? "show" : ""}`}
            >
              <div className="tu-aside-content">
                <ul className="tu-categoriesfilter">
                  <li>
                    <div className="tu-check tu-checksm">
                      <input
                        type="checkbox"
                        id="online"
                        name="booking_type"
                        value="online"
                        checked={bookingStatus.includes("online")}
                        onChange={() => handleBookingStatus("online")}
                      />
                      <label htmlFor="online">Online bookings</label>
                    </div>
                  </li>
                  <li>
                    <div className="tu-check tu-checksm">
                      <input
                        type="checkbox"
                        id="offline"
                        name="booking_type"
                        value="offline"
                        checked={bookingStatus.includes("offline")}
                        onChange={() => handleBookingStatus("offline")}
                      />
                      <label htmlFor="offline">Offline booking</label>
                    </div>
                  </li>
                </ul>
                {bookingStatus[0] === "offline" && (
                  <div className="form-group">
                    <label className="tu-label">Postcode</label>
                    <div className="w-100">
                      <Select
                        isMulti
                        name="postcode_ids"
                        options={allPostcodes}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        placeholder="Select postcode"
                        // value={allPostcodes.filter((item) =>
                        //   selectedPostcode?.includes(item.value)
                        // )}
                        onChange={(selectedOptions) => {
                          setSelectedPostcode(
                            selectedOptions.map((option) => option.value)
                          );

                          // const selectedPostcodeValues = selectedOptions
                          //   .map((option) => option.value)
                          //   .join(",");

                          // formik.setFieldValue(
                          //   "postcode_ids",
                          //   selectedPostcodeValues
                          // );
                        }}
                      />
                    </div>
                    {/* {formik.values.postcode_ids == "" && (
                      <div className="tu-error-message">
                        Postcode is required
                      </div>
                    )} */}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="tu-filterbtns">
            <button className="w-100" onClick={handleApplyFilters}>
              <Link to="/search-listing" className="tu-primbtn">
                Apply filters
              </Link>
            </button>
            <Link
              to="/search-listing"
              className="tu-sb-sliver"
              onClick={handleClearFilters}
            >
              Clear all filters
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
};

export default UserListingSiderbar;
