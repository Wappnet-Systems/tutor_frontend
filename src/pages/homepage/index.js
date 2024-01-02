import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Typed from "typed.js";
import Layout from "../../components/Layout";
import HomeBannerImg from "../../assets/banner/hero-banner.png";
import KnobImage from "../../assets/knob_line.svg";
import plateformImg from "../../assets/homepage/education-plateform.png";
import zigZagImg from "../../assets/banner/zigzag-line.svg";
import HomepageCategoryList from "./components/HomepageCategoryList";
import HomePageRatingList from "./components/HomePageRatingList";
import HomePageCounter from "./components/HomePageCounter";
import Select from "react-select";
import {
  getAllSubject,
  getAllUserData,
  getUserDataByName,
  userEducationCategory
} from "../user-listing/service/UserListingService";

const HomePage = () => {
  const [filteredData, setFilteredData] = useState([]);
  const [filtersApplied, setFiltersApplied] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [educationCategory, setEducaionCategory] = useState([]);
  const [selectSubject, setSelectSubject] = useState(
    educationCategory?.map((category) => ({
      category: category.id,
      id: null,
      subject_name: "",
      checked: false
    }))
  );
  // const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    userEducationCategory().then((response) => {
      setEducaionCategory(response?.data?.data);
    });
  }, []);
  const el = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const typed = new Typed(el.current, {
      strings: ["A bright future", "Equitable societies", "Self confidence"],
      typeSpeed: 100,
      backSpeed: 100,
      loop: true,
      showCursor: false
    });
    return () => {
      // Destroy Typed instance during cleanup to stop animation
      typed.destroy();
    };
  });

  const handleUser = (userType) => {
    navigate("/signup", { state: { userType } });
  };

  const handleCategoryChange = async (selectedOption) => {
    setSelectedCategory(selectedOption); // Update selected option
    setSelectSubject([]); // Reset selected subjects

    if (selectedOption) {
      const response = await getAllSubject(selectedOption.value);
      setSelectSubject(response?.data?.data);
      navigate(`/search-listing/${selectedOption?.value}`);
    }
  };

  const handleSearch = () => {
    if (searchQuery?.length > 0) {
      getUserDataByName(10, "ASC", 1, searchQuery).then((response) => {
        const totalItem = response?.data?.data?.totalItem;
        setFilteredData(response?.data?.data?.data);
        setFiltersApplied(true);
        navigate("/search-listing", {
          state: { searchQuery, totalItem }
        });
      });
    }
  };

  return (
    <>
      <Layout>
        <div className="tu-banner">
          <div className="container">
            <div className="row align-items-center g-0 gy-5">
              <div className="col-lg-6">
                <div className="me-0 me-sm-3">
                  <div className="tu-banner_title">
                    <h1>
                      A good <span>#education</span> is always a base of
                    </h1>
                    <span className="tu-bannerinfo" ref={el}></span>
                    <p>
                      Consectur adipiscing elitsedo eiusmod tempor incididuntem
                      utaborate dolore magna aliqua ad minim veniamque.
                    </p>
                    <ul className="tu-banner_list">
                      <li>
                        <div className="tu-starthere">
                          <span>Start from here</span>
                          <img src={KnobImage} alt="img" />
                        </div>
                        <button
                          onClick={() => handleUser("3")}
                          className="tu-primbtn tu-primbtn-gradient"
                        >
                          <span>Start as student</span>
                          <i className="icon icon-chevron-right"></i>
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => handleUser("2")}
                          className="tu-secbtn"
                        >
                          <span>Join as Instructor</span>
                          <em>It’s Free!</em>
                        </button>
                      </li>
                    </ul>
                  </div>
                  <div className="tu-searchbar-wrapper homepage-banner-search ">
                    <div className="tu-appendinput">
                      <div className="tu-searcbar position-relative">
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
                        <div className="homepage_search_btn">
                          <Link
                            to="/search-listing"
                            className="tu-primbtn-lg tu-primbtn-orange w-100"
                            onClick={(e) => {
                              e.preventDefault();
                              handleSearch();
                            }}
                          >
                            Search now
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="tu-searchbar-wrapper homepage-banner-search ">
                    <div className="tu-appendinput">
                      <div className="tu-searcbar">
                        <div className="homepage-banner-selecte-category">
                          <Select
                            placeholder="Select category"
                            options={educationCategory?.map((item) => ({
                              key: item?.id,
                              value: item?.id,
                              label: item?.category_name
                            }))}
                            value={selectedCategory}
                            onChange={(selectedOption) => {
                              handleCategoryChange(selectedOption);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 d-none d-lg-block">
                <div className="tu-bannerv1_img">
                  <img src={HomeBannerImg} alt="img" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="tu-main-section">
          <div className="container">
            <div className="row align-items-center gy-4">
              <div className="col-md-12 col-lg-6">
                <div className="tu-betterresult">
                  <figure>
                    <img src={plateformImg} alt="image-description" />
                  </figure>
                  {/* <div className="tu-resultperson">
                    <h6>Founder & CEO</h6>
                    <h5>Allen wake</h5>
                  </div> */}
                </div>
              </div>
              <div className="col-md-12 col-lg-6">
                <div className="tu-maintitle p-0 text-center">
                  <img src={zigZagImg} alt="img" />
                  <h4>Better Learning. Better Results</h4>
                  <h2 className="mw-100">
                    Online education platform that fits for everyone
                  </h2>
                  <p>
                    Accusamus et iusidio dignissimos ducimus blanditiis
                    praesentium voluptatum deleniti atque corrupti quos dolores
                    etmquasa molestias epturi sint occaecati cupiditate non
                    providente mikume molareshe.
                  </p>
                  <Link to="/about-us" className="tu-primbtn-lg">
                    <span>Explore more about us</span>
                    <i className="icon icon-chevron-right"></i>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
        <HomePageCounter />
        <HomePageRatingList />
        <HomepageCategoryList />
      </Layout>
    </>
  );
};

export default HomePage;
