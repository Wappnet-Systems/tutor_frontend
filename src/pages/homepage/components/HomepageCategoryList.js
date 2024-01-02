import React, { useEffect, useState } from "react";
import "@splidejs/splide/dist/css/themes/splide-default.min.css";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import { Link, useNavigate } from "react-router-dom";
import zigZagImg from "../../../assets/banner/zigzag-line.svg";
import { getHomepageCategoryList } from "../service/HomepageService";

const HomepageCategoryList = () => {
  const [categoryList, setCategoryList] = useState([]);
  const navigate = useNavigate();

  const getCategoryList = () => {
    getHomepageCategoryList().then((response) => {
      setCategoryList(response?.data?.data);
    });
  };

  useEffect(() => {
    getCategoryList();
  }, []);

  const handleCategoryId = (categoryId) => {
    navigate(`/search-listing/${categoryId}`);
  };

  const generateDefaultImage = (text) => {
    if (!text) return null;
    const firstLetter = text.charAt(0).toUpperCase();
    const canvas = document.createElement("canvas");
    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#F97316";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#ffffff";
    ctx.font = "50px Trebuchet MS";
    ctx.fillText(firstLetter, 35, 65);
    return canvas.toDataURL();
  };

  return (
    <div>
      <main className="tu-main">
        <section className="tu-main-section">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <div className="tu-maintitle text-center">
                  <img src={zigZagImg} alt="img" />
                  <h4>Let’s make a quick start today</h4>
                  <h2>Choose from the top visited categories you may like</h2>
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
              id="tu-categoriesslider"
              className="splide tu-categoriesslider tu-splidedots"
            >
              <Splide
                options={{
                  rewind: true,
                  width: "100%",
                  gap: "1.5rem",
                  perPage: 4,
                  pagination: false,
                  arrows: true,
                  breakpoints: {
                    991: {
                      perPage: 3,
                      pagination: true,
                      arrows: false,
                      focus: 0
                    },
                    767: {
                      perPage: 2
                    },
                    575: {
                      perPage: 1
                    }
                  }
                }}
              >
                {categoryList?.map((category) => {
                  return (
                    <SplideSlide key={category?.subject_category_id}>
                      <div
                        className="tu-categories_content"
                        onClick={() =>
                          handleCategoryId(
                            category?.subject_category_id,
                            category?.subject_category_category_name
                          )
                        }
                      >
                        <>
                          {category?.subject_category_media === null ? (
                            <div className="homepage-category-image">
                              <figure>
                                <img
                                  src={generateDefaultImage(
                                    category?.subject_category_category_name
                                  )}
                                  alt="Default Image"
                                />
                              </figure>
                            </div>
                          ) : (
                            <div className="homepage-category-image">
                              <figure>
                                <img
                                  src={category?.subject_category_media}
                                  alt="img"
                                />
                              </figure>
                            </div>
                          )}
                          <div className="tu-categories_title">
                            <h6>{category?.subject_category_category_name}</h6>
                            <span>
                              {category?.tutor_subject_count} Listings
                            </span>
                          </div>
                        </>
                      </div>
                    </SplideSlide>
                  );
                })}
              </Splide>
            </div>
            <div className="tu-mainbtn">
              <Link to="/search-listing" className="tu-primbtn-lg">
                <span>Explore All categories</span>
                <i className="icon icon-chevron-right"></i>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomepageCategoryList;
