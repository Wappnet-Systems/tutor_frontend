import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { userService } from "../../service/userService";

const UserProfileProgessBar = () => {
  const [filledFieldCount, setFilledFieldCount] = useState(0);
  const userData = useSelector((state) => state.userData?.userData);
  const educationData = useSelector((state) => state?.educationData?.data);
  const subjectData = useSelector((state) => state?.subjectData?.data);
  const mediaData = useSelector((state) => state?.mediaData?.data);
  const userType = userData?.user_type;

  useEffect(() => {
    const tutorFieldsToCheck = [
      "first_name",
      "last_name",
      "tag_line",
      "dob",
      "address",
      "languages",
      "introduction",
      "hourly_rate",
      "gender",
      "contact_number",
      "email",
      "skype",
      "whatsapp",
      "website"
    ];

    const getUserEducation = () => {
      userService.getUserEducation().then((res) => {
        if (res?.data?.data.length > 0) {
          count++;
        }
        updateProgressBar();
      });
    };

    const getSubjects = () => {
      userService.getSubjects().then((res) => {
        if (res?.data?.data.length > 0) {
          count++;
        }
        updateProgressBar();
      });
    };

    const getUserMedia = () => {
      userService.getUserMedia().then((res) => {
        if (res?.data?.data.length > 0) {
          count++;
        }
        updateProgressBar();
      });
    };

    let count = 1;
    if (userType == 2) {
      if (
        userData.teach_at_offline === true ||
        userData.teach_at_online === true
      ) {
        count = 2;
      }
    }

    const updateProgressBar = () => {
      if (userType === 2) {
        const integerPercentage = parseInt((count / 18) * 100);
        setFilledFieldCount(integerPercentage);
      }
    };

    tutorFieldsToCheck.forEach((field) => {
      if (
        (typeof userData[field] === "string" &&
          userData[field].trim() !== "") ||
        (field === "gender" && userData[field] !== null)
      ) {
        count++;
      }
    });

    getUserEducation();
    getSubjects();
    getUserMedia();

    updateProgressBar();
  }, [educationData, subjectData, mediaData, userData]);

  return (
    <div className="progress profile_progess">
      <div
        className="progress-bar"
        role="progressbar"
        style={{ width: `${filledFieldCount}%` }}
        aria-valuenow={filledFieldCount}
        aria-valuemin="0"
        aria-valuemax="100"
      >
        {`${filledFieldCount}% Completed`}
      </div>
    </div>
  );
};

export default UserProfileProgessBar;
