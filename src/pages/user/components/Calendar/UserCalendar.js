import React from "react";
import { useSelector } from "react-redux";
import TutorCalendar from "./TutorCalendar";
import StudentCalendar from "./StudentCalendar";

const UserBookings = () => {
  const userData = useSelector((state) => state.userData?.userData);
  return (
    <>
      {userData?.user_type === 2 && <TutorCalendar />}
      {userData?.user_type === 3 && <StudentCalendar />}
    </>
  );
};

export default UserBookings;
