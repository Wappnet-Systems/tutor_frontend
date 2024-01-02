import React from "react";
import Layout from "../../components/Layout";
import about1 from "../../assets/about-us/find_tutor.jpg";
import about2 from "../../assets/about-us/hire_tutor.jpg";
import about3 from "../../assets/about-us/tutor_done.jpg";
import aboutBackground from "../../assets/about-us/about_background.jpg";
import zigzaglineImg from "../../assets/about-us/zigzag-line.svg";

const AboutUs = () => {
  return (
    <>
      <Layout>
        <div className="tu-main tu-bgmain tu-aboutus">
          <section className="tu-main-section">
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-lg-8">
                  <div className="tu-maintitle text-center">
                    <img src={zigzaglineImg} alt="img" />
                    <h4>Making ease for everyone</h4>
                    <h2>We made it in easy way</h2>
                    <p>
                      accusamus et iusto odio dignissimos ducimus qui blanditiis
                      praesentium voluptatum deleniti atque corrupti quos
                      dolores et quas molestias excepturi sint occaecati
                      cupiditate non provident
                    </p>
                  </div>
                </div>
              </div>
              <div className="row tu-howit-steps gy-4 justify-content-center justify-content-xl-start">
                <div className="col-12 col-md-6 col-xl-4">
                  <div className="tu-howit-steps_content">
                    <figure>
                      <img src={about1} alt="images" />
                    </figure>
                    <div className="tu-howit-steps_info">
                      <span className="tu-step-tag tu-orange-bgclr">
                        STEP 01
                      </span>
                      <h5>Search for tutor</h5>
                      <p>
                        Aeccusamus et iusto odiomae dignissimos ducimus
                        quistames blanditiis praesentium voluptatum loramkes
                        anuten.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-md-6 col-xl-4">
                  <div className="tu-howit-steps_content">
                    <figure>
                      <img src={about2} alt="images" />
                    </figure>
                    <div className="tu-howit-steps_info">
                      <span className="tu-step-tag tu-purple-bgclr">
                        STEP 02
                      </span>
                      <h5>Hire your best match</h5>
                      <p>
                        Aeccusamus et iusto odiomae dignissimos ducimus
                        quistames blanditiis praesentium voluptatum loramkes
                        anuten.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-md-6 col-xl-4">
                  <div className="tu-howit-steps_content">
                    <figure>
                      <img src={about3} alt="images" />
                    </figure>
                    <div className="tu-howit-steps_info">
                      <span className="tu-step-tag tu-green-bgclr">
                        STEP 03
                      </span>
                      <h5>Get it done on time</h5>
                      <p>
                        Aeccusamus et iusto odiomae dignissimos ducimus
                        quistames blanditiis praesentium voluptatum loramkes
                        anuten.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section>
            <div
              className="tu-processing-holder"
              style={{ backgroundImage: `url(${aboutBackground})` }}
            >
              <div className="tu-processing-img"></div>
              <div className="tu-betterresult tu-processing-content">
                <div className="tu-maintitle">
                  <img src={zigzaglineImg} alt="img" />
                  <h4>Why our working is so unique</h4>
                  <h2>See how our working process easily adapt your need</h2>
                </div>
                <ul className="tu-processing-list">
                  <li>
                    <div className="tu-processinglist-info">
                      <i className="icon icon-smile tu-iconpurple_bgclr"></i>
                      <h4>User friendly hiring process</h4>
                    </div>
                    <p>
                      Aeccusamus etmaes iusto odiomae dignissimos ducimus
                      quistames blanditiis praesentium voluptatum loramkes
                      anuten.
                    </p>
                  </li>
                  <li>
                    <div className="tu-processinglist-info">
                      <i className="icon icon-umbrella tu-icongreen_bgclr"></i>
                      <h4>Verified process with ease</h4>
                    </div>
                    <p>
                      Aeccusamus etmaes iusto odiomae dignissimos ducimus
                      quistames blanditiis praesentium voluptatum loramkes
                      anuten.
                    </p>
                  </li>
                  <li>
                    <div className="tu-processinglist-info">
                      <i className="icon icon-shield tu-iconorange_bgclr"></i>
                      <h4>Secure payment gateway integrated</h4>
                    </div>
                    <p>
                      Aeccusamus etmaes iusto odiomae dignissimos ducimus
                      quistames blanditiis praesentium voluptatum loramkes
                      anuten.
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </Layout>
    </>
  );
};

export default AboutUs;
