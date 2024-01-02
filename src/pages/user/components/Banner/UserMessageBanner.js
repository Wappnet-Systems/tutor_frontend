import React from "react";
import { useSelector } from "react-redux";
import { RequestStatusType } from "../Bookings/CommonEnum";

const UserMessageBanner = () => {
  const userData = useSelector((state) => state.userData?.userData);

  return (
    <>
      {userData?.tutorApprovalRequest?.status == RequestStatusType.PENDING && (
        <div className="tu-boxitem mb-4">
          <div className="tu-alertcontent">
            <h4>Your Profile is under review</h4>
            <p>
              Your Profile Is Under review. Please wait until you get approved.
            </p>
          </div>
        </div>
      )}
      {userData?.tutorApprovalRequest?.status == RequestStatusType.REJECTED && (
        <div className="tu-boxitem mb-4">
          <div className="tu-alertcontent">
            <h4>Your profile has been rejected</h4>
            <p>{userData?.tutorApprovalRequest?.remarks}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default UserMessageBanner;
