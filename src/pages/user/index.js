import React from "react";
import UserSidebar from "./components/UserProfile/UserSidebar";
import { Outlet, useLocation } from "react-router-dom";
import Layout from "../../components/Layout";
import UserProgressBarContainer from "../user/components/UserProfile/UserProgressBarContainer";
import { useSelector } from "react-redux";

const UserProfile = () => {
  const location = useLocation();
  const userData = useSelector((state) => state.userData?.userData);
  return (
    <>
      <Layout>
        {userData?.user_type === 2 && (
          <UserProgressBarContainer location={location} />
        )}
        <div className="tu-main tu-bgmain user_profile_layout">
          <div className="tu-main-section">
            <div className="container">
              <div className="row gy-4">
                <div className="col-lg-4 col-xl-3">
                  <UserSidebar />
                </div>
                <div className="col-lg-8 col-xl-9">
                  <div className="tu-profilewrapper">
                    <Outlet />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default UserProfile;
