/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useEffect, useState } from "react";
import Select from "react-select";
import shape from "../../../assets/general/shape.png";
import { userEducationCategory } from "../service/UserListingService";
import { Link, useLocation, useParams } from "react-router-dom";

const UserListingSearch = ({
  searchQuery,
  setSearchQuery,
  handleSearch,
  setSelectedSortOption,
  handleCategoryChange,
  selectedCategory,
  toggleIconClicked,
  isIconClicked,
  searchResultsCount,
  setIsSide2Expanded
}) => {
  const { id } = useParams();
  const [educationCategory, setEducaionCategory] = useState([]);
  const location = useLocation();
  const { searchQuery: initialSearchQuery } = location.state || {};

  useEffect(() => {
    setSearchQuery(initialSearchQuery);
  }, []);

  useEffect(() => {
    userEducationCategory().then((response) => {
      setEducaionCategory(response?.data?.data);
      if (response?.data?.data?.length > 0) {
        let category = response?.data?.data.filter(
          (category) => category.id === id
        );
        if (category?.length > 0) {
          handleCategoryChange({
            value: category[0]?.id,
            label: category[0]?.category_name
          });
          setIsSide2Expanded(true);
        }
      }
    });
  }, []);

  return (
    <div>
      <div className={`${searchQuery ? "" : "tu-listing-wrapper"}`}>
        <div className="tu-sort">
          <h3>{searchResultsCount} search results found</h3>
          <div className="tu-sort-right-area">
            <div className="tu-sortby">
              <span className="fs-6">Sort by : </span> &nbsp; &nbsp;
              <Select
                placeholder="Select price filter"
                options={[
                  {
                    value: "ASC",
                    label: "Price low to high"
                  },
                  {
                    value: "DESC",
                    label: "Price high to low"
                  }
                ]}
                onChange={(selectedOption) =>
                  setSelectedSortOption(selectedOption)
                }
              />
            </div>
            <div className="tu-filter-btn">
              <Link
                className={`tu-listbtn ${isIconClicked ? "" : "active"}`}
                onClick={toggleIconClicked}
              >
                <i className="icon icon-list"></i>
              </Link>
              <Link
                className={`tu-listbtn ${isIconClicked ? "active" : ""}`}
                onClick={toggleIconClicked} // Toggle the icon click state
              >
                <i className="icon icon-grid"></i>
              </Link>
            </div>
          </div>
        </div>
        <div className="tu-searchbar-wrapper">
          <div className="tu-appendinput">
            <div className="tu-searcbar homepage-search">
              <div className="tu-inputicon">
                <Link to="/">
                  <i className="icon icon-search"></i>
                </Link>
                <input
                  type="text"
                  className="form-control"
                  placeholder="What do you want to explore?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSearch();
                    }
                  }}
                />
              </div>
              <div
                className="d-flex homepage-selecte-category"
                style={{ width: "160px" }}
              >
                <Link
                  to="/search-listing"
                  className="tu-primbtn-lg tu-primbtn-orange"
                  onClick={handleSearch}
                >
                  Search now
                </Link>
              </div>
            </div>
          </div>
          <div className="tu-listing-search">
            <figure>
              <img src={shape} alt="image" />
            </figure>
            <span>Start from here</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserListingSearch;
