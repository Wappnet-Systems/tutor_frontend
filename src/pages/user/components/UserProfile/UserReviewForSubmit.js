import React, { useState } from "react";
import { toast } from "react-toastify";
import { userService } from "../../service/userService";
import { useDispatch, useSelector } from "react-redux";
import { RequestStatusType } from "../Bookings/CommonEnum";
import { setUserData } from "../../../../redux/actions/action";
const UserReviewForSubmit = () => {
  const userData = useSelector((state) => state.userData?.userData);
  const dispatch = useDispatch();
  const [isLoading, setisLoading] = useState(false);

  const submitProfileForVerification = () => {
    setisLoading(true);
    userService
      .verification()
      .then((res) => {
        getUser();
        toast.success(res.data.message[0]);
        setisLoading(false);
      })
      .catch((ex) => {
        setisLoading(false);
      });
  };

  const getUser = () => {
    userService.getUser().then((res) => {
      dispatch(setUserData(res?.data?.user));
    });
  };

  return (
    <>
      {userData?.tutorApprovalRequest?.status == RequestStatusType.ACCEPTED ||
      userData?.tutorApprovalRequest?.status == RequestStatusType.PENDING ? (
        <></>
      ) : (
        <button
          type="button"
          className="profile_review tu-primbtn-lg me-2"
          onClick={submitProfileForVerification}
          disabled={isLoading}
        >
          Submit Profile For Review
        </button>
      )}
    </>
  );
};

export default UserReviewForSubmit;
