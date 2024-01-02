/* eslint-disable jsx-a11y/role-supports-aria-props */
import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import UserListingSearch from "./components/UserListingSearch";
import UserListingSiderbar from "./components/UserListingSiderbar";
import UserListingUserProfiles from "./components/UserListingUserProfiles";
import {
  getAllSubject,
  getAllUserData,
  getUserDataByFilters,
  getUserDataByName
} from "./service/UserListingService";
import { Link, useLocation } from "react-router-dom";

const SearchListing = () => {
  const location = useLocation();
  const [isSide3Expanded, setIsSide3Expanded] = useState(false);
  const [isGenderExpanded, setIsGenderExpanded] = useState(false);
  const [isSide1aExpanded, setIsSidelaExpanded] = useState(false);
  const [isSide1abExpanded, setIsSidelabExpanded] = useState(false);
  const [isSide2Expanded, setIsSide2Expanded] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [filtersApplied, setFiltersApplied] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [educationCategory, setEducaionCategory] = useState([]);
  const [hourly_rate_mix, setMinPrice] = useState("");
  const [hourly_rate_max, setMaxPrice] = useState("");
  const [gender, setGender] = useState("");
  const [bookingStatus, setBookingStatus] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [filterdCount, setfilteredCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPostcode, setSelectedPostcode] = useState(null);

  // const { searchQuery: initialSearchQuery } = location.state || {};

  useEffect(() => {
    setFiltersApplied(true);
    setfilteredCount(location?.state?.totalItem);
  }, [location?.state]);

  const [selectSubject, setSelectSubject] = useState(
    educationCategory?.map((category) => ({
      category: category.id,
      id: null,
      subject_name: "",
      checked: false
    }))
  );
  const [selectedSortOption, setSelectedSortOption] = useState(null); // New state variable
  const [isIconClicked, setIsIconClicked] = useState(false);

  const toggleIconClicked = () => {
    setIsIconClicked((prevState) => !prevState);
  };

  // Call the API to fetch filtered data based on the searchQuery
  const handleSearch = () => {
    // getUserDataByName(10, "ASC", 1, searchQuery).then((response) => {
    //   setFilteredData(response?.data?.data?.data);
    //   setFiltersApplied(true);
    //   setfilteredCount(response?.data?.data?.totalItem);
    // });
    handleApplyFilters();
  };

  // Call the API to fetch filtered data based on the sorting query
  useEffect(() => {
    if (selectedSortOption) {
      getAllUserData(10, selectedSortOption.value, 1).then((response) => {
        setFilteredData(response?.data?.data?.data);
        setFiltersApplied(true);
      });
    }
  }, [selectedSortOption]);

  // function of change category
  const handleCategoryChange = async (selectedOption) => {
    setSelectedCategory(selectedOption); // Update selected option
    setIsSide2Expanded(true);
    setSelectSubject([]); // Reset selected subjects

    if (selectedOption) {
      const response = await getAllSubject(selectedOption.value);
      setSelectSubject(response?.data?.data);
    }
  };

  // const getTutorData = () => {
  //   getAllUserData(10, "ASC", 1).then((response) => {
  //     setFilteredData(response?.data?.data?.data);
  //     setFiltersApplied(true);
  //   });
  // };

  const handleClearFilters = () => {
    setSelectSubject(
      selectSubject?.map((item) => ({ ...item, checked: false }))
    );
    setMinPrice("");
    setMaxPrice("");
    setSelectedRatings("");
    setGender("");
    setBookingStatus("");
    setFiltersApplied(false);
    setSelectedAddress("");
    setSelectedCategory("");
    setSearchQuery("");
    setSelectedCategory(null);
    setIsSide2Expanded(false);
    setIsGenderExpanded(false);
    setIsSidelaExpanded(false);
    setIsSide3Expanded(false);
    setIsSidelabExpanded(false);

    const limit = 10;
    const sort = "ASC";
    const page = 1;

    getAllUserData(limit, sort, page).then((response) => {
      setFilteredData(response?.data?.data?.data);
      setCurrentPage(page);
      setFiltersApplied(true);
    });
  };

  const selectedCategoryIds = selectedCategory?.value || "";

  const handleApplyFilters = () => {
    setFiltersApplied(true);

    const filters = {
      booking_type: bookingStatus, // Hardcoded as in your URL example
      location: selectedAddress, // Hardcoded as in your URL example
      rating: selectedRatings,
      gender: gender,
      hourly_rate_max: hourly_rate_max,
      hourly_rate_min: hourly_rate_mix,
      search: searchQuery,
      subject: selectSubject
        .filter((item) => item.checked)
        .map((item) => item.id)
        .join(","),
      category: selectedCategoryIds,
      limit: 10,
      sort: "ASC",
      page: currentPage,
      postcode:
        selectedPostcode && selectedPostcode?.map((item) => item).join(",")
    };

    getUserDataByFilters(filters).then((response) => {
      setfilteredCount(response?.data?.data?.totalItem);
      setFilteredData(response?.data?.data?.data);
      setFiltersApplied(true);
    });
  };

  return (
    <>
      <Layout>
        <main className="tu-bgmain tu-main">
          <section className="tu-main-section">
            <div className="container">
              <div className="row">
                <div className="col-lg-12">
                  <UserListingSearch
                    setSearchQuery={setSearchQuery}
                    handleSearch={handleSearch}
                    searchQuery={searchQuery}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    setSelectedSortOption={setSelectedSortOption}
                    handleCategoryChange={handleCategoryChange}
                    toggleIconClicked={toggleIconClicked}
                    isIconClicked={isIconClicked}
                    searchResultsCount={filterdCount}
                    setIsSide2Expanded={setIsSide2Expanded}
                  />
                </div>
              </div>
              {searchQuery && (
                <div className="row">
                  <div className="col-lg-12">
                    <div className="my-3 mx-1">
                      <Link to="/search-listing" onClick={handleClearFilters}>
                        Clear Search
                      </Link>
                    </div>
                  </div>
                </div>
              )}
              <div className="row">
                <div className="col-xl-4 col-xxl-3">
                  <UserListingSiderbar
                    selectedRatings={selectedRatings}
                    selectedAddress={selectedAddress}
                    bookingStatus={bookingStatus}
                    gender={gender}
                    hourly_rate_max={hourly_rate_max}
                    hourly_rate_mix={hourly_rate_mix}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    handleCategoryChange={handleCategoryChange}
                    educationCategory={educationCategory}
                    selectSubject={selectSubject}
                    setSelectSubject={setSelectSubject}
                    setEducaionCategory={setEducaionCategory}
                    isSide2Expanded={isSide2Expanded}
                    setIsSide2Expanded={setIsSide2Expanded}
                    setSelectedRatings={setSelectedRatings}
                    setBookingStatus={setBookingStatus}
                    handleClearFilters={handleClearFilters}
                    setMinPrice={setMinPrice}
                    setMaxPrice={setMaxPrice}
                    setGender={setGender}
                    setFiltersApplied={setFiltersApplied}
                    setFilteredData={setFilteredData}
                    setIsGenderExpanded={setIsGenderExpanded}
                    setIsSidelaExpanded={setIsSidelaExpanded}
                    setIsSide3Expanded={setIsSide3Expanded}
                    setIsSidelabExpanded={setIsSidelabExpanded}
                    isSide3Expanded={isSide3Expanded}
                    isSide1aExpanded={isSide1aExpanded}
                    isGenderExpanded={isGenderExpanded}
                    isSide1abExpanded={isSide1abExpanded}
                    setfilteredCount={setfilteredCount}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    searchQuery={searchQuery}
                    handleApplyFilters={handleApplyFilters}
                    setSelectedPostcode={setSelectedPostcode}
                    selectedPostcode={selectedPostcode}
                  />
                </div>
                <div className={`col-xl-8 col-xxl-9`}>
                  <UserListingUserProfiles
                    selectedCategory={selectedCategory}
                    filteredData={filteredData}
                    filtersApplied={filtersApplied}
                    isIconClicked={isIconClicked}
                    setSearchQuery={setSearchQuery}
                    handleClearFilters={handleClearFilters}
                    // getTutorData={getTutorData}
                    setFiltersApplied={setFiltersApplied}
                    setFilteredData={setFilteredData}
                    filterdCount={filterdCount}
                    setfilteredCount={setfilteredCount}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                  />
                </div>
              </div>
            </div>
          </section>
        </main>
      </Layout>
    </>
  );
};

export default SearchListing;
