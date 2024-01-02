import React, { useEffect, useState } from "react";
import img1 from "../../../assets/homepage/bookings-icon.png";
import img2 from "../../../assets/homepage/categories.png";
import img3 from "../../../assets/homepage/student-icon.png";
import img4 from "../../../assets/homepage/tutor-icon.png";
import { getHomepageCountsList } from "../service/HomepageService";

const HomePageCounter = () => {
  const [counts, setCounts] = useState({});

  const getCountsList = () => {
    getHomepageCountsList().then((response) => {
      setCounts(response?.data?.data);
    });
  };

  useEffect(() => {
    getCountsList();
  }, []);

  return (
    <div>
      <section>
        <div className="tu-statsholder">
          <div className="container">
            <ul id="tu-counter" className="tu-stats row">
              {counts && (
                <li className="col-12 col-md-6 col-lg-3">
                  <img src={img1} alt="img" />
                  <div className="tu-stats_info">
                    <h4>
                      <span
                        data-from="0"
                        data-to="560616"
                        data-speed="8000"
                        data-refresh-interval="50"
                      >
                        {counts?.total_number_of_bookings}
                      </span>
                    </h4>
                    <p>Total numbers of Bookings</p>
                  </div>
                </li>
              )}
              {counts && (
                <li className="col-12 col-md-6 col-lg-3">
                  <img src={img2} alt="img" />
                  <div className="tu-stats_info">
                    <h4>
                      <span
                        data-from="0"
                        data-to="560616"
                        data-speed="8000"
                        data-refresh-interval="50"
                      >
                        {counts?.total_number_of_categories}
                      </span>
                    </h4>
                    <p>Total numbers of categories</p>
                  </div>
                </li>
              )}
              {counts && (
                <li className="col-12 col-md-6 col-lg-3">
                  <img src={img3} alt="img" />
                  <div className="tu-stats_info">
                    <h4>
                      <span
                        data-from="0"
                        data-to="560616"
                        data-speed="8000"
                        data-refresh-interval="50"
                      >
                        {counts?.total_number_of_student_available}
                      </span>
                    </h4>
                    <p>Total numbers of student available</p>
                  </div>
                </li>
              )}
              {counts && (
                <li className="col-12 col-md-6 col-lg-3">
                  <img src={img4} alt="img" />
                  <div className="tu-stats_info">
                    <h4>
                      <span
                        data-from="0"
                        data-to="560616"
                        data-speed="8000"
                        data-refresh-interval="50"
                      >
                        {counts?.total_number_of_tutors_available}
                      </span>
                    </h4>
                    <p>Total numbers of tutor available</p>
                  </div>
                </li>
              )}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePageCounter;
