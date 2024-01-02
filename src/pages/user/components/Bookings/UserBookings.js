import React from "react";
import { useSelector } from "react-redux";
import StudentBookings from "./StudentBookings";
import TutorBookings from "./TutorBookings";

const UserBookings = () => {
  const userData = useSelector((state) => state.userData?.userData);
  return (
    <>
      {userData?.user_type === 2 && <TutorBookings />}
      {userData?.user_type === 3 && <StudentBookings />}
    </>
  );
};

export default UserBookings;
