import React from "react";
import UserProfileProgessBar from "./UserProfileProgessBar";

const UserProgressBarContainer = ({ location }) => {
  const pathsToShowProgressBar = [
    "/user",
    "/user/contact-details",
    "/user/education",
    "/user/subjects",
    "/user/media"
  ];

  const showProgressBar = pathsToShowProgressBar.includes(location.pathname);

  return showProgressBar ? <UserProfileProgessBar /> : null;
};

export default UserProgressBarContainer;
