import React from "react";
import { useSelector } from "react-redux";
import TutorAssignments from "./TutorAssignments";
import StudentAssignments from "./StudentAssignments";

const UserAssignment = () => {
  const userData = useSelector((state) => state.userData?.userData);
  return (
    <>
      {userData?.user_type === 2 && <TutorAssignments />}
      {userData?.user_type === 3 && <StudentAssignments />}
    </>
  );
};

export default UserAssignment;
