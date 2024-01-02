import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "../pages/homepage";
import SearchListing from "../pages/user-listing";
import SignupTutor from "../pages/auth/signup";
import Login from "../pages/auth/login";
import ForgotPassword from "../pages/auth/forgotPassword";
import ResetPassword from "../pages/auth/resetPassword";
import UserProfile from "../pages/user";
import UserPersonalDetails from "../pages/user/components/UserProfile/UserPersonalDetails";
import UserContactDetails from "../pages/user/components/UserProfile/UserContactDetails";
import UserSubjects from "../pages/user/components/UserProfile/UserSubjects";
import UserEducation from "../pages/user/components/UserProfile/UserEducation";
import UserMedia from "../pages/user/components/UserProfile/UserMedia";
import UserListingViewDetails from "../pages/user-listing/components/UserListingViewDetails";
import UserCalendar from "../pages/user/components/Calendar/UserCalendar";
import OtpVerification from "../pages/auth/otpVerification";
import UserBookmarks from "../pages/user/components/UserProfile/UserBookmarks";
import UserBookings from "../pages/user/components/Bookings/UserBookings";
import UserAssignment from "../pages/user/components/Assignments/UserAssignment";
import { Changepassword } from "../pages/auth/changePassword";
import TransactionIndex from "../pages/user/components/Transaction-earnings/TransactionIndex";
import Chat from "../pages/chat";
import TutorNotification from "../pages/user/components/Notification/TutorNotification";
import AboutUs from "../pages/about";
import FAQ from "../pages/faq";
import TermsAndConditions from "../pages/policy/TermsAndConditions";
import PrivacyPolicy from "../pages/policy/PrivacyPolicy";
import TutorBookingSchedule from "../pages/user/components/Tutor-schedule/TutorBookingSchedule";
import { UserChangePassword } from "../pages/user/components/UserProfile/UserChangePassword";
import PublicRoute from "./PublicRoute";
import ProtectedRoute from "./ProtectedRoute";
import PageNotFound from "../pages/page-not-found";
import { useSelector } from "react-redux";

const AppRoutes = () => {
  const userData = useSelector((state) => state.userData?.userData);
  const userType = userData?.user_type;
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <PublicRoute protect={false}>
              <HomePage />
            </PublicRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute protect={true}>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute protect={true}>
              <SignupTutor />
            </PublicRoute>
          }
        />
        <Route
          path="/verify-otp"
          element={
            <PublicRoute protect={true}>
              <OtpVerification />
            </PublicRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PublicRoute protect={true}>
              <ForgotPassword />
            </PublicRoute>
          }
        />
        <Route
          path="/reset-password"
          element={
            <PublicRoute protect={true}>
              <ResetPassword />
            </PublicRoute>
          }
        />
        <Route
          path="/reset-password/:token"
          element={
            <PublicRoute protect={true}>
              <ResetPassword />
            </PublicRoute>
          }
        />
        <Route
          path="/search-listing"
          element={
            <PublicRoute protect={false}>
              <SearchListing />
            </PublicRoute>
          }
        />
        <Route
          path="/search-listing/:id"
          element={
            <PublicRoute protect={false}>
              <SearchListing />
            </PublicRoute>
          }
        />

        <Route
          path="/search-listing-view/:id"
          element={
            <PublicRoute protect={false}>
              <UserListingViewDetails />
            </PublicRoute>
          }
        />
        <Route
          path="/about-us"
          element={
            <PublicRoute protect={false}>
              <AboutUs />
            </PublicRoute>
          }
        />
        <Route
          path="/faq"
          element={
            <PublicRoute protect={false}>
              <FAQ />
            </PublicRoute>
          }
        />
        <Route
          path="/terms-and-conditions"
          element={
            <PublicRoute protect={false}>
              <TermsAndConditions />
            </PublicRoute>
          }
        />
        <Route
          path="/privacy-policy"
          element={
            <PublicRoute protect={false}>
              <PrivacyPolicy />
            </PublicRoute>
          }
        />
        <Route
          path="/change-password"
          element={
            <PublicRoute protect={true}>
              <Changepassword />
            </PublicRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat/:id"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        >
          {userType === undefined ? (
            <>
              <Route path="" element={<UserPersonalDetails />} />
              <Route path="contact-details" element={<UserContactDetails />} />
              <Route path="bookings" element={<UserBookings />} />
              <Route path="assignment" element={<UserAssignment />} />
              <Route path="notifications" element={<TutorNotification />} />
              <Route path="change-password" element={<UserChangePassword />} />
              <Route path="subjects" element={<UserSubjects />} />
              <Route path="education" element={<UserEducation />} />
              <Route path="media" element={<UserMedia />} />
              <Route path="calendar" element={<UserCalendar />} />
              <Route
                path="transaction-earnings"
                element={<TransactionIndex />}
              />
              <Route path="schedules" element={<TutorBookingSchedule />} />
              <Route path="bookmarks" element={<UserBookmarks />} />
            </>
          ) : (
            <>
              {/* Common routes */}
              <Route path="" element={<UserPersonalDetails />} />
              <Route path="contact-details" element={<UserContactDetails />} />
              <Route path="bookings" element={<UserBookings />} />
              <Route path="assignment" element={<UserAssignment />} />
              <Route path="notifications" element={<TutorNotification />} />
              <Route path="change-password" element={<UserChangePassword />} />

              {/* Tutor Routes */}
              {userType === 2 && (
                <>
                  <Route path="subjects" element={<UserSubjects />} />
                  <Route path="education" element={<UserEducation />} />
                  <Route path="media" element={<UserMedia />} />
                  <Route path="calendar" element={<UserCalendar />} />
                  <Route
                    path="transaction-earnings"
                    element={<TransactionIndex />}
                  />
                  <Route path="schedules" element={<TutorBookingSchedule />} />
                </>
              )}

              {/* Student Routes */}
              {userType !== 2 && (
                <>
                  <Route path="bookmarks" element={<UserBookmarks />} />
                </>
              )}
            </>
          )}
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
