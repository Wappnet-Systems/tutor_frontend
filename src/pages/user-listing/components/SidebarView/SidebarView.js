import React from "react";
import { Link } from "react-router-dom";

export const SidebarView = ({ tutorData }) => {
  const access_token = localStorage.getItem("access_token");

  const formatContactNumber = () => {
    if (!access_token && tutorData?.contact_number) {
      const number = tutorData.contact_number;
      return number.slice(0, 2) + "******" + number.slice(-2);
    } else {
      return tutorData?.contact_number;
    }
  };

  const formatWhatsappNumber = () => {
    if (!access_token && tutorData?.whatsapp) {
      const number = tutorData.whatsapp;
      return number.slice(0, 2) + "******" + number.slice(-2);
    } else {
      return tutorData?.whatsapp;
    }
  };

  const formatEmail = () => {
    if (!access_token && tutorData?.email) {
      const emailLength = tutorData.email.length;
      const asterisks = "*".repeat(emailLength - 4);
      return tutorData.email.slice(0, 2) + asterisks + ".com";
    } else {
      return tutorData?.email;
    }
  };
  const formatSkype = () => {
    if (!access_token && tutorData?.skype) {
      const skypeLength = tutorData?.skype.length;
      const asterisks = "*".repeat(skypeLength - 4);
      return (
        tutorData?.skype.slice(0, 2) + asterisks + tutorData?.skype.slice(-2)
      );
    } else {
      return tutorData?.skype;
    }
  };

  return (
    <div className="col-xl-4 col-xxl-4">
      <aside className="tu-asidedetail">
        {(tutorData?.teach_at_online || tutorData?.teach_at_offline) && (
          <>
            <div className="tu-asideinfo text-center">
              <h5>Hello! You can have my teaching services direct at</h5>
            </div>
            <ul className="tu-featureinclude">
              {tutorData?.teach_at_online === true ? (
                <li>
                  <span className="icon icon-video tu-colororange">
                    <i>Online</i>
                  </span>
                  <em className="fa fa-check-circle tu-colorgreen"></em>
                </li>
              ) : (
                ""
              )}
              {tutorData?.teach_at_offline === true ? (
                <li>
                  <span className="icon icon-map-pin tu-colorblue">
                    <i>Offline</i>
                  </span>
                  <em className="fa fa-check-circle tu-colorgreen"></em>
                </li>
              ) : (
                ""
              )}
            </ul>
          </>
        )}

        {(tutorData?.whatsapp ||
          tutorData?.skype ||
          tutorData?.email ||
          tutorData?.contact_number) && (
          <div className="tu-contactbox">
            <h6>Contact details</h6>
            <ul className="tu-listinfo">
              {tutorData?.contact_number === "" ? (
                ""
              ) : (
                <li>
                  <span className="tu-bg-maroon">
                    <i className="icon icon-phone-call "></i>
                  </span>
                  <h6>{formatContactNumber()}</h6>
                </li>
              )}

              {tutorData?.email === "" ? (
                ""
              ) : (
                <li>
                  <span className="tu-bg-voilet">
                    <i className="icon icon-mail"></i>
                  </span>
                  <h6>{formatEmail()}</h6>
                </li>
              )}

              {tutorData?.skype === "" ? (
                ""
              ) : (
                <li>
                  <span className="tu-bg-blue">
                    <i className="fab fa-skype"></i>
                  </span>
                  <h6>{formatSkype()}</h6>
                </li>
              )}

              {tutorData?.whatsapp === "" ? (
                ""
              ) : (
                <li>
                  <span className="tu-bg-green">
                    <i className="fab fa-whatsapp"></i>
                  </span>
                  <h6>{formatWhatsappNumber()}</h6>
                </li>
              )}
            </ul>
          </div>
        )}

        {localStorage.getItem("access_token") ? (
          ""
        ) : (
          <div class="tu-unlockfeature text-center">
            <h6>
              Click the button below to login &amp; unlock the contact details
            </h6>
            <Link to="/login" class="tu-primbtn tu-btngreen">
              <span>Unlock feature</span>
              <i class="icon icon-lock"></i>
            </Link>
          </div>
        )}
      </aside>
    </div>
  );
};
