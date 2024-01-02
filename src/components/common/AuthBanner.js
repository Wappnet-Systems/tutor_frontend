import React from "react";
import { Link } from "react-router-dom";

const AuthBanner = ({ logoImg, bannerImg, bannerTitle, bannerSmallText }) => {
  return (
    <div className="tu-login-left">
      <strong>
        <Link to="/" className="d-inline-block">
          <img src={logoImg} alt="images" className="tu-left-banner-logo" />
        </Link>
      </strong>
      <figure className="tu-left-main-banner">
        <img src={bannerImg} alt="images" />
      </figure>
      <div className="tu-login-left_title">
        <h2>{bannerTitle}</h2>
        <span>{bannerSmallText}</span>
      </div>
    </div>
  );
};

export default AuthBanner;
