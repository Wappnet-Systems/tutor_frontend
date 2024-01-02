import React from "react";
import Layout from "../../components/Layout";
import { Accordion } from "react-bootstrap";

const FAQ = () => {
  return (
    <>
      <Layout>
        <div className="tu-main-section">
          <div className="container">
            <div className="faq-section">
              <h3 className="mb-4">FAQ's</h3>
              <Accordion className="custom-accordion" flush>
                <Accordion.Item eventKey="0">
                  <Accordion.Header>
                    How do I find a tutor on this platform?
                  </Accordion.Header>
                  <Accordion.Body>
                    You can search for a tutor by subject, location,
                    availability, and other criteria. Simply enter your
                    preferences in the search filters, and a list of suitable
                    tutors will be displayed.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                  <Accordion.Header>
                    Can I view a tutor's profile before booking a session?
                  </Accordion.Header>
                  <Accordion.Body>
                    Yes, you can view a tutor's profile, which includes
                    information about their qualifications, teaching experience,
                    areas of expertise, and student reviews.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2">
                  <Accordion.Header>
                    How do I book a tutoring session?
                  </Accordion.Header>
                  <Accordion.Body>
                    To book a session, select the tutor you're interested in and
                    click on their profile. You'll see their availability
                    calendar. Choose a date and time that works for you and
                    click "Book." Follow the prompts to confirm the booking.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="3">
                  <Accordion.Header>
                    How much does tutoring cost?
                  </Accordion.Header>
                  <Accordion.Body>
                    Tutoring rates vary depending on the tutor's qualifications
                    and the subject. The tutor's profile will display their
                    hourly rate. You can choose a tutor that fits your budget.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="4">
                  <Accordion.Header>
                    How do I provide feedback on my tutoring experience?
                  </Accordion.Header>
                  <Accordion.Body>
                    After each session, you'll have the opportunity to leave
                    feedback and a rating for your tutor. Your feedback helps
                    other students make informed choices.
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default FAQ;
