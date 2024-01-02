import React from "react";
import { Link } from "react-router-dom";
import Layout from "../../components/Layout";

const PageNotFound = () => {
  return (
    <>
      <Layout>
        <div class="tu-main-section">
          <div class="container">
            <div class="row align-items-center">
              <div class="col-lg-6">
                <div class="tu-notfound">
                  <div class="tu-notfound-title">
                    <h4>You running into nowhere</h4>
                    <h2>Uhoo! Page not found</h2>
                    <p>
                      It looks like nothing was found on this path. Maybe you
                      should try with another link.
                    </p>
                  </div>

                  <div class="tu-description">
                    <p>
                      You can also start from scratch. Goto
                      <Link to="./" className="mx-1">
                        Homepage
                      </Link>
                      instead
                    </p>
                  </div>
                </div>
              </div>
              <div class="col-lg-6">
                <figure class="tu-notfound-img">
                  <img src="https://demos.wp-guppy.com/tuturn/wp-content/uploads/2022/05/Placeholder-1-4.png" />
                </figure>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default PageNotFound;
