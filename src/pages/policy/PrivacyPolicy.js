import React from "react";
import Layout from "../../components/Layout";

const PrivacyPolicy = () => {
  return (
    <>
      <Layout>
        <div className="tu-main-section tu-policy">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <article className="tu-theme-box">
                  <header className="mb-3 mb-sm-5">
                    <h3>Privacy Policy</h3>
                  </header>

                  <div className="entry-content">
                    <div className="my-3">
                      <h4>1. Introduction</h4>
                      <p>
                        Welcome to Tutor ("we," "our," or "us"). We are
                        committed to protecting the privacy and personal
                        information of our users ("you" or "users"). This
                        Privacy Policy explains how we collect, use, disclose,
                        and safeguard your personal information when you use our
                        website and services.
                      </p>
                    </div>

                    <div className="my-3">
                      <h4>2. Information We Collect</h4>
                      <h5>
                        We may collect the following types of personal
                        information:
                      </h5>
                      <p>
                        User Account Information: When you create an account, we
                        collect your name, email address, and password.
                      </p>
                      <p>
                        Profile Information: Users may choose to provide
                        additional information in their profiles, such as
                        profile pictures, contact information, education
                        background, and subjects of interest.
                      </p>
                      <p>
                        Booking and Payment Information: When you book tutoring
                        sessions or make payments through our platform, we
                        collect payment information, including credit card
                        details and billing address.
                      </p>
                      <p>
                        Communication Data: We may collect and store
                        communications made through our platform, including
                        messages between students and tutors.
                      </p>
                      <p>
                        Usage Information: We collect information about your
                        interactions with our website, including IP addresses,
                        browser type, device information, and pages visited.
                      </p>
                      <p>
                        Feedback and Reviews: Users may submit feedback and
                        reviews about tutors and sessions.
                      </p>
                    </div>

                    <div className="my-3">
                      <h4>3. How We Use Your Information</h4>
                      <h5>
                        We may use your personal information for the following
                        purposes:
                      </h5>
                      <p>
                        Provide Services: To facilitate tutor-student
                        connections, manage bookings, and process payments.
                      </p>
                      <p>
                        Communication: To communicate with you about bookings,
                        updates, and promotions.
                      </p>
                      <p>
                        Improve Our Services: To analyze user behavior and
                        feedback to enhance our platform and services.
                      </p>
                      <p>
                        Security: To protect our website, users, and prevent
                        fraud.
                      </p>
                      <p>
                        Legal Compliance: To comply with legal obligations and
                        enforce our terms and policies.
                      </p>
                    </div>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default PrivacyPolicy;
